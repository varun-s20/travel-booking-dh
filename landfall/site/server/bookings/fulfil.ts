/* =====================================================================
   Landfall server: completing a booking after the card is authorised
   Called by the browser right after Stripe confirms the card (POST
   /api/checkout/<id>/complete), by Stripe's webhook as a safety net when
   the tab was closed, and by the scheduled job for anything left halfway.
   All three can run at once; claim_booking_for_fulfilment lets exactly one
   of them book with the supplier.

     pending_payment --card authorised--> processing --supplier booked--> confirmed (payment captured)
                                                     \--supplier refused--> failed (card hold released)
                                                     \--no clear answer--> processing (checked again later)

   Rules:
   - the Stripe PaymentIntent must belong to this booking, for its exact
     amount and currency, and be live exactly when the supplier is live:
     real money never pays for a test booking, nor test money for a real one;
   - every state change is a compare-and-set on the claim this worker holds
     (status and attempt number), so a slower or overtaken worker can never
     overwrite another's outcome, release a captured payment or capture a
     released one;
   - the supplier booking is saved before the payment is captured, so a
     capture failure never loses a booking (the job retries the capture);
   - an unclear supplier answer (timeout, 5xx, a hotel's "pending") never
     releases the payment. A later attempt first asks the supplier whether
     it booked (Duffel has no idempotency key), and a hotel request that
     answered "pending" is never sent again, only checked;
   - on a retry, a refusal is double-checked with the supplier before the
     hold is released;
   - passenger documents are erased as soon as the booking ends either way.
   ===================================================================== */
import 'server-only';
import type Stripe from 'stripe';
import { adminDb } from '@/server/db/supabase';
import { SupplyError } from '@/server/errors';
import { supplierLive } from '@/server/env';
import { unseal } from '@/server/crypto';
import { log } from '@/server/log';
import { flightSupplier, staySupplier } from '@/server/supply';
import { captureIntent, cardOf, releaseIntent, retrieveIntent } from '@/server/payments/stripe';
import { addEvent, bookingById, paymentFor, saveDocuments, updatePayment } from '@/server/bookings/store';
import { sendBookingConfirmation } from '@/server/email/bookings';
import type { BookingRow, BookingStatus } from '@/server/db/types';
import type { FlightOrderResult, StayBookingResult } from '@/server/supply/types';
import type { FlightSensitive, StaySensitive } from '@/server/bookings/checkout';

export type FulfilStatus = 'confirmed' | 'processing' | 'awaiting_payment' | 'failed';
export type FulfilOutcome = { status: FulfilStatus; reference: string; code?: string };
export type SupplierResult = { kind: 'flight'; r: FlightOrderResult } | { kind: 'stay'; r: StayBookingResult };
/* the state a worker expects the booking to be in; attempts pins it to one claim */
export type Expect = { status: BookingStatus; attempts?: number };

/* codes the browser may see; anything about our own accounts (an empty Duffel balance) reads as a refusal */
const PUBLIC_CODE: Record<string, string> = { insufficient_balance: 'not_confirmed', unavailable: 'not_confirmed', timeout: 'not_confirmed' };
const out = (b: BookingRow, status: FulfilStatus, code?: string): FulfilOutcome => ({ status, reference: b.reference, ...(code ? { code: PUBLIC_CODE[code] ?? code } : {}) });

export function outcomeOf(b: BookingRow): FulfilOutcome {
  if (b.status === 'confirmed') return out(b, 'confirmed');
  if (b.status === 'processing') return out(b, 'processing');
  if (b.status === 'pending_payment') return out(b, 'awaiting_payment');
  return out(b, 'failed', b.failure_code ?? b.status);
}

/* compare-and-set: applies the patch only while the booking is still as expected */
async function transition(b: BookingRow, from: Expect, patch: Partial<BookingRow>): Promise<boolean> {
  let q = adminDb().from('bookings').update(patch).eq('id', b.id).eq('status', from.status);
  if (from.attempts !== undefined) q = q.eq('fulfilment_attempts', from.attempts);
  const { data, error } = await q.select('id');
  if (error) throw new Error(`bookings.transition: ${error.message}`);
  return !!data?.length;
}

