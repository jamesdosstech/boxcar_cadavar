require("dotenv").config();
const admin = require("firebase-admin");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    });
}
const db = admin.firestore();

exports.handler = async (event) => {
    // Stripe signature header
    const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

    let stripeEvent;
    try {
        // Netlify may give base64 body
        const payload = event.isBase64Encoded
            ? Buffer.from(event.body, "base64")
            : event.body; // raw string

        stripeEvent = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verify failed:", err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    try {
        // -----------------------
        // PAYMENT SUCCEEDED
        // -----------------------
        if (stripeEvent.type === "payment_intent.succeeded") {
            const pi = stripeEvent.data.object;
            const orderId = pi?.metadata?.orderId;

            if (!orderId) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ received: true, note: "No orderId in metadata" }),
                };
            }

            const orderRef = db.collection("orders").doc(orderId);

            await db.runTransaction(async (tx) => {
                const orderSnap = await tx.get(orderRef);
                if (!orderSnap.exists) return;

                const order = orderSnap.data();

                // idempotency guard (prevents double decrement)
                if (order.inventoryApplied === true) {
                    // ensure paid status (just in case)
                    if (order.status !== "paid") {
                        tx.set(
                            orderRef,
                            {
                                status: "paid",
                                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                                paymentIntentId: pi.id,
                            },
                            { merge: true }
                        );
                    }
                    return;
                }

                const items = Array.isArray(order.items) ? order.items : [];

                // mark paid even if no items
                if (!items.length) {
                    tx.set(
                        orderRef,
                        {
                            status: "paid",
                            inventoryApplied: true,
                            paidAt: admin.firestore.FieldValue.serverTimestamp(),
                            paymentIntentId: pi.id,
                        },
                        { merge: true }
                    );
                    return;
                }

                // fetch product docs inside transaction
                const productRefs = items.map((it) => db.collection("products").doc(it.productId));
                const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

                // validate + decrement
                for (let idx = 0; idx < items.length; idx++) {
                    const it = items[idx];
                    const productSnap = productSnaps[idx];

                    if (!productSnap.exists) {
                        // product removed / missing: mark order for attention, do not decrement anything
                        tx.set(
                            orderRef,
                            {
                                status: "needs_attention",
                                paymentIntentId: pi.id,
                                attentionReason: `Product missing: ${it.productId}`,
                                attentionAt: admin.firestore.FieldValue.serverTimestamp(),
                            },
                            { merge: true }
                        );
                        return;
                    }

                    const product = productSnap.data();
                    const currentQty = Number(product.quantity ?? 0);
                    const buyQty = Number(it.qty ?? 0);

                    if (!Number.isFinite(buyQty) || buyQty <= 0) {
                        tx.set(
                            orderRef,
                            {
                                status: "needs_attention",
                                paymentIntentId: pi.id,
                                attentionReason: `Invalid qty in order item: ${it.productId}`,
                                attentionAt: admin.firestore.FieldValue.serverTimestamp(),
                            },
                            { merge: true }
                        );
                        return;
                    }

                    // Oversell handling: do NOT throw 500 forever
                    if (currentQty < buyQty) {
                        tx.set(
                            orderRef,
                            {
                                status: "oversold",
                                paymentIntentId: pi.id,
                                oversoldAt: admin.firestore.FieldValue.serverTimestamp(),
                                oversoldReason: `Insufficient stock for ${it.productId}: have ${currentQty}, need ${buyQty}`,
                            },
                            { merge: true }
                        );
                        return;
                    }

                    // decrement stock
                    tx.update(productRefs[idx], {
                        quantity: currentQty - buyQty,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }

                // all decremented successfully -> mark paid + inventory applied
                tx.set(
                    orderRef,
                    {
                        status: "paid",
                        inventoryApplied: true,
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        paymentIntentId: pi.id,
                    },
                    { merge: true }
                );
            });
        }

        // -----------------------
        // PAYMENT FAILED
        // -----------------------
        if (stripeEvent.type === "payment_intent.payment_failed") {
            const pi = stripeEvent.data.object;
            const orderId = pi?.metadata?.orderId;

            if (orderId) {
                await db.collection("orders").doc(orderId).set(
                    {
                        status: "failed",
                        failedAt: admin.firestore.FieldValue.serverTimestamp(),
                        paymentIntentId: pi.id,
                    },
                    { merge: true }
                );
            }
        }

        return { statusCode: 200, body: JSON.stringify({ received: true }) };
    } catch (err) {
        console.error("Webhook handler error:", err);

        // IMPORTANT:
        // If we return 500, Stripe will retry. That’s good for transient errors.
        // But if your errors are logical oversell, we handle those as 200 above.
        return { statusCode: 500, body: "Webhook handler error" };
    }
};
