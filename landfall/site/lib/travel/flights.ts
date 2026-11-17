/* =====================================================================
   Landfall: the flight view model
   One shape for every flight the site shows, whichever supplier priced
   it (Duffel, or the simulated catalogue when no Duffel token is set).
   An Offer is one itinerary (the same flights there and back) with the
   fares the airline sells on it, cheapest first. Each fare is its own
   supplier offer with its own id and price; the fare tiers keep the URL
   form ?fare=light|classic|flex|top. Prices are in minor units, for the
   whole party, taxes included, and already carry any markup.
   Times are local, in minutes from midnight of the slice's departure day
   (a 01:10 arrival the next day is 1510), as the timeline draws them.
   Isomorphic: no server imports.
   ===================================================================== */
import { CABINS, isCabin, type Cabin } from '@/lib/cabins';
import { addIsoDays, fromIso } from '@/lib/format';
import type { Dict } from '@/lib/travel/registry';

export { AIRLINES, airlineName, airlineOf, airport, cityOf, placeName, registerDict, type Dict } from '@/lib/travel/registry';

/* ===== Search ===== */
export type Pax = { adults: number; children: number; infants: number };
export type FlightSearch = Pax & { from: string; to: string; depart: string; ret: string | null; cabin: Cabin };

export const seats = (p: Pax) => p.adults + p.children;
export const travelers = (p: Pax) => p.adults + p.children + p.infants;

type Params = Record<string, string | string[] | undefined>;
const one = (p: Params, k: string) => { const v = p[k]; return Array.isArray(v) ? v[0] : v; };
function int(v: string | undefined, min: number, max: number, dflt: number): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : dflt;
}
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const IATA = /^[A-Z]{3}$/;
/* Duffel searches up to about 11 months ahead */
export const MAX_DAYS_AHEAD = 330;

/* Returns the full search, or null when there is no route to search.
   `complete` is false when dates or travelers had to be filled in, so the
   page can rewrite its URL (destination cards send only from and to). */
export function parseFlightSearch(p: Params): { search: FlightSearch; complete: boolean } | null {
  const from = (one(p, 'from') || '').toUpperCase(), to = (one(p, 'to') || '').toUpperCase();
  if (!IATA.test(from) || !IATA.test(to) || from === to) return null;
  let depart = one(p, 'depart') || '', ret: string | null = one(p, 'return') || null;
  let complete = true;
  const t = todayIso();
  const last = addIsoDays(t, MAX_DAYS_AHEAD);
  if (!fromIso(depart) || depart < t || depart > last) {
    depart = addIsoDays(t, 14);
    ret = addIsoDays(depart, 7);
    complete = false;
  }
  if (ret && (!fromIso(ret) || ret < depart || ret > last)) { ret = addIsoDays(depart, 7); complete = false; }
  const adults = int(one(p, 'adults'), 1, 9, 1);
  const children = int(one(p, 'children'), 0, 9 - adults, 0);
  /* one infant per adult, and Duffel books at most 9 travelers in one order */
  const infants = int(one(p, 'infants'), 0, Math.min(adults, 9 - adults - children), 0);
  const cabinRaw = one(p, 'cabin');
  const cabin: Cabin = isCabin(cabinRaw) ? cabinRaw : 'economy';
  if (one(p, 'adults') === undefined || !isCabin(cabinRaw)) complete = false;
  return { search: { from, to, depart, ret, adults, children, infants, cabin }, complete };
}

export function searchQuery(s: FlightSearch): string {
  const q = new URLSearchParams({ from: s.from, to: s.to, depart: s.depart });
  if (s.ret) q.set('return', s.ret);
  q.set('adults', String(s.adults)); q.set('children', String(s.children)); q.set('infants', String(s.infants)); q.set('cabin', s.cabin);
  return q.toString();
}
/* the same search always gives the same key (cache and URL comparisons) */
export const searchKey = (s: FlightSearch) => [s.from, s.to, s.depart, s.ret || '-', s.adults, s.children, s.infants, s.cabin].join('.');

