import React, { useContext, useState } from "react";
import { ShoppingCartContext } from "../../context/shoppingCart/shoppingCart.context";
import CheckoutItem from "../../components/checkout-item/checkout-item.component";
import "./checkout.styles.scss";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CountryDropdown } from "react-country-region-selector";
import countryList from "country-list";

const initialAddressState = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
};

const Checkout = () => {
  const { cartItems, cartTotal } = useContext(ShoppingCartContext);
  const stripe = useStripe();
  const elements = useElements();

  const [billingAddress, setBillingAddress] = useState({ ...initialAddressState });
  const [shippingAddress, setShippingAddress] = useState({ ...initialAddressState });
  const [recipientName, setRecipientName] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e, setAddress) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value, setAddress) => {
    setAddress((prev) => ({ ...prev, country: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const billingCountry = countryList.getCode(billingAddress.country);
      const response = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal * 100 }),
      }).then((res) => res.json());

      const clientSecret = response?.paymentIntent?.client_secret;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: nameOnCard,
            address: {
              ...billingAddress,
              country: billingCountry,
            },
          },
        },
      });

      if (paymentResult.error) {
        alert(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
      }
    } catch (error) {
      alert("An error occurred during payment processing.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-items">
        <div className="checkout-header">
          <div className="header-block"><span>Product</span></div>
          <div className="header-block"><span>Description</span></div>
          <div className="header-block"><span>Quantity</span></div>
          <div className="header-block"><span>Price</span></div>
          <div className="header-block"><span>Remove</span></div>
        </div>
        {cartItems.map((item) => <CheckoutItem key={item.id} cartItem={item} />)}
        <div className="checkout-total">Total: ${cartTotal.toFixed(2)}</div>
      </div>

      <div className="checkout-form">
        <form onSubmit={handleFormSubmit}>
          <div className="form-section">
            <h2>Shipping Address</h2>
            <input
              type="text"
              placeholder="Recipient Name"
              name="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Line 1"
              name="line1"
              value={shippingAddress.line1}
              onChange={(e) => handleAddressChange(e, setShippingAddress)}
              required
            />
            <input
              type="text"
              placeholder="Line 2"
              name="line2"
              value={shippingAddress.line2}
              onChange={(e) => handleAddressChange(e, setShippingAddress)}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={shippingAddress.city}
              onChange={(e) => handleAddressChange(e, setShippingAddress)}
              required
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              value={shippingAddress.state}
              onChange={(e) => handleAddressChange(e, setShippingAddress)}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="postal_code"
              value={shippingAddress.postal_code}
              onChange={(e) => handleAddressChange(e, setShippingAddress)}
              required
            />
            <CountryDropdown
              value={shippingAddress.country}
              onChange={(val) => handleCountryChange(val, setShippingAddress)}
              required
            />
          </div>

          <div className="form-section">
            <h2>Billing Address</h2>
            <input
              type="text"
              placeholder="Name on Card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Line 1"
              name="line1"
              value={billingAddress.line1}
              onChange={(e) => handleAddressChange(e, setBillingAddress)}
              required
            />
            <input
              type="text"
              placeholder="Line 2"
              name="line2"
              value={billingAddress.line2}
              onChange={(e) => handleAddressChange(e, setBillingAddress)}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={billingAddress.city}
              onChange={(e) => handleAddressChange(e, setBillingAddress)}
              required
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              value={billingAddress.state}
              onChange={(e) => handleAddressChange(e, setBillingAddress)}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="postal_code"
              value={billingAddress.postal_code}
              onChange={(e) => handleAddressChange(e, setBillingAddress)}
              required
            />
            <CountryDropdown
              value={billingAddress.country}
              onChange={(val) => handleCountryChange(val, setBillingAddress)}
              required
            />
          </div>

          <div className="form-section">
            <h2>Card Details</h2>
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