/* parks a booking for a person: the job stops touching it */
export async function needsReview(b: BookingRow, why: string, detail: Record<string, unknown> = {}): Promise<void> {
  await adminDb().from('bookings').update({ needs_review: true }).eq('id', b.id);
  await addEvent(b.id, 'needs_review', { why, ...detail });
  log.error(`ALERT booking_needs_review: ${why}`, { bookingId: b.id, reference: b.reference, ...detail });
}

export async function fulfil(bookingId: string, source: 'client' | 'webhook' | 'job'): Promise<FulfilOutcome> {
  let b = await bookingById(bookingId);
  if (!b) throw new Error(`fulfil: booking ${bookingId} not found`);
  if (b.status !== 'pending_payment' && b.status !== 'processing') return outcomeOf(b);

  const pay = await paymentFor(b.id);
  if (!pay) return out(b, 'failed', 'payment_missing');
  const pi = await retrieveIntent(pay.intent_id);

  /* the intent must be this booking's, for exactly this amount */
  if (pi.metadata?.booking_id !== b.id || pi.amount !== b.total_amount || pi.currency !== b.currency.toLowerCase()) {
    await needsReview(b, 'payment_mismatch', { intent: pi.id, amount: pi.amount, expected: b.total_amount });
    return out(b, 'failed', 'payment_mismatch');
  }
  if (pi.status === 'canceled') {
    if (b.status === 'pending_payment') {
      if (await transition(b, { status: 'pending_payment' }, { status: 'failed', failure_code: 'payment_canceled', sensitive_enc: null })) {
        await updatePayment(pi.id, { status: 'cancelled', cancelled_at: new Date().toISOString() });
      }
    } else if (!b.needs_review) {
      /* the hold was released while a booking was in progress: the supplier may have booked */
      await needsReview(b, 'payment_released_while_processing', { intent: pi.id });
    }
    return out(b, b.status === 'processing' ? 'processing' : 'failed', 'payment_canceled');
  }
  if (pi.status !== 'requires_capture' && pi.status !== 'succeeded') return out(b, b.status === 'processing' ? 'processing' : 'awaiting_payment');

  /* real money only with a live supplier, test money only with a test or simulated one */
  if (pi.livemode !== supplierLive(b.supplier)) {
    log.error('ALERT payment_mode_mismatch', { bookingId: b.id, stripeLive: pi.livemode, supplier: b.supplier });
    if (b.status === 'pending_payment' && await transition(b, { status: 'pending_payment' }, { status: 'failed', failure_code: 'mode_mismatch', sensitive_enc: null })) {
      await release(b, pi);
    }
    return out(b, 'failed', 'not_confirmed');
  }

  const card = cardOf(pi);
  if (pay.status === 'requires_payment') {
    await updatePayment(pi.id, { status: 'authorized', authorized_at: new Date().toISOString(), card_brand: card?.brand ?? null, card_last4: card?.last4 ?? null, failure_code: null, decline_code: null });
  }

  /* exactly one worker goes on from here */
  const { data: claimed, error } = await adminDb().rpc('claim_booking_for_fulfilment', { p_booking: b.id });
  if (error) {
    /* the one-order-per-search index: another checkout already booked this offer */
    if (error.code === '23505' && b.status === 'pending_payment') {
      if (await transition(b, { status: 'pending_payment' }, { status: 'failed', failure_code: 'sold_out', sensitive_enc: null })) await release(b, pi);
      return out(b, 'failed', 'sold_out');
    }
    throw new Error(`claim: ${error.message}`);
  }
  if (!claimed?.length) {
    const now = await bookingById(b.id);
    return now ? outcomeOf(now) : out(b, 'processing');
  }
  b = claimed[0];
  const mine: Expect = { status: 'processing', attempts: b.fulfilment_attempts };
  await addEvent(b.id, 'fulfilment_started', { source, attempt: b.fulfilment_attempts });

  let result: SupplierResult | null = null;
  try {
    result = await bookWithSupplier(b);
  } catch (e) {
    if (!(e instanceof SupplyError) || e.ambiguous) {
      const code = e instanceof SupplyError ? e.code : 'internal_error';
      log.error('fulfil.ambiguous', { bookingId: b.id, code, error: e });
      await addEvent(b.id, 'supplier_ambiguous', { code });
      return out(b, 'processing');
    }
    if (e.code === 'insufficient_balance') log.error('ALERT duffel_balance_empty', { bookingId: b.id, reference: b.reference });
    /* a refusal on a retry may be our own earlier booking: ask once more before releasing */
    if (b.fulfilment_attempts > 1) result = await lookup(b).catch(() => null);
    if (!result) {
      await failAndRelease(b, pi, e.code, mine);
      return out(b, 'failed', e.code);
    }
  }

  if (result.kind === 'stay' && result.r.status === 'pending') {
    await adminDb().from('bookings').update({ supplier_pending: true }).eq('id', b.id);
    await addEvent(b.id, 'supplier_pending', {});
    return out(b, 'processing');
  }
  return confirm(b, pi, result, mine);
}

