require("dotenv").config();
// const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
exports.handler = async (event) => {
    try {
        const { cartItems, shipping } = JSON.parse(event.body);

        const subtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )

        const shippingFee = 1500;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: subtotal + shippingFee,
            currency: "usd",
            // automatic_tax: { enabled: true }
            // payment_method_types: ["card"]
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
        }
    } catch (error) {
        console.log({ error })

        return {
            statusCode: 400,
            body: JSON.stringify({ error })
        }
    }
}