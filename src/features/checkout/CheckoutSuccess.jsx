import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { subscribeToOrderById } from "../../utils/firebase/firebase.utils";

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasClearedCartRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToOrderById(orderId, (nextOrder) => {
      setOrder(nextOrder);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    if (order.status !== "paid") return;
    if (hasClearedCartRef.current) return;

    clearCart();
    hasClearedCartRef.current = true;
  }, [order, clearCart]);

  if (!orderId) {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Missing order reference</h2>
        <p>We couldn’t find your order ID in the URL.</p>
        <Link to="/shop">Return to shop</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Finalizing your order...</h2>
        <p>Please wait while we confirm your order details.</p>
        <p>
          Order ID: <code>{orderId}</code>
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Order not found yet</h2>
        <p>Your payment may still be processing. Please refresh in a moment.</p>
        <p>
          Order ID: <code>{orderId}</code>
        </p>
        <Link to="/shop">Return to shop</Link>
      </div>
    );
  }

  if (order.status === "pending") {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Payment received</h2>
        <p>We’re finalizing your order now.</p>
        <p>
          Order ID: <code>{order.id}</code>
        </p>
      </div>
    );
  }

  if (order.status === "paid") {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Order confirmed</h2>
        <p>Thanks for your purchase.</p>
        <p>
          Order ID: <code>{order.id}</code>
        </p>
        <p>Total: {money(order.totalCents)}</p>
        <Link to="/shop">Continue shopping</Link>
      </div>
    );
  }

  if (order.status === "needs_attention" || order.status === "oversold") {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Order received</h2>
        <p>Your payment was received, but your order needs review.</p>
        <p>
          Order ID: <code>{order.id}</code>
        </p>
        <p>Please contact support and include this order ID.</p>
        <Link to="/shop">Return to shop</Link>
      </div>
    );
  }

  if (order.status === "failed") {
    return (
      <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
        <h2>Payment failed</h2>
        <p>Your order could not be completed.</p>
        <p>
          Order ID: <code>{order.id}</code>
        </p>
        <Link to="/checkout">Try again</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: 920, margin: "0 auto" }}>
      <h2>Order update</h2>
      <p>Status: {order.status}</p>
      <p>
        Order ID: <code>{order.id}</code>
      </p>
      <Link to="/shop">Return to shop</Link>
    </div>
  );
}