/* records the supplier booking, then takes the money and sends the email */
export async function confirm(b: BookingRow, pi: Stripe.PaymentIntent, result: SupplierResult, from: Expect): Promise<FulfilOutcome> {
  if (!(await recordConfirmed(b, result, from))) {
    /* someone else changed the booking meanwhile: never capture on a state we don't own */
    await needsReview(b, 'state_changed_after_supplier_booked', { order: result.kind === 'flight' ? result.r.orderId : result.r.bookingId });
    return out(b, 'processing');
  }
  const captured = await capture(b, pi);
  if (captured) {
    try { await sendBookingConfirmation(b.id); } catch (e) { log.error('email.confirmation', { bookingId: b.id, error: e }); }
  }
  return out(b, 'confirmed');
}

/* ---------- suppliers ---------- */
async function bookWithSupplier(b: BookingRow): Promise<SupplierResult> {
  return b.kind === 'flight' ? { kind: 'flight', r: await bookFlight(b) } : { kind: 'stay', r: await bookStay(b) };
}

/* did the supplier book this booking already? (orders and bookings carry our booking id) */
async function lookup(b: BookingRow): Promise<SupplierResult | null> {
  if (b.kind === 'flight') {
    const r = b.offer_id ? await flightSupplier(b.supplier).findOrder(b.offer_id, b.id) : null;
    return r ? { kind: 'flight', r } : null;
  }
  const r = await staySupplier(b.supplier).findBooking(b.id);
  return r ? { kind: 'stay', r } : null;
}

async function bookFlight(b: BookingRow): Promise<FlightOrderResult> {
  if (!b.offer_id || !b.contact_phone) throw new SupplyError('not_confirmed', 'booking is missing its offer or phone');
  const supplier = flightSupplier(b.supplier);
  /* a later attempt: the previous one may have booked before it lost its answer */
  if (b.fulfilment_attempts > 1) {
    const found = await supplier.findOrder(b.offer_id, b.id);
    if (found) return found;
  }
  if (!b.sensitive_enc) throw new SupplyError('not_confirmed', 'traveler details are no longer available');
  const s = unseal<FlightSensitive>(b.sensitive_enc, b.id);
  try {
    return await supplier.createOrder({
      bookingId: b.id, reference: b.reference, offerId: b.offer_id,
      supplierAmount: b.supplier_amount, supplierCurrency: b.supplier_currency,
      passengers: s.passengers, travelers: s.travelers, email: b.contact_email, phone: b.contact_phone, device: s.device
    });
  } catch (e) {
    if (e instanceof SupplyError && e.code === 'already_booked') {
      const found = await supplier.findOrder(b.offer_id, b.id);
      if (found) return found;
    }
    throw e;
  }
}

async function bookStay(b: BookingRow): Promise<StayBookingResult> {
  if (!b.quote_id || !b.contact_phone) throw new SupplyError('not_confirmed', 'booking is missing its quote or phone');
  const supplier = staySupplier(b.supplier);
  if (b.fulfilment_attempts > 1 || b.supplier_pending) {
    const found = await supplier.findBooking(b.id);
    if (found) return found;
    /* the hotel accepted the request earlier: wait for its answer, never send it twice */
    if (b.supplier_pending) throw new SupplyError('timeout', 'hotel confirmation still pending', true);
  }
  if (!b.sensitive_enc) throw new SupplyError('not_confirmed', 'guest details are no longer available');
  const s = unseal<StaySensitive>(b.sensitive_enc, b.id);
  try {
    return await supplier.book({ bookingId: b.id, reference: b.reference, quoteId: b.quote_id, guests: s.guests, email: b.contact_email, phone: b.contact_phone, requests: s.requests, device: s.device });
  } catch (e) {
    if (e instanceof SupplyError && e.code === 'already_booked') {
      const found = await supplier.findBooking(b.id);
      if (found) return found;
    }
    throw e;
  }
}

