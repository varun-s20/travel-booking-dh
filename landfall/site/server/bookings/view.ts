/* =====================================================================
   Landfall server: bookings as the pages see them
   - toView: a bookings row (with its payment and documents) -> the
     FlightBooking / StayBooking view model in lib/travel/bookings.ts.
   - listMine: My bookings, read with the customer's own session so Row
     Level Security applies as well as the query's filter.
   - viewable: one booking for whoever may see it: its owner, an admin,
     or the holder of its guest key (bookings made signed out). Anyone
     else gets "not found", so references can't be probed.
   Checkouts that never completed (pending_payment, expired, failed) are
   not listed in My bookings.
   ===================================================================== */
import 'server-only';
import { adminDb, userDb } from '@/server/db/supabase';
import { safeEqual, sha256 } from '@/server/crypto';
import { documentsFor, paymentFor } from '@/server/bookings/store';
import type { BookingRow, PaymentRow, TravelDocumentRow } from '@/server/db/types';
import type { SessionUser } from '@/server/auth';
import type { Booking, FlightBooking, Status, StayBooking, Traveler } from '@/lib/travel/bookings';
import type { FareId, FlightSearch, Pax, Slice } from '@/lib/travel/flights';
import type { StaySearch } from '@/lib/travel/hotels';
import type { Dict } from '@/lib/travel/registry';
import type { Cabin } from '@/lib/cabins';
import { cityById } from '@/lib/travel/hotels';

type FlightSummary = {
  kind: 'flight'; search: FlightSearch; slices: Slice[]; owner: string; fare: FareId; fareName: string; cabin: Cabin; pax: Pax;
  dict: Dict; base: number; tax: number; total: number; conditions?: { change: string; refund: string }; changed?: boolean;
};
type StaySummary = {
  kind: 'stay'; search: StaySearch;
  hotel: { id: string; name: string; city: string; area: string; address: string; country: string; photo: string | null; checkIn: string; checkOut: string; keyCollection: string | null };
  room: { id: string; name: string };
  plan: { id: string; name: string; board: string | null; refundable: boolean; freeCancelUntil: string | null; conditions: { title: string; body: string }[] };
  room_amount: number; tax: number; total: number; payAtHotel: { amount: number; currency: string } | null;
  guests: string[]; requests: string | null;
  hotelContact?: { phone: string | null; email: string | null; keyCollection: string | null };
};

const today = () => new Date().toISOString().slice(0, 10);

function statusOf(b: BookingRow, endDate: string, changed?: boolean): Status {
  if (b.status === 'confirmed') return endDate < today() ? 'completed' : changed ? 'changed' : 'confirmed';
  if (b.status === 'processing') return 'pending';
  if (b.status === 'cancelled') return 'canceled';
  return 'failed';
}

export function toView(b: BookingRow, pay: Pick<PaymentRow, 'card_brand' | 'card_last4'> | null, docs: Pick<TravelDocumentRow, 'type' | 'unique_identifier' | 'passenger_name'>[]): Booking {
  const common = {
    ref: b.reference, bookedAt: b.created_at.slice(0, 10), email: b.contact_email, phone: b.contact_phone,
    card: pay?.card_last4 ? { brand: pay.card_brand ?? 'Card', last4: pay.card_last4 } : null,
    currency: b.currency, supplierReference: b.supplier_reference,
    canceledAt: b.cancelled_at?.slice(0, 10), testMode: !b.live_mode
  };
  if (b.kind === 'flight') {
    const s = b.summary as unknown as FlightSummary;
    const end = s.search.ret ?? s.search.depart;
    const documents = docs.map((d) => ({ type: d.type, id: d.unique_identifier, passenger: d.passenger_name ?? undefined }));
    const view: FlightBooking = {
      ...common, kind: 'flight', status: statusOf(b, end, s.changed),
      from: s.search.from, to: s.search.to, depart: s.search.depart, ret: s.search.ret, slices: s.slices,
      airline: s.owner, fare: s.fare, fareName: s.fareName, cabin: s.cabin, pax: s.pax,
      travelers: b.travelers as unknown as Traveler[],
      amounts: { base: s.base, tax: s.tax, total: b.total_amount },
      ticketsPending: b.status === 'confirmed' && !documents.some((d) => d.type === 'electronic_ticket'),
      documents, refund: null, conditions: s.conditions, dict: s.dict
    };
    return view;
  }
  const s = b.summary as unknown as StaySummary;
  const view: StayBooking = {
    ...common, kind: 'stay', status: statusOf(b, s.search.checkout),
    hotel: s.hotel.id,
    stay: {
      name: s.hotel.name, city: s.hotel.city, cityName: cityById(s.hotel.city)?.name ?? s.hotel.city, area: s.hotel.area,
      address: s.hotel.address, country: s.hotel.country, photo: s.hotel.photo, checkIn: s.hotel.checkIn, checkOut: s.hotel.checkOut,
      phone: s.hotelContact?.phone ?? null, email: s.hotelContact?.email ?? null, keyCollection: s.hotelContact?.keyCollection ?? s.hotel.keyCollection
    },
    room: s.room.id, roomName: s.room.name, planName: s.plan.name, board: s.plan.board ?? undefined,
    search: s.search, guests: s.guests, requests: s.requests ?? undefined,
    amounts: { room: s.room_amount, tax: s.tax, total: b.total_amount }, payAtHotel: s.payAtHotel,
    freeCancelUntil: s.plan.refundable ? s.plan.freeCancelUntil : null, conditions: s.plan.conditions
  };
  return view;
}

/* ---------- My bookings ---------- */
const LIST_COLUMNS = 'id, reference, user_id, kind, status, supplier, live_mode, supplier_reference, contact_email, contact_phone, currency, total_amount, tax_amount, summary, travelers, failure_code, confirmed_at, cancelled_at, created_at, updated_at';

export async function listMine(user: SessionUser): Promise<Booking[]> {
  const db = await userDb();
  const { data, error } = await db.from('bookings')
    .select(`${LIST_COLUMNS}, payments(card_brand, card_last4, created_at), travel_documents(type, unique_identifier, passenger_name)`)
    .eq('user_id', user.id)
    .in('status', ['processing', 'confirmed', 'cancelled'])
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(`bookings.list: ${error.message}`);
  type Row = BookingRow & { payments: Pick<PaymentRow, 'card_brand' | 'card_last4' | 'created_at'>[]; travel_documents: Pick<TravelDocumentRow, 'type' | 'unique_identifier' | 'passenger_name'>[] };
  return ((data ?? []) as unknown as Row[]).map((r) => {
    const pay = [...(r.payments ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
    return toView(r, pay, r.travel_documents ?? []);
  });
}

/* ---------- one booking ---------- */
export async function viewable(reference: string, user: SessionUser | null, guestKey: string | null): Promise<{ row: BookingRow; view: Booking } | null> {
  if (!/^[A-Z2-9]{6}$/.test(reference)) return null;
  const { data: b } = await adminDb().from('bookings').select('*').eq('reference', reference).maybeSingle();
  if (!b) return null;
  const owner = !!user && (b.user_id === user.id || user.role === 'admin');
  const guest = !!guestKey && !!b.guest_token_hash && safeEqual(sha256(guestKey), b.guest_token_hash);
  if (!owner && !guest) return null;
  const [pay, docs] = await Promise.all([paymentFor(b.id), documentsFor(b.id)]);
  return { row: b, view: toView(b, pay, docs) };
}
