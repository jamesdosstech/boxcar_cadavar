import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";

const money = (cents) => `$${((Number(cents) || 0) / 100).toFixed(2)}`;

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const { clearCart } = useCart();

  // Stripe redirect params (sometimes present)
  const paymentIntent = params.get("payment_intent");
  const redirectStatus = params.get("redirect_status");

  // Our preferred param (we pass this from CheckoutForm)
  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderErr, setOrderErr] = useState("");

  // prevent multiple clearCart calls (React StrictMode / re-renders)
  const clearedRef = useRef(false);

  const isSuccess = useMemo(() => {
    // either Stripe says succeeded OR user got here with orderId after non-redirect success
    if (redirectStatus === "succeeded") return true;
    if (orderId) return true;
    return false;
  }, [redirectStatus, orderId]);

  // Clear cart on success (only once)
  useEffect(() => {
    if (!isSuccess) return;
    if (clearedRef.current) return;
    clearedRef.current = true;
    clearCart?.();
  }, [isSuccess, clearCart]);

  // Load order from Firestore if we have orderId
  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const run = async () => {
      setOrderErr("");
      setLoadingOrder(true);
      try {
        const ref = doc(db, "orders", orderId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          throw new Error("Order not found yet.");
        }

        if (!cancelled) {
          setOrder({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        if (!cancelled) setOrderErr(e?.message || "Failed to load order.");
      } finally {
        if (!cancelled) setLoadingOrder(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: 900, margin: "0 auto" }}>
      <h2>{isSuccess ? "Payment Successful" : "Payment Status"}</h2>

      {isSuccess ? (
        <>
          <p>Thank you! Your payment was received.</p>

          {/* References */}
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: 12,
              background: "rgba(0,0,0,0.35)",
            }}
          >
            {orderId && (
              <p style={{ margin: 0, opacity: 0.9 }}>
                Order ID: <code>{orderId}</code>
              </p>
            )}

            {paymentIntent && (
              <p style={{ margin: 0, opacity: 0.8 }}>
                Payment reference: <code>{paymentIntent}</code>
              </p>
            )}

            {redirectStatus && (
              <p style={{ margin: 0, opacity: 0.7 }}>
                Stripe status: <strong>{redirectStatus}</strong>
              </p>
            )}
          </div>

          {/* Order details */}
          {orderId && (
            <div style={{ marginTop: "1rem" }}>
              <h3 style={{ marginBottom: ".5rem" }}>Order Details</h3>

              {loadingOrder && <p style={{ opacity: 0.85 }}>Loading order…</p>}

              {!loadingOrder && orderErr && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: 12,
                    background: "rgba(255,0,0,0.15)",
                    marginBottom: "1rem",
                  }}
                >
                  {orderErr}
                  <div style={{ marginTop: ".5rem", opacity: 0.8 }}>
                    If you just paid, your order doc might take a moment to appear or update.
                  </div>
                </div>
              )}

              {!loadingOrder && order && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: 12,
                    background: "rgba(0,0,0,0.35)",
                    display: "grid",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ opacity: 0.8 }}>Status</div>
                      <div style={{ fontWeight: 900, textTransform: "uppercase" }}>
                        {order.status || "unknown"}
                      </div>
                      <div style={{ opacity: 0.7, fontSize: ".9rem" }}>
                        (If this still says <code>pending</code>, your webhook will flip it to <code>paid</code> shortly.)
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ opacity: 0.8 }}>Total</div>
                      <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                        {money(order.totalCents)}
                      </div>
                      <div style={{ opacity: 0.8 }}>
                        Shipping: {money(order.shippingCents)}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <div style={{ opacity: 0.8, marginBottom: ".35rem" }}>Items</div>
                    <div style={{ display: "grid", gap: ".6rem" }}>
                      {(order.items || []).map((it, idx) => (
                        <div
                          key={`${it.productId || "p"}_${idx}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "64px 1fr auto",
                            gap: ".75rem",
                            alignItems: "center",
                            padding: ".6rem",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.05)",
                          }}
                        >
                          <img
                            src={it.imageSnapshot || ""}
                            alt={it.nameSnapshot || "Item"}
                            style={{ width: 64, height: 56, objectFit: "cover", borderRadius: 10 }}
                          />
                          <div>
                            <div style={{ fontWeight: 800 }}>{it.nameSnapshot}</div>
                            <div style={{ opacity: 0.85, fontSize: ".95rem" }}>
                              Qty: {it.qty} • {money(it.priceCentsSnapshot)} each
                            </div>
                          </div>
                          <div style={{ fontWeight: 900 }}>
                            {money((it.priceCentsSnapshot || 0) * (it.qty || 0))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  {(order.shippingAddress || order.contact) && (
                    <div>
                      <div style={{ opacity: 0.8, marginBottom: ".35rem" }}>Shipping</div>
                      <div style={{ opacity: 0.9, lineHeight: 1.4 }}>
                        {order.contact?.name && <div>{order.contact.name}</div>}
                        {order.contact?.email && <div>{order.contact.email}</div>}
                        {order.contact?.phone && <div>{order.contact.phone}</div>}

                        {order.shippingAddress && (
                          <div style={{ marginTop: ".35rem" }}>
                            <div>{order.shippingAddress.line1}</div>
                            {order.shippingAddress.line2 ? <div>{order.shippingAddress.line2}</div> : null}
                            <div>
                              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                              {order.shippingAddress.postal_code}
                            </div>
                            <div>{order.shippingAddress.country}</div>
                          </div>
                        )}

                        {order.deliveryNotes ? (
                          <div style={{ marginTop: ".35rem", opacity: 0.85 }}>
                            Notes: {order.deliveryNotes}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/shop">Back to shop</Link>
            <Link to="/showroom">Go to showroom</Link>
          </div>
        </>
      ) : (
        <>
          <p>
            We received a redirect status: <strong>{redirectStatus || "unknown"}</strong>
          </p>
          <Link to="/checkout">Return to checkout</Link>
        </>
      )}
    </div>
  );
}
