/* =====================================================================
   Landfall server: starting a checkout
   POST /api/checkout. In order:
   1. the same checkout attempt (checkoutKey) returns what it already made,
      so a double click or a retry never creates a second booking;
   2. the offer or rate is resolved on the server (the browser only sends
      ids) and the travelers are checked against it (counts, ages,
      passports when the airline needs them);
   3. "Fare and availability revalidation before booking": the supplier is
      asked for the current price; if it differs from what the customer
      saw, nothing is created and the new price comes back (price_changed);
   4. the booking is recorded (pending_payment) with a display snapshot,
      and passenger documents sealed with AES-256-GCM;
   5. a Stripe PaymentIntent is created for the server's price, manual
      capture, and its client secret goes back for the Payment Element.
   Signed-out customers get a one-time guest key (only its hash is stored)
   that opens the confirmation page and booking page for this booking.
   ===================================================================== */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { adminDb } from '@/server/db/supabase';
import { conflict, unavailable, unprocessable } from '@/server/errors';
import { SupplyError } from '@/server/errors';
import { stripeConfigured, stripeLive, supplierLive } from '@/server/env';
import { log } from '@/server/log';
import { guestKeyFor, newReference, seal, sha256 } from '@/server/crypto';
import { getItinerary } from '@/server/flights';
import { getRate } from '@/server/stays';
import { flightSupplier, staySupplier } from '@/server/supply';
import { createAuthorization, retrieveIntent } from '@/server/payments/stripe';
import { addEvent, bookingByCheckoutKey, paymentFor } from '@/server/bookings/store';
import { ageOn, type FlightCheckoutInput, type StayCheckoutInput, type CheckoutInput } from '@/server/bookings/schemas';
import { fareFor, type FareId } from '@/lib/travel/flights';
import { appCurrency } from '@/server/pricing';
import type { SessionUser } from '@/server/auth';
import type { Ctx } from '@/server/http';
import type { BookingRow } from '@/server/db/types';
import type { OrderTraveler, SupplierPassenger } from '@/server/supply/types';

export type CheckoutStarted = {
  bookingId: string; reference: string; clientSecret: string; total: number; currency: string;
  guestKey?: string; status: BookingRow['status'];
};

/* what is sealed in bookings.sensitive_enc until the supplier booking is made */
export type FlightSensitive = { kind: 'flight'; travelers: OrderTraveler[]; passengers: SupplierPassenger[]; device: { ip?: string; userAgent?: string } };
export type StaySensitive = { kind: 'stay'; guests: { given: string; family: string }[]; requests?: string; device: { ip?: string; userAgent?: string } };

export async function startCheckout(input: CheckoutInput, user: SessionUser | null, ctx: Ctx): Promise<CheckoutStarted> {
  if (!stripeConfigured()) throw unavailable('payments_unavailable');

  const existing = await bookingByCheckoutKey(input.checkoutKey);
  if (existing) return resume(existing, user);

  const device = { ip: ctx.ip, userAgent: ctx.req.headers.get('user-agent') ?? undefined };
  const id = randomUUID();
  const draft = input.kind === 'flight' ? await prepareFlight(input, id, device) : await prepareStay(input, id, device);
  /* real money only for real bookings, and real bookings only for real money */
  if (stripeLive() !== supplierLive(draft.row.supplier)) {
    log.error('ALERT payment_mode_mismatch', { supplier: draft.row.supplier, stripeLive: stripeLive() });
    throw unavailable('payments_unavailable');
  }

  const guestKey = user ? undefined : guestKeyFor(id);
  const row = {
    id, user_id: user?.id ?? null, status: 'pending_payment' as const,
    checkout_key: input.checkoutKey, contact_email: input.contact.email, contact_phone: input.contact.phone,
    guest_token_hash: guestKey ? sha256(guestKey) : null,
    ...draft.row
  };
  const reference = await insertWithReference(row);
  if (reference === null) {
    /* the same attempt arrived twice at once: answer with the first one's booking */
    const first = await bookingByCheckoutKey(input.checkoutKey);
    if (!first) throw conflict('checkout_incomplete');
    return resume(first, user);
  }
  await addEvent(id, 'checkout_started', { kind: input.kind, supplier: row.supplier, total: row.total_amount, signedIn: !!user });

  const pi = await authorize(id, reference, row.total_amount, row.currency, input.kind);
  return { bookingId: id, reference, clientSecret: pi.client_secret!, total: row.total_amount, currency: row.currency, guestKey, status: 'pending_payment' };
}

/* The booking's PaymentIntent and its payments row. Every parameter comes from the booking alone,
   so a repeat with the same idempotency key returns the same intent instead of an error. */