/* ---------- outcomes ---------- */
/* true when this worker's view still held and the booking is now confirmed */
export async function recordConfirmed(b: BookingRow, result: SupplierResult, from: Expect): Promise<boolean> {
  const now = new Date().toISOString();
  let ok: boolean;
  if (result.kind === 'flight') {
    const docs = result.r.documents;
    const travelers = (b.travelers as { name: string; type: string; lead?: boolean }[]).map((t) => ({ ...t, ticket: docs.find((d) => d.type === 'electronic_ticket' && d.passenger && d.passenger.toLowerCase().includes(t.name.toLowerCase()))?.id }));
    ok = await transition(b, from, { status: 'confirmed', supplier_order_id: result.r.orderId, supplier_reference: result.r.pnr, live_mode: result.r.liveMode, confirmed_at: now, sensitive_enc: null, failure_code: null, supplier_pending: false, travelers: travelers as never });
    if (ok) await saveDocuments(b.id, docs);
  } else {
    const summary = { ...(b.summary as Record<string, unknown>), hotelContact: { phone: result.r.hotelPhone ?? null, email: result.r.hotelEmail ?? null, keyCollection: result.r.keyCollection ?? null } };
    ok = await transition(b, from, { status: 'confirmed', supplier_order_id: result.r.bookingId, supplier_reference: result.r.confirmation, live_mode: result.r.liveMode, confirmed_at: now, sensitive_enc: null, failure_code: null, supplier_pending: false, summary: summary as never });
  }
  if (ok) await addEvent(b.id, 'supplier_confirmed', { order: result.kind === 'flight' ? result.r.orderId : result.r.bookingId });
  return ok;
}

/* captures the authorised payment; on failure the booking stays confirmed and the job retries */
export async function capture(b: BookingRow, pi: Stripe.PaymentIntent): Promise<boolean> {
  try {
    const status = pi.status === 'succeeded' ? 'succeeded' : await captureIntent(pi.id);
    if (status !== 'succeeded') throw new Error(`payment intent is ${status} after capture`);
    await updatePayment(pi.id, { status: 'captured', captured_at: new Date().toISOString() });
    await addEvent(b.id, 'payment_captured', { amount: pi.amount });
    return true;
  } catch (e) {
    log.error('ALERT payment.capture_failed', { bookingId: b.id, intent: pi.id, error: e });
    await addEvent(b.id, 'payment_capture_failed', { message: (e as Error).message });
    return false;
  }
}

/* releases the hold and records what really happened to the payment */
async function release(b: BookingRow, pi: Stripe.PaymentIntent): Promise<void> {
  try {
    const status = await releaseIntent(pi.id);
    if (status === 'canceled') await updatePayment(pi.id, { status: 'cancelled', cancelled_at: new Date().toISOString() });
    else if (status === 'succeeded') await needsReview(b, 'charged_but_not_booked', { intent: pi.id });
    else throw new Error(`payment intent is ${status} after release`);
  } catch (e) {
    /* the payment row stays 'authorized': the job retries the release */
    log.error('payment.release_failed', { bookingId: b.id, intent: pi.id, error: e });
    await addEvent(b.id, 'payment_release_failed', { message: (e as Error).message });
  }
}

/* the booking fails first (only if still as expected), then the hold is released */
export async function failAndRelease(b: BookingRow, pi: Stripe.PaymentIntent, code: string, from: Expect): Promise<boolean> {
  if (!(await transition(b, from, { status: 'failed', failure_code: code, sensitive_enc: null, supplier_pending: false }))) return false;
  await addEvent(b.id, 'supplier_failed', { code });
  await release(b, pi);
  return true;
}

export { release, transition };
