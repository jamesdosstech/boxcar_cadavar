import { useContext } from "react";
import { ShoppingCartContext } from "../../../context/shoppingCart/shoppingCart.context";
import { Link } from "react-router-dom";

/**
   * CartIcon component displaying the shopping cart icon and dropdown.
   * Shows the cart items and total price.
   */
export const CartIcon = ({ cartDropdownRef, isCartOpen, toggleCartDropdown }) => {
    const { cartItems, cartCount, cartTotal } = useContext(ShoppingCartContext);
  
    return (
      <div className="cart-icon" ref={cartDropdownRef}>
        <button
          className="nav-link"
          aria-haspopup="true"
          aria-expanded={isCartOpen}
          onClick={toggleCartDropdown}
          onKeyDown={toggleCartDropdown}
        >
          <i className="bi bi-cart"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        {isCartOpen && (
          <div className="cart-dropdown">
            <h5>Your Cart</h5>
            <ul className="cart-items">
              {cartItems.length === 0 ? (
                <li className="empty-message">Your cart is empty</li>
              ) : (
                cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.ProductPrice} x {item.quantity}
                  </li>
                ))
              )}
            </ul>
            <div className="cart-total">
              <span>Total: </span>${cartTotal.toFixed(2)}
            </div>
            <Link to="/checkout">
              <button className="checkout-button">Go to Checkout</button>
            </Link>
          </div>
        )}
      </div>
    );
  };
  