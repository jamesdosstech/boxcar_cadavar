import { useContext } from "react";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cartItems, addItem, decrementItem, removeItem, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page" style={{padding: '2rem', color: 'white'}}>
      <h2>Your Cart</h2>
      <tbody>
        {cartItems.length === 0 ? 
        (
          <p>Your cart is empty. <Link to={'/shop'}>Go Shopping</Link></p>
        ) : (
          <>
            <table style={{ width: '100%', marginBottom: '1rem', color: 'white'}}>
              <thead>
                <tr>
                  <th align="left">Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => decrementItem(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addItem(item)}>+</button>
                    </td>
                    <td>${item.price}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button onClick={() => removeItem(item.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </tbody>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={clearCart} style={{marginRight: '1rem'}}>Clear Cart</button>
      <Link to={'/checkout'}>
        <button>Checkout</button>
      </Link>
    </div>
  );
};

export default Checkout;