/* ===== Itinerary ===== */
export type Segment = {
  flight: string; airline: string; operatedBy?: string; aircraft: string;
  from: string; to: string; fromTerminal: string; toTerminal: string;
  /* minutes from local midnight of the slice's departure day; arr is local at the segment's destination */
  dep: number; dur: number; arr: number;
};
export type Layover = { at: string; dur: number; overnight: boolean; leaveFrom?: string };
export type Slice = { from: string; to: string; date: string; segments: Segment[]; layovers: Layover[]; dep: number; arr: number; dur: number; stops: number };

/* ===== Fares ===== */
export type FareId = 'light' | 'classic' | 'flex' | 'top';
export const FARE_TIERS: FareId[] = ['light', 'classic', 'flex', 'top'];
export const isFare = (v: unknown): v is FareId => v === 'light' || v === 'classic' || v === 'flex' || v === 'top';

export type FareRows = { personal: string; cabin: string; checked: string; seat: string; changes: string; refunds: string };
export type Fare = {
  id: FareId;
  offerId: string;            /* the supplier offer that sells this fare */
  name: string;               /* the airline's fare brand, e.g. "Light" */
  included: string[]; fee: string[]; notIncluded: string[];
  rows?: FareRows;            /* comparison-table cells when the supplier gives them */
  has: { cabin: boolean; checked: boolean; change: boolean; refund: boolean; seat: boolean };
  base: number; tax: number; total: number;   /* minor units, whole party, customer price */
  /* the fare per traveler of each type, when the supplier splits it (simulated catalogue) */
  perType?: { adult?: number; child?: number; infant?: number };
  step?: number;
};

export type Offer = {
  id: string;                 /* the itinerary's id: its cheapest fare's offer id */
  key: string;                /* the flights themselves, to find the itinerary again after a new search */
  supplier: 'duffel' | 'simulated';
  owner: string;              /* the selling airline's code (names: registry) */
  slices: Slice[];
  passengers: Pax; cabin: Cabin;
  searchId: string; searchedAt: number; expiresAt: number;
  passport: boolean;          /* identity documents required to book */
  warnings: string[];
  fares: Fare[];              /* cheapest first, at most four */
  currency: string;
  dict: Dict;                 /* names for every code in this offer */
};

const tierIndex = (o: Offer, id: FareId) => Math.min(Math.max(0, FARE_TIERS.indexOf(id)), o.fares.length - 1);
export const faresFor = (o: Offer): Fare[] => o.fares;
export const fareFor = (o: Offer, id: FareId): Fare => o.fares[tierIndex(o, id)];
/* the fare tier a supplier offer id sells on this itinerary, if any */
export const fareOfOfferId = (o: Offer, offerId: string): Fare | undefined => o.fares.find((f) => f.offerId === offerId);

export type Amounts = { base: number; tax: number; total: number };
/* `adjust` is a confirmed price change for the whole party, in minor units */
export function offerTotals(o: Offer, fare: FareId, adjust = 0): Amounts {
  const f = fareFor(o, fare);
  return { base: f.base + adjust, tax: f.tax, total: f.total + adjust };
}
/* what a fare costs over the cheapest one, for the whole party */
export const fareDifference = (o: Offer, fare: FareId) => fareFor(o, fare).total - o.fares[0].total;
/* the cheapest total of an offer */
export const lowestTotal = (o: Offer) => o.fares[0].total;

/* ===== The price check before booking (a supplier single-offer request) ===== */
export type PriceCheck =
  | { status: 'ok'; total: number }
  | { status: 'up' | 'down'; total: number; delta: number }
  | { status: 'sold_out' }
  | { status: 'expired' };

/* ===== Labels shared by cards, details and bookings ===== */
export function stopsLabel(n: number): string { return n === 0 ? 'Nonstop' : n === 1 ? '1 stop' : `${n} stops`; }
export function cabinShort(c: Cabin): string { return CABINS.find((x) => x.value === c)?.label ?? 'Economy'; }

/* warnings shown on cards, from the itinerary alone */
export function itineraryWarnings(slices: Slice[], cityName: (code: string) => string): string[] {
  const w: string[] = [];
  if (slices[1] && slices[1].to !== slices[0].from) w.push(`Change of airport in ${cityName(slices[0].from)}`);
  const lays = slices.flatMap((sl) => sl.layovers);
  if (lays.some((l) => l.overnight)) w.push('Overnight layover');
  else if (lays.some((l) => l.dur >= 300)) w.push('Long layover');
  return w;
}
