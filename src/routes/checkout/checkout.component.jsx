import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/stripe/stripe.utils";
import CheckoutForm from "./Checkout-Form/CheckoutForm";
import { auth } from "../../utils/firebase/firebase.utils";

const genOrderId = () =>
  crypto?.randomUUID?.() ?? `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

// optional: quick states list for UX
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export default function Checkout() {
  const { cartItems, subtotalCents } = useCart();

  const [clientSecret, setClientSecret] = useState(null);
  const [summary, setSummary] = useState(null);
  const [orderId] = useState(() => genOrderId());

  const [error, setError] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(false);

  // Shipping state (matches your server validateShipping)
  const [shipping, setShipping] = useState(() => ({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
    deliveryNotes: "",
  }));

  // If user signs in after page load, prefill name/email once (doesn't overwrite if already typed)
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    setShipping((s) => ({
      ...s,
      name: s.name || u.displayName || "",
      email: s.email || u.email || "",
    }));
  }, []);

  // If cart becomes empty, reset checkout state
  useEffect(() => {
    if (cartItems.length === 0) {
      setClientSecret(null);
      setSummary(null);
      setError("");
    }
  }, [cartItems.length]);

  // DO NOT create payment intent automatically in an effect.
  // We'll do it only when user clicks "Continue to Payment".
  const validateClientShipping = () => {
    if (!shipping.name.trim()) return "Missing name";
    if (!shipping.email.trim()) return "Missing email";
    const a = shipping.address || {};
    if (!a.line1?.trim() || !a.city?.trim() || !a.state?.trim() || !a.postal_code?.trim() || !a.country?.trim()) {
      return "Missing address fields";
    }
    return "";
  };

  const createPaymentIntent = async () => {
    setError("");

    if (!cartItems.length) {
      setError("Cart is empty");
      return;
    }

    const shippingErr = validateClientShipping();
    if (shippingErr) {
      setError(shippingErr);
      return;
    }

    setLoadingIntent(true);
    try {
      const items = cartItems.map((i) => ({ productId: i.id, qty: i.quantity }));
      const uid = auth.currentUser?.uid || null;

      const res = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, uid, orderId, shipping }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create payment intent");

      setClientSecret(data.clientSecret);
      setSummary(data.summary);
    } catch (e) {
      setError(e?.message || "Server error creating payment.");
    } finally {
      setLoadingIntent(false);
    }
  };

  const options = useMemo(() => (clientSecret ? { clientSecret } : undefined), [clientSecret]);

  if (!cartItems.length) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/shop">Go to shop</Link>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
      <h2>Checkout</h2>

      {/* Basic cart summary */}
      <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 12, background: "rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ opacity: 0.85 }}>Items</div>
            <div style={{ fontWeight: 900 }}>{cartItems.length}</div>
          </div>

          <div>
            <div style={{ opacity: 0.85 }}>Cart Subtotal</div>
            <div style={{ fontWeight: 900 }}>{money(subtotalCents)}</div>
          </div>

          {summary ? (
            <>
              <div>
                <div style={{ opacity: 0.85 }}>Shipping</div>
                <div style={{ fontWeight: 900 }}>{money(summary.shippingCents)}</div>
              </div>
              <div>
                <div style={{ opacity: 0.85 }}>Total</div>
                <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>{money(summary.totalCents)}</div>
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.85 }}>Shipping + total shown after shipping info.</div>
          )}
        </div>

        <div style={{ marginTop: ".75rem", opacity: 0.75, fontSize: ".9rem" }}>
          Order ID: <code>{orderId}</code>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,0,0,0.15)" }}>
          {error}
        </div>
      )}

      {/* STEP 1: Shipping form (only show before clientSecret exists) */}
      {!clientSecret && (
        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: 12, background: "rgba(0,0,0,0.35)" }}>
          <h3 style={{ marginTop: 0 }}>Shipping & Contact</h3>

          <div style={{ display: "grid", gap: ".9rem" }}>
            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Full Name</label>
              <input
                value={shipping.name}
                onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                autoComplete="name"
              />
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Email</label>
              <input
                value={shipping.email}
                onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                autoComplete="email"
                type="email"
              />
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Phone (optional)</label>
              <input
                value={shipping.phone}
                onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                autoComplete="tel"
              />
            </div>

            <hr style={{ opacity: 0.2, width: "100%" }} />

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Address Line 1</label>
              <input
                value={shipping.address.line1}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, address: { ...s.address, line1: e.target.value } }))
                }
                autoComplete="address-line1"
              />
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Address Line 2 (optional)</label>
              <input
                value={shipping.address.line2}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, address: { ...s.address, line2: e.target.value } }))
                }
                autoComplete="address-line2"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: ".9rem" }}>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>City</label>
                <input
                  value={shipping.address.city}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address: { ...s.address, city: e.target.value } }))
                  }
                  autoComplete="address-level2"
                />
              </div>

              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>State</label>
                <select
                  value={shipping.address.state}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address: { ...s.address, state: e.target.value } }))
                  }
                  autoComplete="address-level1"
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: ".9rem" }}>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>ZIP</label>
                <input
                  value={shipping.address.postal_code}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address: { ...s.address, postal_code: e.target.value } }))
                  }
                  autoComplete="postal-code"
                />
              </div>

              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>Country</label>
                <select
                  value={shipping.address.country}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address: { ...s.address, country: e.target.value } }))
                  }
                  autoComplete="country"
                >
                  <option value="US">US</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Delivery Notes (optional)</label>
              <textarea
                rows={3}
                value={shipping.deliveryNotes}
                onChange={(e) => setShipping((s) => ({ ...s, deliveryNotes: e.target.value }))}
                placeholder="Gate code, leave at door, etc."
              />
            </div>

            <button onClick={createPaymentIntent} disabled={loadingIntent} style={{ padding: ".9rem 1.1rem", fontWeight: 900 }}>
              {loadingIntent ? "Preparing payment…" : "Continue to Payment"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Payment element */}
      {clientSecret && options && (
        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: 12, background: "rgba(0,0,0,0.35)" }}>
          <h3 style={{ marginTop: 0 }}>Payment</h3>

          {/* important: pass options object, NOT inline */}
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
          </Elements>

          <div style={{ marginTop: ".75rem", opacity: 0.8, fontSize: ".9rem" }}>
            You’ll be redirected to <code>/checkout/success</code> after payment.
          </div>
        </div>
      )}
    </div>
  );
}
