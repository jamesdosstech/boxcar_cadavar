import { useContext } from "react";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";

const Checkout = () => {
  const { cartItems, cartTotal } = useContext(ShoppingCartContext);

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="cart-summary">
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.ProductPrice} x {item.quantity}
            </li>
          ))}
        </ul>
        <div className="total">
          <strong>Total: </strong>${cartTotal.toFixed(2)}
        </div>
      </div>
      <button className="pay-now-button">Pay Now</button>
    </div>
  );
};

export default Checkout;
