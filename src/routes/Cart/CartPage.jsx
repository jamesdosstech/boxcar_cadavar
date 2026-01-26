import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, subtotalCents, addItem, decrementItem, removeItem, setItemQty } = useCart();

  if (!cartItems.length) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        <h2>Your cart is empty</h2>
        <Link to="/shop">Go to shop</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: 900, margin: "0 auto" }}>
      <h2>Your Cart</h2>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr auto",
              gap: "1rem",
              alignItems: "center",
              padding: "1rem",
              borderRadius: 12,
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: 100, height: 90, objectFit: "cover", borderRadius: 10 }}
            />

            <div>
              <div style={{ fontWeight: 800 }}>{item.name}</div>
              <div style={{ opacity: 0.9 }}>{money(item.price)} each</div>

              <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginTop: ".6rem" }}>
                <button onClick={() => decrementItem(item.id)}>-</button>

                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => setItemQty(item.id, e.target.value)}
                  style={{ width: 70 }}
                />

                <button onClick={() => addItem(item)} disabled={item.quantity >= item.stock}>
                  +
                </button>

                <span style={{ opacity: 0.85, marginLeft: ".5rem" }}>/ {item.stock} available</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800 }}>{money(item.price * item.quantity)}</div>
              <button onClick={() => removeItem(item.id)} style={{ marginTop: ".5rem" }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          borderRadius: 12,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ opacity: 0.9 }}>Subtotal</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 900 }}>{money(subtotalCents)}</div>
        </div>

        <button onClick={() => navigate("/checkout")} style={{ padding: "0.8rem 1.2rem" }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
