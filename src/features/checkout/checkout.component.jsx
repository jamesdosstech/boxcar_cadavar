import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { stripePromise } from "../../utils/stripe/stripe.utils";
import CheckoutForm from "./Checkout-Form/CheckoutForm";
import { auth, validateCartItems } from "../../utils/firebase/firebase.utils";

const genOrderId = () =>
  crypto?.randomUUID?.() ?? `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const classifyCheckoutError = (message = "") => {
  const msg = String(message).toLowerCase();

  if (msg.includes("insufficient stock")) {
    return {
      type: "stock",
      title: "Some items are no longer available in that quantity",
      body: "Your cart needs to be updated before payment can continue.",
    };
  }

  if (msg.includes("inactive product")) {
    return {
      type: "product",
      title: "One of your items is no longer available",
      body: "Please review your cart and remove unavailable items.",
    };
  }

  if (msg.includes("cart is empty")) {
    return {
      type: "cart",
      title: "Your cart is empty",
      body: "Add at least one item before checkout.",
    };
  }

  if (msg.includes("highlighted fields")) {
    return {
      type: "shipping",
      title: "Please correct the highlighted fields",
      body: "Check the form below and try again.",
    };
  }

  if (msg.includes("missing")) {
    return {
      type: "shipping",
      title: "Shipping information is incomplete",
      body: "Please complete all required fields before continuing.",
    };
  }

  return {
    type: "general",
    title: "We couldn't prepare your payment",
    body: "Please review your details and try again.",
  };
};

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

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

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;

    setShipping((s) => ({
      ...s,
      name: s.name || u.displayName || "",
      email: s.email || u.email || "",
    }));
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setClientSecret(null);
      setSummary(null);
      setError("");
      setFieldErrors({});
    }
  }, [cartItems.length]);

  const checkoutError = error ? classifyCheckoutError(error) : null;
  const options = useMemo(() => (clientSecret ? { clientSecret } : undefined), [clientSecret]);

  const validateClientShipping = () => {
    const nextErrors = {};
    const email = shipping.email.trim();
    const a = shipping.address || {};

    if (!shipping.name.trim()) nextErrors.name = "Full name is required.";

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!a.line1?.trim()) nextErrors.line1 = "Address line 1 is required.";
    if (!a.city?.trim()) nextErrors.city = "City is required.";
    if (!a.state?.trim()) nextErrors.state = "State is required.";

    if (!a.postal_code?.trim()) {
      nextErrors.postal_code = "ZIP code is required.";
    } else if (!/^\d{5}(-\d{4})?$/.test(a.postal_code.trim())) {
      nextErrors.postal_code = "Enter a valid ZIP code.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createPaymentIntent = async () => {
    setError("");

    if (!cartItems.length) {
      setError("Cart is empty");
      return;
    }
    // 🔥 NEW: Validate cart before anything else
    try {
      const { validItems, invalidItems } = await validateCartItems(cartItems);

      if (invalidItems.length > 0) {
        setError("inactive product or insufficient stock");        return;
      }

    } catch (err) {
      setError("Unable to verify cart items. Please try again.");
      return;
    }
    const isShippingValid = validateClientShipping();
    if (!isShippingValid) {
      setError("Please correct the highlighted fields.");
      return;
    }

    setLoadingIntent(true);

    try {
      const items = cartItems.map((i) => ({
        productId: i.id,
        qty: i.quantity,
      }));
      const uid = auth.currentUser?.uid || null;

      const res = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, uid, orderId, shipping }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
      setSummary(data.summary);
    } catch (e) {
      setClientSecret(null);
      setSummary(null);
      setError(e?.message || "Server error creating payment.");
    } finally {
      setLoadingIntent(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/shop">Go to shop</Link>
      </div>
    );
  }

  return (
    <div
      className="cart-page"
      style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}
    >
      <h2>Checkout</h2>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: 12,
          background: "rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
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
                <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                  {money(summary.totalCents)}
                </div>
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.85 }}>
              Enter your shipping details to calculate shipping and show your final total before payment.
            </div>
          )}
        </div>

        <div style={{ marginTop: ".75rem", opacity: 0.8, fontSize: ".9rem" }}>
          Shipping is calculated before payment. Taxes are not currently added at checkout.
        </div>

        <div style={{ marginTop: ".5rem", opacity: 0.75, fontSize: ".9rem" }}>
          Shipping: $15 under $100, $20 for orders $100–$299.99, free over $300.
        </div>

        <div style={{ marginTop: ".75rem", opacity: 0.75, fontSize: ".9rem" }}>
          Order ID: <code>{orderId}</code>
        </div>
      </div>

      {checkoutError && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: 12,
            background: "rgba(255,0,0,0.15)",
            display: "grid",
            gap: ".6rem",
          }}
        >
          <div style={{ fontWeight: 900 }}>{checkoutError.title}</div>
          <div>{checkoutError.body}</div>

          {(checkoutError.type === "stock" || checkoutError.type === "product") && (
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <Link to="/cart">Review Cart</Link>
              <Link to="/shop">Back to Shop</Link>
            </div>
          )}

          {checkoutError.type === "cart" && (
            <div>
              <Link to="/shop">Go to Shop</Link>
            </div>
          )}

          <div style={{ opacity: 0.7, fontSize: ".9rem" }}>{error}</div>
        </div>
      )}

      {!clientSecret && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1.25rem",
            borderRadius: 12,
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Shipping & Contact</h3>

          <div style={{ display: "grid", gap: ".9rem" }}>
            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Full Name</label>
              <input
                value={shipping.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({ ...s, name: value }));
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name ? (
                <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>{fieldErrors.name}</div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Email</label>
              <input
                value={shipping.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({ ...s, email: value }));
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoComplete="email"
                type="email"
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email ? (
                <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>{fieldErrors.email}</div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Phone (optional)</label>
              <input
                value={shipping.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({ ...s, phone: value }));
                }}
                autoComplete="tel"
              />
            </div>

            <hr style={{ opacity: 0.2, width: "100%" }} />

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Address Line 1</label>
              <input
                value={shipping.address.line1}
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({
                    ...s,
                    address: { ...s.address, line1: value },
                  }));
                  setFieldErrors((prev) => ({ ...prev, line1: undefined }));
                }}
                autoComplete="address-line1"
                aria-invalid={Boolean(fieldErrors.line1)}
              />
              {fieldErrors.line1 ? (
                <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>{fieldErrors.line1}</div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: ".35rem" }}>
              <label>Address Line 2 (optional)</label>
              <input
                value={shipping.address.line2}
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({
                    ...s,
                    address: { ...s.address, line2: value },
                  }));
                }}
                autoComplete="address-line2"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: ".9rem" }}>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>City</label>
                <input
                  value={shipping.address.city}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((s) => ({
                      ...s,
                      address: { ...s.address, city: value },
                    }));
                    setFieldErrors((prev) => ({ ...prev, city: undefined }));
                  }}
                  autoComplete="address-level2"
                  aria-invalid={Boolean(fieldErrors.city)}
                />
                {fieldErrors.city ? (
                  <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>{fieldErrors.city}</div>
                ) : null}
              </div>

              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>State</label>
                <select
                  value={shipping.address.state}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((s) => ({
                      ...s,
                      address: { ...s.address, state: value },
                    }));
                    setFieldErrors((prev) => ({ ...prev, state: undefined }));
                  }}
                  autoComplete="address-level1"
                  aria-invalid={Boolean(fieldErrors.state)}
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {fieldErrors.state ? (
                  <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>{fieldErrors.state}</div>
                ) : null}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: ".9rem" }}>
              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>ZIP</label>
                <input
                  value={shipping.address.postal_code}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((s) => ({
                      ...s,
                      address: { ...s.address, postal_code: value },
                    }));
                    setFieldErrors((prev) => ({ ...prev, postal_code: undefined }));
                  }}
                  autoComplete="postal-code"
                  aria-invalid={Boolean(fieldErrors.postal_code)}
                />
                {fieldErrors.postal_code ? (
                  <div style={{ color: "#ffb3b3", fontSize: ".9rem" }}>
                    {fieldErrors.postal_code}
                  </div>
                ) : null}
              </div>

              <div style={{ display: "grid", gap: ".35rem" }}>
                <label>Country</label>
                <select
                  value={shipping.address.country}
                  onChange={(e) => {
                    const value = e.target.value;
                    setShipping((s) => ({
                      ...s,
                      address: { ...s.address, country: value },
                    }));
                  }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  setShipping((s) => ({ ...s, deliveryNotes: value }));
                }}
                placeholder="Gate code, leave at door, etc."
              />
            </div>

            <button
              onClick={createPaymentIntent}
              disabled={loadingIntent}
              style={{ padding: ".9rem 1.1rem", fontWeight: 900 }}
            >
              {loadingIntent ? "Preparing payment…" : "Continue to Payment"}
            </button>
          </div>
        </div>
      )}

      {clientSecret && options && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1.25rem",
            borderRadius: 12,
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Payment</h3>

          {summary ? (
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: ".35rem" }}>
                Review your total before paying
              </div>
              <div>Subtotal: {money(summary.subtotalCents)}</div>
              <div>Shipping: {money(summary.shippingCents)}</div>
              <div style={{ fontWeight: 900, marginTop: ".35rem" }}>
                Total due now: {money(summary.totalCents)}
              </div>
            </div>
          ) : null}

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