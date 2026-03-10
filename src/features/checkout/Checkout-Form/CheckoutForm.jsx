import React, { useEffect, useState } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ clientSecret, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handles the case where Stripe redirects (3DS/etc) and the user comes back
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const checkStatus = async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent) return;

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment received. Finalizing your order...");
            navigate(
              `/checkout/success?orderId=${encodeURIComponent(orderId || "")}`,
              { replace: true }
            );
            break;

          case "processing":
            setMessage("Payment processing…");
            break;

          case "requires_payment_method":
            setMessage("Payment failed. Please try another payment method.");
            break;

          default:
            break;
        }
      } catch {
        // keep quiet (Stripe can throw in dev if clientSecret invalid/expired)
      }
    };

    checkStatus();
  }, [stripe, clientSecret, orderId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;
    if (loading) return;

    setLoading(true);
    setMessage("");

    const returnUrl = `${window.location.origin}/checkout/success?orderId=${encodeURIComponent(
      orderId || ""
    )}`;

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required", // stays in SPA when no redirect is needed
      });

      // 1) Error path
      if (result.error) {
        setMessage(result.error.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2) Immediate success path (this is what was missing)
      const pi = result.paymentIntent;
      if (pi?.status === "succeeded") {
        navigate(
          `/checkout/success?orderId=${encodeURIComponent(orderId || "")}`,
          { replace: true }
        );
        return; // don't setLoading false after navigating
      }

      // 3) Processing path (some methods)
      if (pi?.status === "processing") {
        setMessage("Payment processing…");
      }

      // 4) If redirect was required, Stripe will redirect automatically and we won't reach here in that flow.
      setLoading(false);
    } catch (err) {
      setMessage("Something went wrong confirming payment.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
        <PaymentElement />
      </div>

      <button
        type="submit"
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
