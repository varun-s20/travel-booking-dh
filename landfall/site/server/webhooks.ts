/* =====================================================================
   Landfall server: webhooks from Stripe and Duffel
   Both arrive at least once and in any order. Each event is recorded in
   webhook_events (ids and type only, never personal data) before it is
   acted on; one already processed is skipped, one that failed is
   processed again on the next delivery. A handler that throws makes the
   route answer 500, so the provider retries (Stripe for 3 days, Duffel
   for 72 hours): handlers throw on purpose when an event arrives before
   the booking is ready for it.
   Stripe (signature checked by the SDK with STRIPE_WEBHOOK_SECRET):
   - payment_intent.amount_capturable_updated: the card is authorised;
     complete the booking if the browser didn't (closed tab).
   - payment_intent.payment_failed: keep the decline reason.
   - payment_intent.canceled: an unpaid checkout ends.
   - charge.refunded: record the refunded amount (never lowered).
   Duffel (X-Duffel-Signature: t=<unix time>,v1=<hex HMAC-SHA256 of "t.body">;
   signatures older than 4 days are refused as replays):
   - stays.booking.created: the hotel confirmed a request that answered
     "pending": record it and take the payment.
   - stays.booking_creation_failed: release the hold.
   - order.created: nudge a booking still waiting on its order.
   - order.airline_initiated_change_detected: mark it changed, email.
   - order_cancellation.confirmed / stays.booking.cancelled: cancelled.
   - air.order.changed: fetch the e-tickets again.
   ===================================================================== */
import 'server-only';
import type Stripe from 'stripe';
import { adminDb } from '@/server/db/supabase';
import { need } from '@/server/env';
import { createHmac } from 'node:crypto';
import { hmacSha256Hex, safeEqual } from '@/server/crypto';
import { log } from '@/server/log';
import { addEvent, bookingById, paymentFor, saveDocuments, updateBooking, updatePayment } from '@/server/bookings/store';
import { confirm, failAndRelease, fulfil, needsReview } from '@/server/bookings/fulfil';
import { retrieveIntent } from '@/server/payments/stripe';
import { sendBookingNotice } from '@/server/email/bookings';
import { flightSupplier } from '@/server/supply';
import { duffelOrderBookingId, duffelStayBooking } from '@/server/supply/duffel';
import type { BookingRow } from '@/server/db/types';

/* thrown to make the provider deliver the event again later */
class RetryLater extends Error {}

/* true when the event should be processed (new, or failed before) */
async function begin(provider: 'stripe' | 'duffel', id: string, type: string, payload: Record<string, unknown>): Promise<boolean> {
  const db = adminDb();
  const { error } = await db.from('webhook_events').insert({ provider, event_id: id, type, payload: payload as never });
  if (!error) return true;
  if (error.code !== '23505') throw new Error(`webhook_events.insert: ${error.message}`);
  const { data } = await db.from('webhook_events').select('processed_at').eq('provider', provider).eq('event_id', id).single();
  return !data?.processed_at;
}
async function end(provider: 'stripe' | 'duffel', id: string, error?: unknown) {
  await adminDb().from('webhook_events')
    .update(error ? { error: String((error as Error)?.message ?? error).slice(0, 500) } : { processed_at: new Date().toISOString(), error: null })
    .eq('provider', provider).eq('event_id', id);
}

async function run(provider: 'stripe' | 'duffel', id: string, type: string, ids: Record<string, unknown>, fn: () => Promise<void>): Promise<void> {
  if (!(await begin(provider, id, type, ids))) return;
  try {
    await fn();
    await end(provider, id);
  } catch (e) {
    await end(provider, id, e);
    if (e instanceof RetryLater) log.info('webhook.retry_later', { provider, id, type, reason: e.message });
    else log.error('webhook.failed', { provider, id, type, error: e });
    throw e;
  }
}

