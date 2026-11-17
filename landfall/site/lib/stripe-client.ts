'use client';
/* =====================================================================
   Landfall: Stripe.js in the browser
   One Stripe.js load per page (loadStripe caches the script), keyed by
   the publishable key. With no key configured, getStripe() is null and
   checkout says payments aren't set up instead of showing card fields.
   Card details are typed into Stripe's own fields (iframes from
   js.stripe.com) and go straight to Stripe; this site never sees them.
   ===================================================================== */
import { loadStripe, type Stripe } from '@stripe/stripe-js';

const KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
let promise: Promise<Stripe | null> | null = null;

export const stripeConfigured = () => KEY.length > 0;

export function getStripe(): Promise<Stripe | null> | null {
  if (!KEY) return null;
  if (!promise) promise = loadStripe(KEY);
  return promise;
}
