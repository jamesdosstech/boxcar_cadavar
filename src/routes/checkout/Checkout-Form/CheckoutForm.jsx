import React, { useEffect, useState } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/shoppingCart/shoppingCart.context"; // adjust path if needed

const CheckoutForm = ({ clientSecret, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // optional: show status if Stripe returns user here with redirect params (succeeded/failed)
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const checkStatus = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent) return;

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded ✅");
            // clear cart locally
            clearCart?.();
            // send to clean success route (no query string)
            navigate(`/checkout/success?orderId=${encodeURIComponent(orderId || "")}`, { replace: true });
            break;
          case "processing":
            setMessage("Payment processing…");
            break;
          case "requires_payment_method":
            setMessage("Payment failed. Please try another payment method.");
            break;
          default:
            // leave quiet
            break;
        }
      } catch (e) {
        // ignore noisy errors
      }
    };

    checkStatus();
  }, [stripe, clientSecret, orderId, navigate, clearCart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;
    if (loading) return; // prevents double-click submits

    setLoading(true);
    setMessage("");

    const returnUrl = `${window.location.origin}/checkout/success?orderId=${encodeURIComponent(orderId)}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required", // ✅ keeps you in SPA for cards that don’t require redirect
    });

    if (error) {
      setMessage(error.message || "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    // If no error, either:
    // - it redirected (3DS, etc), OR
    // - it succeeded without redirect; our retrievePaymentIntent effect will catch it.
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
        <PaymentElement />
      </div>

      <button
        disabled={loading || !stripe || !elements}
        style={{
          padding: ".9rem 1.1rem",
          fontWeight: 900,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? "Processing…" : "Pay"}
      </button>

      {message && (
        <div
          style={{
            padding: ".75rem 1rem",
            borderRadius: 12,
            background: "rgba(0,0,0,0.35)",
            opacity: 0.95,
          }}
        >
          {message}
        </div>
      )}

      <div style={{ opacity: 0.7, fontSize: ".9rem", textAlign: "center" }}>
        By paying, you agree to place an order. You’ll receive a confirmation email from Stripe.
      </div>
    </form>
  );
};

export default CheckoutForm;
