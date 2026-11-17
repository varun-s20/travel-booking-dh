/* =====================================================================
   Landfall server: Stripe
   Authorise, then capture. Checkout creates a PaymentIntent with manual
   capture for the server's own price; the browser confirms it with the
   Payment Element (card details go from the browser to Stripe, never to
   this server). Only when the airline or hotel has confirmed is the
   payment captured; if they refuse, the hold is released and nothing is
   charged. Every write carries an idempotency key, so a retry can never
   create or capture twice. The API version is the one this SDK pins.
   ===================================================================== */
import 'server-only';
import Stripe from 'stripe';
import { need } from '@/server/env';

let client: Stripe | null = null;
export function stripe(): Stripe {
  if (!client) {
    client = new Stripe(need('STRIPE_SECRET_KEY', 'payments'), {
      maxNetworkRetries: 2,
      timeout: 20000,
      appInfo: { name: 'landfall-booking' }
    });
  }
  return client;
}

export async function createAuthorization(p: {
  bookingId: string; reference: string; amount: number; currency: string; description: string; email?: string;
}): Promise<Stripe.PaymentIntent> {
  return stripe().paymentIntents.create(
    {
      amount: p.amount,
      currency: p.currency.toLowerCase(),
      capture_method: 'manual',
      /* this API version's name for payment_method_types: cards only */
      allowed_payment_method_types: ['card'],
      description: p.description.slice(0, 1000),
      /* no receipt_email: the booking confirmation email is the receipt */
      metadata: { booking_id: p.bookingId, reference: p.reference }
    },
    { idempotencyKey: `authorize:${p.bookingId}` }
  );
}

export const retrieveIntent = (id: string) => stripe().paymentIntents.retrieve(id, { expand: ['latest_charge'] });

const unexpectedState = (e: unknown) => (e as Stripe.errors.StripeError)?.code === 'payment_intent_unexpected_state';

/* Captures a held payment and answers the intent's real status afterwards. No idempotency key:
   a capture can't happen twice anyway (Stripe refuses to capture a captured intent), and a key
   would replay a passing error for 24 hours. */
export async function captureIntent(id: string): Promise<Stripe.PaymentIntent.Status> {
  try {
    return (await stripe().paymentIntents.capture(id)).status;
  } catch (e) {
    if (!unexpectedState(e)) throw e;
    return (await stripe().paymentIntents.retrieve(id)).status;
  }
}

/* Releases the card hold (nothing is charged) and answers the intent's real status afterwards:
   'canceled' when released, 'succeeded' if it had already been captured (an alarm for the caller). */
export async function releaseIntent(id: string): Promise<Stripe.PaymentIntent.Status> {
  try {
    return (await stripe().paymentIntents.cancel(id, { cancellation_reason: 'abandoned' })).status;
  } catch (e) {
    if (!unexpectedState(e)) throw e;
    return (await stripe().paymentIntents.retrieve(id)).status;
  }
}

export function cardOf(pi: Stripe.PaymentIntent): { brand: string; last4: string } | null {
  const charge = pi.latest_charge && typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
  const card = charge?.payment_method_details?.card;
  if (!card?.last4) return null;
  const brand = card.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : 'Card';
  return { brand: brand === 'Amex' ? 'American Express' : brand, last4: card.last4 };
}

export function verifyWebhook(rawBody: string, signature: string | null): Stripe.Event {
  if (!signature) throw new Error('missing stripe-signature');
  return stripe().webhooks.constructEvent(rawBody, signature, need('STRIPE_WEBHOOK_SECRET', 'Stripe webhooks'));
}