async function authorize(bookingId: string, reference: string, amount: number, currency: string, kind: 'flight' | 'stay') {
  const pi = await createAuthorization({ bookingId, reference, amount, currency, description: `Landfall ${kind === 'flight' ? 'flight' : 'stay'} booking ${reference}` });
  const { error } = await adminDb().from('payments').upsert({ booking_id: bookingId, intent_id: pi.id, status: 'requires_payment', amount: pi.amount, currency }, { onConflict: 'intent_id', ignoreDuplicates: true });
  if (error) throw new Error(`payments.insert: ${error.message}`);
  return pi;
}

/* the same attempt again: hand back the same payment (never a second booking) */
async function resume(b: BookingRow, user: SessionUser | null): Promise<CheckoutStarted> {
  if (b.user_id && b.user_id !== user?.id) throw conflict('checkout_key_in_use');
  /* the first request may still be creating the payment: give it a moment, then make it here
     (an earlier attempt may have failed between recording the booking and creating the payment) */
  let pay = await paymentFor(b.id);
  for (let i = 0; !pay && i < 4; i++) { await new Promise((r) => setTimeout(r, 500)); pay = await paymentFor(b.id); }
  if (!pay) {
    if (b.status !== 'pending_payment') throw conflict('checkout_incomplete');
    const made = await authorize(b.id, b.reference, b.total_amount, b.currency, b.kind);
    return { bookingId: b.id, reference: b.reference, clientSecret: made.client_secret!, total: b.total_amount, currency: b.currency, status: b.status, guestKey: b.user_id ? undefined : guestKeyFor(b.id) };
  }
  const pi = await retrieveIntent(pay.intent_id);
  return { bookingId: b.id, reference: b.reference, clientSecret: pi.client_secret!, total: b.total_amount, currency: b.currency, status: b.status, guestKey: b.user_id ? undefined : guestKeyFor(b.id) };
}

/* a new reference until one is free (6 characters from 32: a collision is rare, never fatal);
   null when this checkout key already has a booking (the same attempt sent twice) */
async function insertWithReference(row: Record<string, unknown>): Promise<string | null> {
  for (let i = 0; i < 5; i++) {
    const reference = newReference();
    const { error } = await adminDb().from('bookings').insert({ ...row, reference } as never);
    if (!error) return reference;
    if (error.code === '23505' && /checkout_key/.test(error.message)) return null;
    if (error.code !== '23505') throw new Error(`bookings.insert: ${error.message}`);
  }
  throw new Error('bookings.insert: no free reference after 5 tries');
}

type Draft = { row: Omit<BookingRow, 'id' | 'reference' | 'user_id' | 'status' | 'checkout_key' | 'contact_email' | 'contact_phone' | 'guest_token_hash' | 'failure_code' | 'fulfilment_attempts' | 'fulfilment_started_at' | 'confirmed_at' | 'cancelled_at' | 'created_at' | 'updated_at' | 'supplier_order_id' | 'supplier_reference' | 'live_mode' | 'needs_review' | 'supplier_pending'> & { live_mode?: boolean } };