/* ---------- Stripe ---------- */
export async function handleStripe(event: Stripe.Event): Promise<void> {
  const obj = event.data.object as { id?: string };
  await run('stripe', event.id, event.type, { object: obj.id ?? null }, async () => {
    switch (event.type) {
      case 'payment_intent.amount_capturable_updated':
      case 'payment_intent.canceled': {
        const pi = event.data.object;
        if (pi.metadata?.booking_id) await fulfil(pi.metadata.booking_id, 'webhook');
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const err = pi.last_payment_error;
        await updatePayment(pi.id, { failure_code: err?.code ?? null, decline_code: err?.decline_code ?? null });
        if (pi.metadata?.booking_id) await addEvent(pi.metadata.booking_id, 'payment_failed', { code: err?.code, decline: err?.decline_code });
        break;
      }
      case 'charge.refunded': {
        const ch = event.data.object;
        const intent = typeof ch.payment_intent === 'string' ? ch.payment_intent : ch.payment_intent?.id;
        if (!intent) break;
        /* events can arrive out of order: the refunded amount only ever grows */
        const { data: row } = await adminDb().from('payments').select('amount_refunded').eq('intent_id', intent).maybeSingle();
        const refunded = Math.max(row?.amount_refunded ?? 0, ch.amount_refunded);
        await updatePayment(intent, { amount_refunded: refunded, status: refunded >= ch.amount ? 'refunded' : 'partially_refunded' });
        break;
      }
      default:
        log.debug('webhook.stripe.ignored', { type: event.type });
    }
  });
}

/* ---------- Duffel ---------- */
const MAX_AGE_S = 4 * 24 * 3600; /* Duffel retries for 72 hours; webhook_events keeps processed ids for 30 days */

/* Why a delivery was refused, safe to send back: Duffel records our response body for each delivery
   (GET /air/webhooks/deliveries), so a mismatch can be diagnosed without server logs. It names the
   reason and the header's shape (digit and hex counts, never values), and on a mismatch whether one
   of the usual signing variants would have matched. None of it helps forge a signature: every
   variant still needs the secret. */
export type DuffelVerdict = { ok: true } | { ok: false; reason: 'missing_header' | 'bad_format' | 'stale' | 'mismatch'; shape?: string; variant?: string };

export function verifyDuffelDetailed(raw: string, header: string | null): DuffelVerdict {
  if (!header) return { ok: false, reason: 'missing_header' };
  /* "t=<10 digits>,v1=<hex 64>": long hex runs first, then digit runs */
  const shape = header.replace(/[0-9a-f]{16,}/gi, (h) => `<hex ${h.length}>`).replace(/\d+(?![^<]*>)/g, (d) => `<${d.length} digits>`).slice(0, 120);
  const parts = Object.fromEntries(header.split(',').map((p) => { const i = p.indexOf('='); return [p.slice(0, i).trim(), p.slice(i + 1).trim()]; }));
  if (!parts.t || !parts.v1 || !/^\d+$/.test(parts.t)) return { ok: false, reason: 'bad_format', shape };
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > MAX_AGE_S) return { ok: false, reason: 'stale', shape };
  const secret = need('DUFFEL_WEBHOOK_SECRET', 'Duffel webhooks');
  const v1 = parts.v1.toLowerCase();
  if (safeEqual(hmacSha256Hex(secret, `${parts.t}.${raw}`), v1)) return { ok: true };
  const hmac = (key: Buffer | string, msg: string) => createHmac('sha256', key).update(msg).digest('hex');
  const variants: [string, () => string][] = [
    ['base64_key', () => hmac(Buffer.from(secret, 'base64'), `${parts.t}.${raw}`)],
    ['body_only', () => hmac(secret, raw)],
    ['trimmed_body', () => hmac(secret, `${parts.t}.${raw.trim()}`)]
  ];
  const variant = variants.find(([, f]) => safeEqual(f(), v1))?.[0] ?? 'none';
  return { ok: false, reason: 'mismatch', shape, variant };
}
export const verifyDuffel = (raw: string, header: string | null) => verifyDuffelDetailed(raw, header).ok;

type DuffelEvent = { id: string; type: string; live_mode: boolean; data: { object: Record<string, string | undefined> } };

