/* =====================================================================
   Landfall server: booking rows (service role)
   Small helpers around the bookings, payments, documents and audit
   tables, so the checkout, fulfilment, webhooks and the scheduled job
   share one way of reading and recording a booking's life.
   ===================================================================== */
import 'server-only';
import { adminDb } from '@/server/db/supabase';
import { log } from '@/server/log';
import type { BookingRow, PaymentRow, TravelDocumentRow } from '@/server/db/types';

export async function bookingById(id: string): Promise<BookingRow | null> {
  const { data } = await adminDb().from('bookings').select('*').eq('id', id).maybeSingle();
  return data ?? null;
}
export async function bookingByReference(ref: string): Promise<BookingRow | null> {
  if (!/^[A-Z2-9]{6}$/.test(ref)) return null;
  const { data } = await adminDb().from('bookings').select('*').eq('reference', ref).maybeSingle();
  return data ?? null;
}
export async function bookingByCheckoutKey(key: string): Promise<BookingRow | null> {
  const { data } = await adminDb().from('bookings').select('*').eq('checkout_key', key).maybeSingle();
  return data ?? null;
}
export async function paymentFor(bookingId: string): Promise<PaymentRow | null> {
  const { data } = await adminDb().from('payments').select('*').eq('booking_id', bookingId).order('created_at', { ascending: false }).limit(1).maybeSingle();
  return data ?? null;
}
export async function documentsFor(bookingId: string): Promise<TravelDocumentRow[]> {
  const { data } = await adminDb().from('travel_documents').select('*').eq('booking_id', bookingId).order('created_at');
  return data ?? [];
}

export async function updateBooking(id: string, patch: Partial<BookingRow>): Promise<void> {
  const { error } = await adminDb().from('bookings').update(patch).eq('id', id);
  if (error) throw new Error(`bookings.update: ${error.message}`);
}
export async function updatePayment(intentId: string, patch: Partial<PaymentRow>): Promise<void> {
  const { error } = await adminDb().from('payments').update(patch).eq('intent_id', intentId);
  if (error) throw new Error(`payments.update: ${error.message}`);
}

export async function saveDocuments(bookingId: string, docs: { type: string; id: string; passenger?: string }[]): Promise<void> {
  if (!docs.length) return;
  const rows = docs.map((d) => ({ booking_id: bookingId, type: d.type, unique_identifier: d.id, passenger_name: d.passenger ?? null }));
  const { error } = await adminDb().from('travel_documents').upsert(rows, { onConflict: 'booking_id,type,unique_identifier', ignoreDuplicates: true });
  if (error) log.error('documents.save', { bookingId, error: error.message });
}

/* the audit trail: never lets a logging failure break a booking */
export async function addEvent(bookingId: string, type: string, detail: Record<string, unknown> = {}): Promise<void> {
  const { error } = await adminDb().from('booking_events').insert({ booking_id: bookingId, type, detail: detail as never });
  if (error) log.warn('booking_events.insert', { bookingId, type, error: error.message });
}