/* ---------- flights ---------- */
async function prepareFlight(input: FlightCheckoutInput, bookingId: string, device: FlightSensitive['device']): Promise<Draft> {
  const it = await getItinerary(input.offerId);
  if (!it || Date.now() > it.offer.expiresAt) throw conflict('offer_expired');
  const { offer, search, stored } = it;
  const fare = fareFor(offer, input.fare as FareId);

  /* the travelers must be the party that was searched, in order: adults, children, infants */
  const want = [...Array(search.adults).fill('adult'), ...Array(search.children).fill('child'), ...Array(search.infants).fill('infant')];
  if (input.travelers.length !== want.length || input.travelers.some((t, i) => t.type !== want[i])) throw unprocessable('travelers_mismatch', { expected: want });
  const lastDay = search.ret ?? search.depart;
  const today = new Date().toISOString().slice(0, 10);
  const problems: { index: number; field: string; code: string }[] = [];
  input.travelers.forEach((t, i) => {
    if (t.bornOn >= today) problems.push({ index: i, field: 'bornOn', code: 'date_of_birth_in_future' });
    const age = ageOn(t.bornOn, search.depart);
    if (t.type === 'infant' && ageOn(t.bornOn, lastDay) >= 2) problems.push({ index: i, field: 'bornOn', code: 'infant_too_old' });
    if (t.type === 'child' && (age < 2 || age >= 12)) problems.push({ index: i, field: 'bornOn', code: 'child_age' });
    if (t.type === 'adult' && age < 12) problems.push({ index: i, field: 'bornOn', code: 'adult_too_young' });
    if (age > 120) problems.push({ index: i, field: 'bornOn', code: 'date_of_birth_invalid' });
    if (offer.passport) {
      if (!t.passport) problems.push({ index: i, field: 'passport', code: 'passport_required' });
      else if (t.passport.expiresOn <= lastDay) problems.push({ index: i, field: 'passport.expiresOn', code: 'passport_expires_before_trip' });
    }
  });
  if (problems.length) throw unprocessable('travelers_invalid', { problems });
  if (stored.passengers.length !== want.length) throw conflict('offer_expired');

  const q = await flightSupplier(stored.supplier).quoteOffer(fare.offerId);
  if (q.status === 'sold_out') throw conflict('sold_out');
  if (q.status === 'expired') throw conflict('offer_expired');
  if (q.total !== input.expectedTotal) throw conflict('price_changed', { before: input.expectedTotal, after: q.total });
  if (q.supplierCurrency !== appCurrency() && stored.supplier === 'duffel') throw conflict('currency_unsupported');

  const travelers: OrderTraveler[] = input.travelers.map((t) => ({
    title: t.title, given: t.given, family: t.family, bornOn: t.bornOn, gender: t.gender, type: t.type,
    passport: offer.passport && t.passport ? t.passport : null
  }));
  const sensitive: FlightSensitive = { kind: 'flight', travelers, passengers: stored.passengers, device };
  const summary = {
    kind: 'flight', search, slices: offer.slices, owner: offer.owner, fare: fare.id, fareName: fare.name,
    cabin: search.cabin, pax: offer.passengers, dict: offer.dict, base: q.total - q.tax, tax: q.tax, total: q.total,
    conditions: { change: fare.rows?.changes ?? '', refund: fare.rows?.refunds ?? '' }, passport: offer.passport
  };
  return {
    row: {
      kind: 'flight', supplier: stored.supplier, offer_id: fare.offerId, offer_request_id: stored.supplier === 'duffel' ? stored.id : null,
      rate_id: null, quote_id: null,
      currency: appCurrency(), total_amount: q.total, tax_amount: q.tax, supplier_amount: q.supplierTotal, supplier_currency: q.supplierCurrency,
      summary: summary as never,
      travelers: input.travelers.map((t, i) => ({ name: `${t.given} ${t.family}`, type: t.type, lead: i === 0 || undefined })) as never,
      sensitive_enc: seal(sensitive, bookingId),
      expires_at: new Date(offer.expiresAt).toISOString()
    }
  };
}

/* ---------- stays ---------- */
async function prepareStay(input: StayCheckoutInput, bookingId: string, device: StaySensitive['device']): Promise<Draft> {
  const rate = await getRate(input.rateId);
  if (!rate || rate.hotel.id !== input.hotelId) throw conflict('rate_expired');
  let q;
  try {
    q = await staySupplier(rate.supplier).quote(rate);
  } catch (e) {
    if (e instanceof SupplyError && (e.code === 'sold_out' || e.code === 'expired')) throw conflict('sold_out');
    throw e;
  }
  if (q.total !== input.expectedTotal) throw conflict('price_changed', { before: input.expectedTotal, after: q.total });
  if (q.supplierCurrency !== appCurrency() && rate.supplier === 'duffel') throw conflict('currency_unsupported');

  const { hotel, room, plan, search } = rate;
  const sensitive: StaySensitive = { kind: 'stay', guests: input.guests, requests: input.requests || undefined, device };
  const summary = {
    kind: 'stay', search,
    hotel: {
      id: hotel.id, name: hotel.name, city: hotel.city, area: hotel.area, address: hotel.address, country: hotel.country,
      photo: hotel.photos[0]?.name ?? null, checkIn: hotel.checkIn, checkOut: hotel.checkOut, keyCollection: hotel.keyCollection ?? null
    },
    room: { id: room.id, name: room.name },
    plan: { id: plan.id, name: plan.name, board: plan.board ?? null, refundable: plan.refundable, freeCancelUntil: plan.refundable ? plan.freeCancelUntil ?? null : null, conditions: plan.conditions ?? [] },
    room_amount: q.total - q.tax, tax: q.tax, total: q.total, payAtHotel: q.payAtHotel,
    guests: input.guests.map((g) => `${g.given} ${g.family}`), requests: input.requests || null
  };
  return {
    row: {
      kind: 'stay', supplier: rate.supplier, offer_id: null, offer_request_id: null, rate_id: plan.id, quote_id: q.quoteId,
      currency: appCurrency(), total_amount: q.total, tax_amount: q.tax, supplier_amount: q.supplierTotal, supplier_currency: q.supplierCurrency,
      summary: summary as never,
      travelers: input.guests.map((g, i) => ({ name: `${g.given} ${g.family}`, type: 'adult', lead: i === 0 || undefined })) as never,
      sensitive_enc: seal(sensitive, bookingId),
      expires_at: new Date(Math.min(rate.expiresAt, Date.now() + 60 * 60 * 1000)).toISOString()
    }
  };
}

