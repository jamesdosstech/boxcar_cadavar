import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import{ useEffect, useState } from 'react'

const CheckoutForm = ({ total }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // const CARD_ELEMENT_OPTIONS = {
    //     style: {
    //         base: {
    //             color: '#32325d',
    //             fontSize: '16px',
    //             fontFamily: "Arial, sans-serif",
    //             fontSmoothing: "antialiased",
    //             "::placeholder": {
    //                 color: "#aab7c4",
    //             },
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     }
    // }
    const returnUrl = `${window.location.origin}/checkout/success`;
    useEffect(() => {
        //call netlify action
        fetch('/.netlify/functions/create-payment-intent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({amount: total}),
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    }, [total]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);

        const {error, paymentIntent} = await stripe.confirmCardPayment({
            elements,
            confirmParams: {
                return_url: returnUrl
            }
        });

        if(error) {
            setMessage(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            setMessage('Payment successful!')
        }

        setLoading(false);
    }
    return (
        <form onSubmit={handleSubmit}>
            <div style={{ maxWidth: '400px', margin: '0 auto'}}>
                <PaymentElement />
                {/* <CardElement options={{CARD_ELEMENT_OPTIONS}}/>     */}
            </div>
            
            <button disabled={loading || !stripe}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {message && <div>{message}</div>}
        </form>
    )
}

export default CheckoutForm