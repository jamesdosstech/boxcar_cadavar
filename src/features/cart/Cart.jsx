import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { useNavigate, useLocation } from "react-router-dom";
import { isPurchasable, validateCartItems } from "../../utils/firebase/firebase.utils";
import "./Cart.styles.scss";

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

const CartModal = ({ onClose }) => {
  const { cartItems, removeItem, subtotalCents, itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const firstRun = useRef(true);

  const [checkingOut, setCheckingOut] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    onClose?.();
  }, [location.pathname, onClose]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const goCheckout = async () => {
    setCartError("");
    setCheckingOut(true);

    try {
      const { invalidItems } = await validateCartItems(cartItems);

      if (invalidItems.length > 0) {
        setCartError(
          "Some items in your cart are no longer available. Please review your cart before checkout."
        );
        setCheckingOut(false);
        return;
      }

      onClose?.();
      navigate("/checkout");
    } catch (error) {
      setCartError("Unable to verify cart items right now.");
      setCheckingOut(false);
    }
  };

  const goCart = () => {
    onClose?.();
    navigate("/cart");
  };

  const goShop = () => {
    onClose?.();
    navigate("/shop");
  };

  const itemsPreview = useMemo(() => {
    const list = Array.isArray(cartItems) ? cartItems : [];
    return list.slice(0, 4);
  }, [cartItems]);

  const hasMore = cartItems.length > itemsPreview.length;

  return (
    <div
      className="cart-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="cart-modal" role="dialog" aria-modal="true" aria-label="Cart">
        <button className="close-btn" onClick={onClose} aria-label="Close cart">
          ×
        </button>

        <h3>
          Your Cart {itemCount ? <span style={{ opacity: 0.8 }}>({itemCount})</span> : null}
        </h3>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>Your cart is empty.</p>
            <button className="checkout-btn" onClick={goShop}>
              Browse Shop
            </button>
          </div>
        ) : (
          <>
            {itemsPreview.map((item) => {
              const stock = Number(item.stock ?? item.quantity ?? 0);
              const unavailable = !isPurchasable(item);
              const exceedsStock = Number(item.quantity ?? 0) > stock && stock > 0;

              return (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-img" />

                  <div className="cart-details">
                    <h4>{item.name}</h4>

                    <div
                      style={{
                        display: "flex",
                        gap: ".6rem",
                        alignItems: "center",
                        margin: ".5rem 0",
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>Qty:</span>
                      <span>{item.quantity}</span>
                      {stock ? (
                        <span style={{ marginLeft: ".25rem", opacity: 0.85 }}>
                          / {stock}
                        </span>
                      ) : null}
                    </div>

                    {unavailable ? (
                      <div style={{ color: "#ff8080", fontSize: ".9rem", marginTop: ".35rem" }}>
                        This item is not currently available
                      </div>
                    ) : null}

                    {!unavailable && exceedsStock ? (
                      <div style={{ color: "#ffb366", fontSize: ".9rem", marginTop: ".35rem" }}>
                        Quantity in cart exceeds current stock
                      </div>
                    ) : null}

                    <p>
                      {money(item.price * item.quantity)}{" "}
                      {String(item.currency || "usd").toUpperCase()}
                    </p>

                    <button onClick={() => removeItem(item.id)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {hasMore ? (
              <div style={{ textAlign: "center", opacity: 0.85, marginTop: ".25rem" }}>
                + {cartItems.length - itemsPreview.length} more item(s) in cart
              </div>
            ) : null}

            {cartError ? (
              <div style={{ color: "#ff8080", textAlign: "center", marginTop: "0.75rem" }}>
                {cartError}
              </div>
            ) : null}

            <div className="cart-footer">
              <div className="cart-total">
                <strong>Subtotal:</strong> {money(subtotalCents)} USD
              </div>

              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="checkout-btn" onClick={goCheckout} disabled={checkingOut}>
                  {checkingOut ? "Checking cart..." : "Checkout"}
                </button>
                <button className="checkout-btn checkout-btn--alt" onClick={goCart}>
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