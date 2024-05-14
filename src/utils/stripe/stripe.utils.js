import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe('pk_test_51MIJX8LhQmqeG9MXrun4ixxHR3MDT2wlmeLdN8w8RCJqdetzmqthvkjEWDOgFURjWJc4ZCDwdqUa2ix91EAnKM2M006uMaCeE3')
// export const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`)