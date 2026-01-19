// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // If apiVersion is not set, TypeScript won't throw an error
  // and the native version of the installed SDK will be used
});

// Or update to the version requested by the error
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-12-15.clover' as any,
// });

export default stripe;
