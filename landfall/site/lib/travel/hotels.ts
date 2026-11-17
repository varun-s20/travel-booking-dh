/* =====================================================================
   Landfall: the stay view model
   One shape for every hotel the site shows, from Duffel Stays or the
   simulated catalogue. A dated hotel page carries its rooms with their
   rate plans already priced for the search (total, taxes, the free
   cancellation deadline), so the page, the guest form and checkout read
   prices from the data and never compute them. Undated pages show the
   hotel without prices ("Add dates for prices").
   Rate plan ids are the supplier's rate ids (rat_... on Duffel), carried
   in URLs as ?plan=<id>. Minor units throughout. Isomorphic.
   ===================================================================== */
import { CITIES, type City } from '@/lib/data/places';
import { addIsoDays, fromIso, isoNights } from '@/lib/format';

export type PhotoCat = 'Rooms' | 'Inside' | 'Outside';
/* name: a key in lib/images.manifest.json (the demo's own photos) or an https URL (supplier photos) */
export type HotelPhoto = { name: string; cat: PhotoCat; caption: string };
export type PlanId = string;
export type RatePlan = {
  id: PlanId; name: string;
  nightly: number;            /* per night for all rooms, taxes included (total / nights when priced) */
  refundable: boolean; breakfast: boolean;
  /* set when priced for a search */
  total?: number; tax?: number;
  freeCancelUntil?: string | null;   /* last day (ISO date, hotel time) a full refund is possible */
  board?: string;                    /* "Breakfast included", "Room only" */
  payAtHotel?: { amount: number; currency: string } | null;  /* local taxes paid at the property */
  conditions?: { title: string; body: string }[];            /* the rate's own terms, shown before booking */
  available?: boolean;
};
export type Room = {
  id: string; name: string; spec: string; beds: string; sleeps: number; view?: string;
  nightly: number; refundable: boolean; breakfast: boolean; photos: string[];
  size?: string; amenities?: string[]; plans?: RatePlan[];
};
export type Hotel = {
  id: string; name: string; city: string; area: string; country: string; stars: number;
  lat: number; lon: number; card: string; about: string;
  cardAmenities: string[]; amenities: string[]; photos: HotelPhoto[]; rooms: Room[];
  checkIn: string; checkOut: string; address: string;
  policies: { title: string; body: string }[];
  supplier?: 'duffel' | 'simulated';
  searchResultId?: string;           /* Duffel srr_..., for fetching every rate without searching again */
  keyCollection?: string | null;
  /* optional content (the simulated catalogue has all of it; suppliers fill what they can) */
  type?: string; score?: number; scoreWord?: string; reviews?: number; fromCentre?: number; band?: string;
  showcase?: boolean; highlights?: string[]; aboutMore?: string[]; categories?: Record<string, number>;
  reviewList?: { name: string; country: string; trip: string; month: string; score: number; title: string; text: string }[];
  nearby?: { place: string; minutes: number; mode: string }[];
  rules?: { title: string; body: string }[]; lead?: number; breakfastPrice?: number;
};

