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

// --- helpers ---
function clampQty(q) {
    const n = Number(q || 1);
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(10, Math.floor(n)));
}

function computeShipping(subtotalCents) {
    if (subtotalCents >= 30000) return 0;     // free over $300
    if (subtotalCents >= 10000) return 2000;  // $20 over $100
    return 1500;                              // $15 otherwise
}

function validateShipping(shipping) {
    if (!shipping) return "Missing shipping info";
    if (!shipping.email) return "Missing email";
    if (!shipping.name) return "Missing name";

    const a = shipping.address || {};
    if (!a.line1 || !a.city || !a.state || !a.postal_code || !a.country) {
        return "Missing address fields";
    }
    return null;
}

// --- main handler ---
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const { items, uid, orderId, shipping } = JSON.parse(event.body || "{}");

        // ---- validate request ----
        if (!orderId || typeof orderId !== "string") {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing orderId" }) };
        }

        const shippingErr = validateShipping(shipping);
        if (shippingErr) {
            return { statusCode: 400, body: JSON.stringify({ error: shippingErr }) };
        }

        if (!Array.isArray(items) || items.length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: "Cart is empty" }) };
        }

        // ---- load product snapshots from Firestore ----
        const refs = items.map((i) => db.collection("products").doc(i.productId));
        const snaps = await db.getAll(...refs);

        const products = new Map();
        snaps.forEach((s) => s.exists && products.set(s.id, s.data()));

        let subtotalCents = 0;
        const normalizedItems = [];

        for (const i of items) {
            const p = products.get(i.productId);

            if (!p) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: `Inactive product: ${i.productId}` }),
                };
            }

            const qty = clampQty(i.qty);
            const priceCents = Number(p.price);

            if (!Number.isInteger(priceCents) || priceCents <= 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: `Invalid price for: ${p.name || i.productId}` }),
                };
            }

            // stock check (best-effort, final stock decrement happens in webhook)
            if (typeof p.quantity === "number" && qty > p.quantity) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: `Insufficient stock: ${p.name || i.productId}` }),
                };
            }

            subtotalCents += priceCents * qty;

            normalizedItems.push({
                productId: i.productId,
                qty,
                nameSnapshot: p.name || "",
                priceCentsSnapshot: priceCents,
                imageSnapshot: p.imageUrl || null,
            });
        }

        const shippingCents = computeShipping(subtotalCents);
        const totalCents = subtotalCents + shippingCents;

        // ---- order doc: idempotent behavior ----
        const orderRef = db.collection("orders").doc(orderId);
        const existingSnap = await orderRef.get();

        // If order exists and already has PI, return existing PI clientSecret
        if (existingSnap.exists) {
            const existingOrder = existingSnap.data();

            if (existingOrder?.paymentIntentId) {
                const pi = await stripe.paymentIntents.retrieve(existingOrder.paymentIntentId);

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        clientSecret: pi.client_secret,
                        orderId,
                        summary: {
                            subtotalCents: existingOrder.subtotalCents,
                            shippingCents: existingOrder.shippingCents,
                            totalCents: existingOrder.totalCents,
                        },
                    }),
                };
            }

            // exists but no PI yet -> merge update without overwriting existing fields
            await orderRef.set(
                {
                    uid: uid || null,
                    items: normalizedItems,
                    subtotalCents,
                    shippingCents,
                    totalCents,
                    currency: "usd",
                    status: existingOrder?.status || "pending",
                    createdAt: existingOrder?.createdAt || admin.firestore.FieldValue.serverTimestamp(),
                    contact: {
                        name: shipping.name,
                        email: shipping.email,
                        phone: shipping.phone || null,
                    },
                    shippingAddress: shipping.address,
                    deliveryNotes: shipping.deliveryNotes || "",
                    inventoryApplied: existingOrder?.inventoryApplied ?? false,
                },
                { merge: true }
            );
        } else {
            // brand new order
            await orderRef.set({
                uid: uid || null,
                items: normalizedItems,
                subtotalCents,
                shippingCents,
                totalCents,
                currency: "usd",
                status: "pending",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                contact: {
                    name: shipping.name,
                    email: shipping.email,
                    phone: shipping.phone || null,
                },
                shippingAddress: shipping.address,
                deliveryNotes: shipping.deliveryNotes || "",
                inventoryApplied: false,
                paymentIntentId: null,
            });
        }

        // ---- create PaymentIntent (idempotent) ----
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: totalCents,
                currency: "usd",
                automatic_payment_methods: { enabled: true },
                metadata: { orderId, uid: uid || "" },

                receipt_email: shipping.email,

                shipping: {
                    name: shipping.name,
                    phone: shipping.phone || undefined,
                    address: {
                        line1: shipping.address.line1,
                        line2: shipping.address.line2 || undefined,
                        city: shipping.address.city,
                        state: shipping.address.state,
                        postal_code: shipping.address.postal_code,
                        country: shipping.address.country,
                    },
                },
            },
            { idempotencyKey: `pi_${orderId}` }
        );

        // store PI id on order so we can re-return same intent if user refreshes
        await orderRef.set(
            {
                paymentIntentId: paymentIntent.id,
            },
            { merge: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                orderId,
                summary: { subtotalCents, shippingCents, totalCents },
            }),
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
    }
};
