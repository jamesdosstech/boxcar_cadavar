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
  console.log(cartTotal);
  const elements = useElements();
  const stripe = useStripe();
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [recipientName, setRecipientName] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // const cardElement = elements.getElement('card');

    if (
      // !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code || !shippingAddress.country ||
      // !billingAddress.line1 || !billingAddress.city || !billingAddress.state || !billingAddress.postal_code || !billingAddress.country ||
      // !recipientName || !nameOnCard ||
      !stripe ||
      !elements
    ) {
      return;
    }

    const billingCountry = countryList.getCode(billingAddress.country);
    const shippingCountry = countryList.getCode(shippingAddress.country);

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: cartTotal * 100 }),
    }).then((res) => res.json());

    console.log("Response: ", response);

    const {
      paymentIntent: { client_secret },
    } = response;

    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: nameOnCard,
          address: {
            city: billingAddress.address,
            line1: billingAddress.line1,
            line2: billingAddress.line2 ? billingAddress.line2 : undefined,
            postal_code: billingAddress.postal_code,
            country: billingCountry,
          },
        },
      },
    });

    if (paymentResult.error) {
      alert(JSON.stringify(paymentResult.error));
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("payment successful");
      }
    }
  };

  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (e) => {
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
  };

  const configCardElement = {
    iconStyle: "solid",
    style: {
      base: {
        fontSize: "16px",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <div className="header-block">
          <span>Product</span>
        </div>
        <div className="header-block">
          <span>Description</span>
        </div>
        <div className="header-block">
          <span>Quantity</span>
        </div>
        <div className="header-block">
          <span>Price</span>
        </div>
        <div className="header-block">
          <span>Remove</span>
        </div>
      </div>
      {cartItems.map((cartItem) => {
        return <CheckoutItem key={cartItem.id} cartItem={cartItem} />;
      })}
      <span className="total">Total: ${cartTotal}</span>
      <div className="paymentDetails">
        <form onSubmit={handleFormSubmit}>
          <div className="group">
            <h2>Shipping Address</h2>
            <input
              required
              type="text"
              placeholder="Recipient Name"
              name="recipeientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <input
              required
              type="text"
              placeholder="Line 1"
              value={shippingAddress.line1}
              name="line1"
              onChange={(e) => handleShipping(e)}
            />
            <input
              type="text"
              placeholder="Line 2"
              value={shippingAddress.line2}
              name="line2"
              onChange={(e) => handleShipping(e)}
            />
            <input
              required
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              name="city"
              onChange={(e) => handleShipping(e)}
            />
            <input
              required
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              name="state"
              onChange={(e) => handleShipping(e)}
            />
            <input
              required
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postal_code}
              name="postal_code"
              onChange={(e) => handleShipping(e)}
            />
            <CountryDropdown
              required
              valueType="short"
              value={shippingAddress.country}
              onChange={(val) =>
                handleShipping({
                  target: {
                    name: "country",
                    value: val,
                  },
                })
              }
            />
          </div>
          <div className="group">
            <h2>Billing Address</h2>
            <input
              required
              type="text"
              placeholder="Recipient Name"
              value={nameOnCard}
              name="nameOnCard"
              onChange={(e) => setNameOnCard(e.target.value)}
            />
            <input
              required
              type="text"
              placeholder="Line 1"
              value={billingAddress.line1}
              name="line1"
              onChange={(e) => handleBilling(e)}
            />
            <input
              type="text"
              placeholder="Line 2"
              value={billingAddress.line2}
              name="line2"
              onChange={(e) => handleBilling(e)}
            />
            <input
              required
              type="text"
              placeholder="City"
              value={billingAddress.city}
              name="city"
              onChange={(e) => handleBilling(e)}
            />
            <input
              required
              type="text"
              placeholder="State"
              value={billingAddress.state}
              name="state"
              onChange={(e) => handleBilling(e)}
            />
            <input
              required
              type="text"
              placeholder="Postal Code"
              value={billingAddress.postal_code}
              name="postal_code"
              onChange={(e) => handleBilling(e)}
            />
            <CountryDropdown
              required
              valueType="short"
              value={billingAddress.country}
              onChange={(val) =>
                handleBilling({
                  target: {
                    name: "country",
                    value: val,
                  },
                })
              }
            />
          </div>
          <div className="group">
            <h2>Card Details</h2>
            <CardElement options={configCardElement} />
          </div>
          <div>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