async function bookingWhere(column: 'offer_id' | 'quote_id' | 'supplier_order_id', value: string | undefined): Promise<BookingRow | null> {
  if (!value) return null;
  const { data } = await adminDb().from('bookings').select('*').eq(column, value).order('created_at', { ascending: false }).limit(1).maybeSingle();
  return data ?? null;
}

/* a Duffel order's booking, even when the event beats us to saving the order id */
async function bookingForOrder(orderId: string | undefined): Promise<BookingRow | null> {
  if (!orderId) return null;
  const known = await bookingWhere('supplier_order_id', orderId);
  if (known) return known;
  const bookingId = await duffelOrderBookingId(orderId);
  return bookingId ? bookingById(bookingId) : null;
}

export async function handleDuffel(event: DuffelEvent): Promise<void> {
  const o = event.data?.object ?? {};
  /* Duffel's event objects carry ids only; keep just those */
  const ids = Object.fromEntries(Object.entries(o).filter(([k, v]) => typeof v === 'string' && /(^|_)id$/.test(k)));
  await run('duffel', event.id, event.type, { object: ids, live_mode: event.live_mode }, async () => {
    switch (event.type) {
      case 'order.created': {
        const b = await bookingWhere('offer_id', o.offer_id);
        if (b?.status === 'processing') await fulfil(b.id, 'webhook');
        break;
      }
      case 'stays.booking.created': {
        const found = o.id ? await duffelStayBooking(o.id) : null;
        const b = found?.bookingId ? await bookingById(found.bookingId) : await bookingWhere('quote_id', o.quote_id);
        if (!b || !found) break;
        if (b.status === 'processing' && found.result.status === 'confirmed') {
          const pay = await paymentFor(b.id);
          if (!pay) throw new RetryLater('payment row missing');
          await confirm(b, await retrieveIntent(pay.intent_id), { kind: 'stay', r: found.result }, { status: 'processing' });
        } else if (b.status === 'failed' || b.status === 'expired') {
          /* the hotel confirmed after we released the customer's card */
          await needsReview(b, 'hotel_confirmed_after_release', { stay: o.id });
        }
        break;
      }
      case 'stays.booking_creation_failed': {
        const b = await bookingWhere('quote_id', o.quote_id);
        if (b?.status === 'processing') {
          const pay = await paymentFor(b.id);
          if (pay) await failAndRelease(b, await retrieveIntent(pay.intent_id), 'not_confirmed', { status: 'processing' });
        }
        break;
      }
      case 'order.airline_initiated_change_detected': {
        const b = await bookingForOrder(o.id ?? o.order_id);
        if (!b) break;
        if (b.status === 'processing') throw new RetryLater('booking not confirmed yet');
        await updateBooking(b.id, { summary: { ...(b.summary as object), changed: true } as never });
        await addEvent(b.id, 'airline_change', { aic: o.aic_id });
        await sendBookingNotice(b.id, 'changed', o.aic_id ?? event.id);
        break;
      }
      case 'air.order.changed': {
        const b = await bookingForOrder(o.order_id);
        if (b?.supplier_order_id) await saveDocuments(b.id, await flightSupplier('duffel').getDocuments(b.supplier_order_id));
        break;
      }
      case 'order_cancellation.confirmed':
      case 'stays.booking.cancelled': {
        const stay = event.type === 'stays.booking.cancelled';
        let b = stay ? await bookingWhere('supplier_order_id', o.id) : await bookingForOrder(o.order_id);
        if (!b && stay && o.id) { const found = await duffelStayBooking(o.id); b = found?.bookingId ? await bookingById(found.bookingId) : null; }
        if (!b) break;
        if (b.status === 'processing') throw new RetryLater('booking not confirmed yet');
        if (b.status === 'confirmed') {
          await updateBooking(b.id, { status: 'cancelled', cancelled_at: new Date().toISOString() });
          await addEvent(b.id, 'supplier_cancelled', { type: event.type });
          await sendBookingNotice(b.id, 'cancelled');
        }
        break;
      }
      default:
        log.debug('webhook.duffel.ignored', { type: event.type });
    }
  });
}
