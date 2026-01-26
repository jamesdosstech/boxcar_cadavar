import React, { useEffect } from "react";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Cart.styles.scss";

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

const CartModal = ({ onClose }) => {
  const { cartItems, addItem, decrementItem, removeItem, subtotalCents, itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // // Close modal on route change (prevents weird “modal stays open” moments)
  // useEffect(() => {
  //   onClose?.();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname]);

  // Escape key to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const goCheckout = () => {
    onClose?.();
    navigate("/checkout");
  };

  const goCart = () => {
    onClose?.();
    navigate("/cart");
  };

  return (
    <div
      className="cart-modal-backdrop"
      onMouseDown={(e) => {
        // close if clicking the backdrop (not inside modal)
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close cart">
          ×
        </button>

        <h3>Your Cart {itemCount ? <span style={{ opacity: 0.8 }}>({itemCount})</span> : null}</h3>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>Your cart is empty.</p>
            <button className="checkout-btn" onClick={() => { onClose?.(); navigate("/shop"); }}>
              Browse Shop
            </button>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-img" />

                <div className="cart-details">
                  <h4>{item.name}</h4>

                  <div className="quantity-control">
                    <button onClick={() => decrementItem(item.id)} aria-label="Decrease quantity">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addItem(item)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                      title={item.quantity >= item.stock ? "No more stock available" : "Add one"}
                    >
                      +
                    </button>
                    <span style={{ marginLeft: ".5rem", opacity: 0.85 }}>
                      / {item.stock}
                    </span>
                  </div>

                  <p>
                    {money(item.price * item.quantity)}{" "}
                    {String(item.currency || "usd").toUpperCase()}
                  </p>

                  <button onClick={() => removeItem(item.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-footer">
              <div className="cart-total">
                <strong>Subtotal:</strong> {money(subtotalCents)} USD
              </div>

              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="checkout-btn" onClick={goCheckout}>
                  Checkout
                </button>
                <button className="checkout-btn" onClick={goCart} style={{ backgroundColor: "#7a1c6e" }}>
                  View Cart
                </button>
              </div>

              <div style={{ marginTop: "0.75rem", opacity: 0.8, fontSize: ".9rem" }}>
                Shipping and taxes calculated at checkout.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
