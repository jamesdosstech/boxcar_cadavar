import { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/stripe/stripe.utils";
import CheckoutForm from "./Checkout-Form/CheckoutForm";

const Checkout = () => {

  const [clientSecret, setClientSecret] = useState(null);
  
  const { cartItems, addItem, decrementItem, removeItem, clearCart } = useCart();
  const shippingFee = 1500;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingFee
  useEffect(() => {
    if(cartItems.length === 0 ) return;
    fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems, shipping: shippingFee }), // $10.99
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch((err) => console.log('Error creating payment:', err ))
  }, [cartItems]);

  return (
    <div className="cart-page" style={{padding: '2rem', color: 'white'}}>
      <h2>Checkout</h2>
      <h3>
        Subtotal: ${(subtotal / 100).toFixed(2)} <br />
        Shipping: ${(shippingFee / 100).toFixed(2)} <br />
        <strong>Total: ${(total / 100).toFixed(2)}</strong>
      </h3>
      { clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm total={total} />
        </Elements> 
      )}
    </div>
  );
};

export default Checkout;
