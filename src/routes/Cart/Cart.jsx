import React from 'react'
import { useCart } from '../../context/shoppingCart/shoppingCart.context';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.styles.scss'

const CartModal = ({onClose}) => {
  const { cartItems, addItem, decrementItem, removeItem, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navigate = useNavigate();

  return (
    <div className="cart-modal-backdrop">
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h3>Your Cart</h3>
        {cartItems.length === 0 ?
        (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h4>{item.name}</h4>
                <div className="quantity-control">
                  <button onClick={() => decrementItem(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addItem(item)}>+</button>
                </div>
                <p>
                  {(item.price * item.quantity / 100).toFixed(2)}{" "}
                  {item.currency.toUpperCase()}
                </p>
                <button onClick={() => removeItem(item.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
            ))}
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total:</strong> ${(total / 100).toFixed(2)} USD
              </div>
              <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                Go to Checkout
              </button>
            </div>
          </>
        )
      }
      </div>
    </div>
  )
}

export default CartModal