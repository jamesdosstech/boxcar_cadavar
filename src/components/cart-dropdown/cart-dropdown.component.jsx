import { useContext } from "react";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";

const CartDropdown = () => {
  const { cartItems } = useContext(ShoppingCartContext);  // Assuming you have cart items in context

  return (
    <div className="cart-dropdown">
      <h5>Your Cart</h5>
      <ul className="cart-items">
        {cartItems.length === 0 ? (
          <li className="empty-message">Your cart is empty</li>
        ) : (
          cartItems.map((item, index) => (
            <li key={index}>{item.name}</li>  // Display actual item details
          ))
        )}
      </ul>
      <button>Go to Checkout</button>
    </div>
  );
};

export default CartDropdown;
