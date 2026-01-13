// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Al no poner apiVersion, TypeScript no dará error
  // y se usará la versión nativa de la SDK instalada
});

//O Actualizar a la versión que te pide el error
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-12-15.clover' as any,
// });

export default stripe;
