/* POST /api/webhooks/duffel
   Duffel events, X-Duffel-Signature checked (HMAC-SHA256 of "t.body" with DUFFEL_WEBHOOK_SECRET,
   constant-time compare). 400 on a bad signature, 500 when handling fails (Duffel retries for
   72 hours), 200 otherwise. Register it with POST /air/webhooks once the site has a public URL. */
import { fail, ok, route } from '@/server/http';
import { handleDuffel, verifyDuffel } from '@/server/webhooks';
import { log } from '@/server/log';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export const POST = route(async (ctx) => {
  const raw = await ctx.req.text();
  if (raw.length > 512 * 1024) return fail('payload_too_large', 413);
  if (!verifyDuffel(raw, ctx.req.headers.get('x-duffel-signature'))) {
    log.warn('webhook.duffel.bad_signature', { requestId: ctx.requestId });
    return fail('invalid_signature', 400);
  }
  let event;
  try { event = JSON.parse(raw); } catch { return fail('invalid_json', 400); }
  if (!event?.id || !event?.type) return fail('invalid_event', 400);
  await handleDuffel(event);
  return ok({ received: true });
}, { csrf: false });
