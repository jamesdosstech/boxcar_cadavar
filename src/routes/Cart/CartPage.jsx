import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import "./CartPage.styles.scss";

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, subtotalCents, addItem, decrementItem, removeItem, setItemQty } = useCart();

  if (!cartItems.length) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <Link className="cart-link" to="/shop">
            Go to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <header className="cart-head">
        <h2>Your Cart</h2>
        <Link className="cart-link" to="/shop">
          Continue shopping
        </Link>
      </header>

      <div className="cart-items">
        {cartItems.map((item) => {
          const stock = Number(item.stock ?? item.quantity ?? 0);
          const maxQty = stock > 0 ? stock : 1;
          const qty = Number(item.quantity ?? 1);

          const canIncrement = stock > 0 ? qty < stock : true;

          return (
            <div key={item.id} className="cart-item">
              <div className="cart-item-media">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
                ) : (
                  <div className="cart-item-placeholder" aria-hidden="true">
                    No image
                  </div>
                )}
              </div>

              <div className="cart-item-main">
                <div className="cart-item-title">{item.name}</div>
                <div className="cart-item-sub">{money(item.price)} each</div>

                <div className="cart-qty">
                  <button className="cart-qty-btn" onClick={() => decrementItem(item.id)} aria-label="Decrease quantity">
                    −
                  </button>

                  <input
                    className="cart-qty-input"
                    type="number"
                    min={1}
                    max={maxQty}
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      const clamped = Number.isFinite(n)
                        ? Math.max(1, Math.min(maxQty, n))
                        : 1;
                      setItemQty(item.id, clamped);
                    }}
                  />

                  <button
                    className="cart-qty-btn"
                    onClick={() => addItem(item)}
                    disabled={!canIncrement}
                    aria-label="Increase quantity"
                    title={!canIncrement ? "Out of stock" : "Increase quantity"}
                  >
                    +
                  </button>

                  {stock > 0 ? (
                    <span className="cart-qty-stock">/ {stock} available</span>
                  ) : (
                    <span className="cart-qty-stock muted">(stock unavailable)</span>
                  )}
                </div>
              </div>

              <div className="cart-item-side">
                <div className="cart-item-total">{money(item.price * qty)}</div>
                <button className="cart-remove" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="cart-summary">
        <div className="cart-summary-left">
          <div className="cart-summary-label">Subtotal</div>
          <div className="cart-summary-value">{money(subtotalCents)}</div>
        </div>

        <button
          className="cart-checkout"
          onClick={() => navigate("/checkout")}
          disabled={Number(subtotalCents || 0) <= 0}
        >
          Proceed to Checkout
        </button>
      </footer>
    </div>
  );
}
