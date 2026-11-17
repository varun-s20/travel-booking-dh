/* =====================================================================
   travel-booking (working name Overwing, a placeholder): bookings
   One shape for every booking the demo shows: the demo account's four
   from content/copy.md (built from the same mock offers and hotels, so
   the itinerary matches the results pages), and the ones a visitor makes,
   which the order route handlers return and lib/store.ts keeps in the
   browser. References use letters and digits that can't be misread.
   ===================================================================== */
import { AIRLINES, OFFER_LIFETIME, fareFor, generateOffers, offerTotals, seats, type FareId, type Pax, type Slice, type Amounts } from '@/lib/mock/flights';
import { hotelById, stayTotals, type RatePlanId, type StaySearch } from '@/lib/mock/hotels';
import type { Cabin } from '@/lib/cabins';

export type Status = 'confirmed' | 'pending' | 'changed' | 'canceled' | 'completed';
export type Traveler = { name: string; type: 'adult' | 'child' | 'infant'; lead?: boolean; ticket?: string };
export type Card = { brand: string; last4: string };

export type FlightBooking = {
  kind: 'flight'; ref: string; status: Status; bookedAt: string; owner: string | null;
  from: string; to: string; depart: string; ret: string | null; slices: Slice[]; airline: string;
  fare: FareId; cabin: Cabin; pax: Pax; travelers: Traveler[]; amounts: Amounts;
  card: Card; email: string; ticketsAt: number;
  /* refund in cents when the airline allows cancelling online, otherwise null */
  refund: number | null; canceledAt?: string;
};
export type StayBooking = {
  kind: 'stay'; ref: string; status: Status; bookedAt: string; owner: string | null;
  hotel: string; room: string; search: StaySearch; guests: string[]; requests?: string;
  /* the rate plan booked (round 3); older bookings and the demo account's have none and read as the room's first plan */
  plan?: RatePlanId; arrival?: string;
  amounts: { room: number; tax: number; total: number }; card: Card; email: string;
  freeCancelUntil: string | null; canceledAt?: string;
};
export type Booking = FlightBooking | StayBooking;

export const DEMO_USER = {
  id: 'usr_maya', firstName: 'Maya', lastName: 'Okafor', email: 'maya.okafor@example.com', phone: '+1 (555) 010-0142',
  passwordChangedAt: '2026-11-03'
};

/* Saved traveler from copy.md; the date of birth is mock data (copy.md's own example date) */
export const DEMO_TRAVELERS = [
  { id: 'trv_daniel', title: 'Mr', given: 'Daniel', family: 'Okafor', dob: '1988-03-14', gender: 'm' as const, type: 'adult' as const }
];

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function newRef(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  return s;
}
/* "910 2604 118352": the airline's three-digit prefix, then ten digits */
export function newTicket(airline: string): string {
  return `${AIRLINES[airline]?.ticketPrefix ?? '900'} ${2600 + Math.floor(Math.random() * 10)} ${100000 + Math.floor(Math.random() * 900000)}`;
}

/* ---- the demo account's bookings (copy.md, "Bookings in the demo account") ---- */
function demoFlight(ref: string, search: Parameters<typeof generateOffers>[0], pickIndex: (o: ReturnType<typeof generateOffers>) => number, fare: FareId, status: Status, bookedAt: string, tickets: string[], refund: number | null): FlightBooking {
  const offers = generateOffers(search, Date.parse('2026-08-01T09:00:00Z'));
  const o = offers[pickIndex(offers)];
  return {
    kind: 'flight', ref, status, bookedAt, owner: DEMO_USER.id,
    from: search.from, to: search.to, depart: search.depart, ret: search.ret, slices: o.slices, airline: o.owner,
    fare, cabin: search.cabin, pax: o.passengers,
    travelers: [{ name: 'Maya Okafor', type: 'adult', lead: true, ticket: tickets[0] }, { name: 'Daniel Okafor', type: 'adult', ticket: tickets[1] }],
    amounts: offerTotals(o, fare), card: { brand: 'Visa', last4: '4242' }, email: DEMO_USER.email, ticketsAt: 0, refund
  };
}

function demoStay(ref: string, hotel: string, room: string, search: StaySearch, status: Status, bookedAt: string, freeCancelUntil: string | null): StayBooking {
  const h = hotelById(hotel)!, r = h.rooms.find((x) => x.id === room)!;
  const t = stayTotals(r, search);
  return {
    kind: 'stay', ref, status, bookedAt, owner: DEMO_USER.id, hotel, room, search, guests: ['Maya Okafor'],
    amounts: { room: t.room, tax: t.tax, total: t.total }, card: { brand: 'Visa', last4: '4242' }, email: DEMO_USER.email, freeCancelUntil
  };
}

let cache: Booking[] | null = null;
export function demoBookings(): Booking[] {
  if (cache) return cache;
  const lisbon = { from: 'LHR', to: 'LIS', depart: '2026-11-20', ret: '2026-11-27', adults: 2, children: 0, infants: 0, cabin: 'economy' as Cabin };
  const rome = { from: 'LHR', to: 'FCO', depart: '2026-09-12', ret: '2026-09-16', adults: 2, children: 0, infants: 0, cabin: 'economy' as Cabin };
  cache = [
    /* Kittiwake Air KT 412 and KT 413, Classic: $1,284.60; online cancellation refunds $612.00 (copy.md) */
    demoFlight('K7MQ2D', lisbon, () => 0, 'classic', 'confirmed', '2026-11-03', ['910 2604 118352', '910 2604 118353'], 61200),
    demoStay('S4T9LW', 'casa-lanterna', 'courtyard-double', { place: 'lisbon', checkin: '2026-11-20', checkout: '2026-11-24', adults: 2, children: 0, rooms: 1 }, 'confirmed', '2026-11-03', '2026-11-17'),
    /* Tern Atlantic, nonstop both ways where the mock data has one */
    demoFlight('R8DWQ4', rome, (os) => Math.max(0, os.findIndex((o) => o.owner === 'TQ' && o.slices.every((s) => s.stops === 0))), 'light', 'completed', '2026-08-02', ['924 2601 552817', '924 2601 552818'], null),
    { ...demoStay('H2LNC7', 'albergo-tre-finestre', 'classic-double', { place: 'rome', checkin: '2026-09-12', checkout: '2026-09-16', adults: 2, children: 0, rooms: 1 }, 'canceled', '2026-08-02', '2026-09-09'), canceledAt: '2026-08-20' }
  ];
  return cache;
}

/* Online cancellation, as Duffel would quote it: on airlines that allow it, the fare's own refund rule
   (catalogue section 2: "Refund before departure, minus $50 per traveler" or "Full refund before departure") */
export function refundFor(airline: string, fare: FareId, total: number, pax: Pax): number | null {
  if (!AIRLINES[airline]?.online) return null;
  const rule = fareFor(airline, fare).rows?.refunds ?? (fare === 'flex' ? 'minus $50 per traveler' : 'Not refundable');
  if (/not refundable/i.test(rule)) return null;
  const m = /minus \$(\d+) per traveler/i.exec(rule);
  return m ? total - +m[1] * 100 * seats(pax) : total;
}

export const TICKETS_DELAY = 8000; /* new bookings show "The airline is issuing your e-tickets" this long */
export { OFFER_LIFETIME };
