/* POST /api/webhooks/stripe
   Stripe events, signature checked against STRIPE_WEBHOOK_SECRET on the raw body. 400 on a bad
   signature, 500 when handling fails (Stripe retries), 200 otherwise. Not same-origin by design. */
import { fail, ok, route } from '@/server/http';
import { verifyWebhook } from '@/server/payments/stripe';
import { handleStripe } from '@/server/webhooks';
import { log } from '@/server/log';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export const POST = route(async (ctx) => {
  const raw = await ctx.req.text();
  let event;
  try {
    event = verifyWebhook(raw, ctx.req.headers.get('stripe-signature'));
  } catch (e) {
    log.warn('webhook.stripe.bad_signature', { requestId: ctx.requestId, error: (e as Error).message });
    return fail('invalid_signature', 400);
  }
  await handleStripe(event);
  return ok({ received: true });
}, { csrf: false });