/* ===== Search ===== */
export type StaySearch = { place: string; checkin: string; checkout: string; adults: number; children: number; rooms: number };
type Params = Record<string, string | string[] | undefined>;
const one = (q: Params, k: string) => { const v = q[k]; return Array.isArray(v) ? v[0] : v; };
const int = (v: string | undefined, min: number, max: number, d: number) => { const n = parseInt(v ?? '', 10); return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : d; };
function todayIso(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
/* Duffel Stays: check-in at most 330 days ahead, at most 99 nights */
export const MAX_NIGHTS = 99;

export const cityById = (id: string): City | undefined => CITIES.find((c) => c.id === id);

export function parseStaySearch(q: Params, placeOverride?: string): { search: StaySearch; complete: boolean } | null {
  const place = placeOverride || one(q, 'place') || '';
  /* a property type link may come with no place (Browse by property type) */
  const anyPlace = !place && !!one(q, 'type');
  if (!anyPlace && !cityById(place)) return null;
  let checkin = one(q, 'checkin') || '', checkout = one(q, 'checkout') || '';
  let complete = true;
  const t = todayIso();
  if (!fromIso(checkin) || checkin < t || checkin > addIsoDays(t, 330)) { checkin = addIsoDays(t, 14); checkout = addIsoDays(checkin, 4); complete = false; }
  if (!fromIso(checkout) || checkout <= checkin || isoNights(checkin, checkout) > MAX_NIGHTS) { checkout = addIsoDays(checkin, 4); complete = false; }
  const adults = int(one(q, 'adults'), 1, 8, 2);
  const children = int(one(q, 'children'), 0, 6, 0);
  const rooms = int(one(q, 'rooms'), 1, Math.min(4, adults), 1);
  if (one(q, 'adults') === undefined) complete = false;
  return { search: { place, checkin, checkout, adults, children, rooms }, complete };
}

export function stayQuery(s: StaySearch): string {
  return new URLSearchParams({ place: s.place, checkin: s.checkin, checkout: s.checkout, adults: String(s.adults), children: String(s.children), rooms: String(s.rooms) }).toString();
}
export const stayKey = (s: StaySearch) => [s.place, s.checkin, s.checkout, s.adults, s.children, s.rooms].join('.');
export const nightsOf = (s: Pick<StaySearch, 'checkin' | 'checkout'>) => isoNights(s.checkin, s.checkout);
export const guestsPerRoom = (s: StaySearch) => Math.ceil(s.adults / s.rooms) + Math.ceil(s.children / s.rooms);

/* ===== Rooms and rate plans ===== */
export const isPlan = (v: unknown): v is PlanId => typeof v === 'string' && /^[A-Za-z0-9_:-]{1,80}$/.test(v);
export const roomById = (h: Hotel, id: string) => h.rooms.find((r) => r.id === id);
export const roomFits = (r: Room, s: StaySearch) => r.sleeps >= guestsPerRoom(s);

const defaultPlan = (r: Room): RatePlan => ({ id: 'default', name: '', nightly: r.nightly, refundable: r.refundable, breakfast: r.breakfast });
export const plansFor = (r: Room, _s?: unknown): RatePlan[] => (r.plans?.length ? r.plans : [defaultPlan(r)]);
/* a room's plan by id, else its cheapest */
export function planOf(r: Room, id?: PlanId | null, _s?: unknown): RatePlan {
  const list = plansFor(r);
  return (id && list.find((p) => p.id === id)) || [...list].sort((a, b) => a.nightly - b.nightly)[0];
}
/* plans arrive priced for the search; kept for the call sites that ask for a plan "at the search's price" */
export const ratedPlan = (_r: Room, p: RatePlan, _s?: unknown): RatePlan => p;

export function roomAvailable(_h: Hotel, r: Room, s: StaySearch): boolean {
  if (!roomFits(r, s)) return false;
  return plansFor(r).some((p) => p.available !== false);
}

export type StayAmounts = { room: number; tax: number; total: number; nightly: number };
/* the stay's price with one plan. Priced plans give their own figures; an unpriced plan
   (undated pages) multiplies the nightly rate out, with no tax split. */
export function stayTotals(r: Room, s: StaySearch, plan?: PlanId | null): StayAmounts {
  const p = planOf(r, plan);
  if (p.total !== undefined) {
    const tax = p.tax ?? 0;
    return { room: p.total - tax, tax, total: p.total, nightly: p.nightly };
  }
  const total = p.nightly * Math.max(1, nightsOf(s));
  return { room: total, tax: 0, total, nightly: p.nightly };
}

/* the last day of free cancellation: the plan's own deadline when the supplier gave one,
   otherwise three days before check-in (never a day already past) */
export function freeCancelUntil(s: Pick<StaySearch, 'checkin'>, plan?: RatePlan | null, now = new Date()): string {
  if (plan?.freeCancelUntil) return plan.freeCancelUntil;
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const three = addIsoDays(s.checkin, -3), oneDay = addIsoDays(s.checkin, -1);
  return three >= today ? three : oneDay >= today ? oneDay : today;
}

/* the browser keeps the guest form under this key between the form and checkout */
export function stayDraftKey(hotel: string, room: string, s: StaySearch): string {
  return `stay:${hotel}:${room}:${s.checkin}:${s.checkout}:${s.adults}:${s.children}:${s.rooms}`;
}

/* ===== Results ===== */
export type StayCard = {
  hotel: Hotel;
  nightly: number; total: number;          /* the cheapest rate for the search, all rooms */
  freeCancel: boolean | null;              /* null: the supplier doesn't say until rates are fetched */
  breakfast: boolean | null;
  distance: number;                        /* km from the city centre */
};

/* ===== Photos ===== */
/* The lead photo for each card in the order shown: a hotel's own lead unless the card
   before it (or the one before that) shows the same photo, then its next photo. */
export function leadsFor<T extends { photos: { name: string }[]; lead?: number }>(list: T[]): number[] {
  const out: number[] = [];
  list.forEach((h, i) => {
    const order = [h.lead ?? 0, ...h.photos.map((_, k) => k).filter((k) => k !== (h.lead ?? 0))];
    const near = [out[i - 1], out[i - 2]].map((k, j) => (k === undefined ? '' : list[i - 1 - j].photos[k]?.name));
    out.push(order.find((k) => !near.includes(h.photos[k]?.name)) ?? order[0]);
  });
  return out;
}

/* ===== Review words ===== */
export function scoreWord(score: number): string {
  return score >= 9 ? 'Exceptional' : score >= 8.5 ? 'Excellent' : score >= 8 ? 'Very good' : score >= 7 ? 'Good' : 'Fair';
}

/* ===== FAQs and airports, built only from the hotel's own data ===== */
export type HotelFaq = { id: string; q: string; a: string };
export function hotelFaqs(h: Hotel): HotelFaq[] {
  const has = (a: string) => h.amenities.some((x) => x.toLowerCase() === a.toLowerCase());
  const plans = h.rooms.flatMap((r) => r.plans ?? []);
  const rule = (t: string) => h.policies.find((p) => p.title === t)?.body;
  const out: HotelFaq[] = [];
  if (h.checkIn && h.checkOut) out.push({ id: 'check-in', q: 'What time are check-in and check-out?', a: `Check-in is from ${h.checkIn} and check-out is until ${h.checkOut}.` });
  const bfastPlans = plans.some((p) => p.breakfast), roomOnly = plans.some((p) => !p.breakfast);
  if (has('Breakfast available') || bfastPlans) out.push({ id: 'breakfast', q: 'Is breakfast included?', a: plans.length && !roomOnly ? 'Yes, every rate at this hotel includes breakfast.' : 'On rates that say "breakfast included". Each room lists what its rate includes.' });
  else if (plans.length) out.push({ id: 'breakfast', q: 'Is breakfast included?', a: has('Kitchen') ? 'No. Rooms here have a kitchen instead.' : 'No rate here includes breakfast.' });
  if (plans.length) {
    const free = plans.some((p) => p.refundable), nonref = plans.some((p) => !p.refundable);
    out.push({ id: 'cancel', q: 'Can I cancel for free?', a: free && nonref ? 'On rates marked "Free cancellation", until the date each rate shows. Non-refundable rates cost less but can’t be refunded.' : free ? 'Yes. Every rate here has free cancellation until the date it shows.' : 'No. Every rate here is non-refundable from the moment you book.' });
  }
  if (has('Free wifi') || has('Wifi')) out.push({ id: 'wifi', q: 'Is there wifi?', a: 'Yes, the hotel lists wifi among its amenities.' });
  if (has('Free parking')) out.push({ id: 'parking', q: 'Is there parking?', a: 'Yes, parking is free on site.' });
  else if (has('Parking on site (paid)') || has('Parking')) out.push({ id: 'parking', q: 'Is there parking?', a: 'Yes, there is parking on site. Ask the hotel about charges.' });
  const pets = rule('Pets');
  if (pets) out.push({ id: 'pets', q: 'Are pets allowed?', a: pets });
  const pool = h.amenities.filter((a) => /pool/i.test(a));
  if (pool.length) out.push({ id: 'pool', q: 'Does the hotel have a pool?', a: `Yes: ${pool.map((x) => x.toLowerCase()).join(' and ')}.` });
  return out.slice(0, 6);
}
export function hotelAirports(h: Hotel): { place: string; minutes: number; mode: string }[] {
  return (h.nearby ?? []).filter((n) => /airport/i.test(n.place));
}
