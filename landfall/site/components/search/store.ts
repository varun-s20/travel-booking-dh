/* =====================================================================
   Landfall (working name, a placeholder): search state
   One small store shared by the hero search card, the pinned compact bar,
   the destination cards and the arrival caption, so they never drift
   apart (no React tree in common needed). Inner pages seed it from the
   URL with seedFlights() or seedStays(). Text formats follow
   landfall/content/copy.md (Search card, Pinned compact search).
   ===================================================================== */
'use client';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { AIRPORTS, placeById, type Airport, type City } from '@/lib/data/places';
import { CABINS, type Cabin } from '@/lib/cabins';
import { iso, longLabel, short, today } from '@/lib/dates';
import { fromIso } from '@/lib/format';
import { searchQuery, type FlightSearch } from '@/lib/travel/flights';
import { airport as registryAirport } from '@/lib/travel/registry';
import { childAges, stayQuery, type StaySearch } from '@/lib/travel/hotels';

export type Tab = 'flights' | 'hotels';
export type FieldName = 'from' | 'to' | 'dates' | 'party' | 'dest' | 'rooms';

export type SearchState = {
  tab: Tab;
  from: Airport | null; to: Airport | null; dest: City | null;
  start: Date | null; end: Date | null;
  adults: number; children: number; infants: number; cabin: Cabin;
  /* kidAges: one entry per child, null until chosen (hotels price children by age) */
  guests: number; kids: number; kidAges: (number | null)[]; rooms: number;
};

const LHR = AIRPORTS.find((a) => a.code === 'LHR') || null;
const initial = (): SearchState => ({
  tab: 'flights', from: LHR, to: null, dest: null, start: null, end: null,
  adults: 1, children: 0, infants: 0, cabin: 'economy', guests: 2, kids: 0, kidAges: [], rooms: 1
});

let state: SearchState = initial();
const listeners = new Set<() => void>();
const serverState = initial();

export function getSearch(): SearchState { return state; }
export function setSearch(patch: Partial<SearchState> | ((s: SearchState) => Partial<SearchState>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }
/* Round 3, Developer A: the home page renders /?mode=hotels on the server, so the server snapshot (and the
   hydration snapshot) follow the mode the page passes in through ServerTab; primeTab() sets the client
   store to that mode before the first client render, without notifying, so nothing flashes. */
const serverHotels: SearchState = { ...initial(), tab: 'hotels' };
export const ServerTab = createContext<Tab | null>(null);
export function primeTab(tab: Tab) { if (state.tab !== tab) state = { ...state, tab }; }
export function useSearch(): SearchState {
  const hint = useContext(ServerTab);
  return useSyncExternalStore(subscribe, getSearch, () => (hint === 'hotels' ? serverHotels : serverState));
}

/* any airport code: the built-in list first, then the names a supplier sent (registry), then the code alone,
   so a results page for an airport outside the list still fills its search fields */
export function airportByCode(code: string): Airport | null {
  if (!code) return null;
  const known = AIRPORTS.find((a) => a.code === code);
  if (known) return known;
  const p = registryAirport(code);
  return p ? { code, name: p.name, city: p.city, country: p.country ?? '' } : { code, name: code, city: code, country: '' };
}
/* a curated city, or a destination id from the place suggestions */
export const cityById = (id: string) => placeById(id) || null;

/* ---- seeding from a results or detail page URL ---- */
export function flightsState(s: FlightSearch): SearchState {
  return { ...state, tab: 'flights', from: airportByCode(s.from), to: airportByCode(s.to), start: fromIso(s.depart), end: s.ret ? fromIso(s.ret) : null, adults: s.adults, children: s.children, infants: s.infants, cabin: s.cabin };
}
export function staysState(s: StaySearch): SearchState {
  return { ...state, tab: 'hotels', dest: cityById(s.place), start: fromIso(s.checkin), end: fromIso(s.checkout), guests: s.adults, kids: s.children, kidAges: childAges(s), rooms: s.rooms };
}
export function seedFlights(s: FlightSearch) { setSearch(flightsState(s)); }
export function seedStays(s: StaySearch) { setSearch(staysState(s)); }

/* ---- text (copy.md: Search card, flights and hotels; Pinned compact search) ---- */
const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
export const cabinShort = (c: Cabin) => CABINS.find((x) => x.value === c)?.short ?? 'Economy';
export const cabinLong = (c: Cabin) => CABINS.find((x) => x.value === c)?.label ?? 'Economy';

/* "Nov 20 to Nov 27" (both months always, copy.md swap 4); one way "Nov 20, one way" */
export function datesText(s: SearchState): string {
  if (!s.start) return '';
  if (s.tab === 'flights' && !s.end) return `${short(s.start)}, one way`;
  if (!s.end) return short(s.start);
  return `${short(s.start)} to ${short(s.end)}`;
}
/* "1 adult, Economy"; "2 adults, 1 child, Business"; "3 travelers, Premium" with infants */
export function whoText(s: SearchState): string {
  const total = s.adults + s.children + s.infants;
  if (s.infants) return n(total, 'traveler', 'travelers');
  return [n(s.adults, 'adult', 'adults'), s.children ? n(s.children, 'child', 'children') : ''].filter(Boolean).join(', ');
}
export const partyText = (s: SearchState) => `${whoText(s)}, ${cabinShort(s.cabin)}`;
/* "2 adults, 1 room"; "2 adults, 1 child, 1 room" */
export function roomsText(s: SearchState): string {
  return [n(s.guests, 'adult', 'adults'), s.kids ? n(s.kids, 'child', 'children') : '', n(s.rooms, 'room', 'rooms')].filter(Boolean).join(', ');
}
export const placeValue = (a: Airport | null) => (a ? `${a.city} (${a.code})` : '');

export function routeText(s: SearchState): string {
  if (s.tab === 'hotels') return s.dest ? `Hotels in ${s.dest.name}` : 'Which city?';
  if (!s.to) return 'Where to?';
  return `${s.from ? s.from.city : 'Anywhere'} to ${s.to.city}`;
}
export const compactDates = (s: SearchState) => datesText(s) || 'Add dates';
export const compactParty = (s: SearchState) => (s.tab === 'flights' ? partyText(s) : roomsText(s));
export function compactLine(s: SearchState): string {
  const who = s.tab === 'flights' ? whoText(s) : n(s.guests, 'adult', 'adults');
  return `${compactDates(s)}, ${who}`;
}
function longDates(s: SearchState): string {
  if (!s.start) return 'no dates yet';
  return s.end ? `${longLabel(s.start).replace(/, \d{4}$/, '')} to ${longLabel(s.end).replace(/, \d{4}$/, '')}` : `${longLabel(s.start).replace(/, \d{4}$/, '')}, one way`;
}
export const datesSpoken = longDates;
export function compactSpoken(s: SearchState): string {
  return `Change search: ${s.tab}, ${routeText(s)}, ${longDates(s)}, ${s.tab === 'flights' ? `${whoText(s)}, ${cabinLong(s.cabin)}` : roomsText(s)}`;
}

/* ---- validation and submit (copy.md: Validation; Status line on submit) ---- */
export function missing(s: SearchState): { field: FieldName; message: string } | null {
  if (s.tab === 'flights') {
    if (!s.from) return { field: 'from', message: 'Choose the city or airport you are flying from.' };
    if (!s.to) return { field: 'to', message: 'Choose where you are flying to.' };
    if (s.from.city === s.to.city) return { field: 'to', message: 'Choose a destination different from where you start.' };
    if (!s.start) return { field: 'dates', message: 'Choose your travel dates.' };
    return null;
  }
  if (!s.dest) return { field: 'dest', message: 'Choose the city you want to stay in.' };
  if (!s.start || !s.end) return { field: 'dates', message: 'Choose your check-in and check-out dates.' };
  if (kidAgesOf(s).some((a) => a === null)) return { field: 'rooms', message: "Choose each child's age. Hotels price children by age." };
  return null;
}
export function submitStatus(s: SearchState): string {
  if (s.tab === 'hotels') return `Searching hotels in ${s.dest?.name}, ${datesText(s)}`;
  return s.end
    ? `Searching return flights from ${s.from?.city} to ${s.to?.city}, ${datesText(s)}`
    : `Searching one-way flights from ${s.from?.city} to ${s.to?.city}, ${short(s.start as Date)}`;
}
export function resultsHref(s: SearchState): string {
  if (s.tab === 'hotels') {
    return `/hotels?${stayQuery({ place: s.dest!.id, checkin: iso(s.start), checkout: iso(s.end), adults: s.guests, children: s.kids, ages: kidAgesOf(s).map((a) => a ?? 0), rooms: s.rooms })}`;
  }
  return `/flights?${searchQuery({ from: s.from!.code, to: s.to!.code, depart: iso(s.start), ret: s.end ? iso(s.end) : null, adults: s.adults, children: s.children, infants: s.infants, cabin: s.cabin })}`;
}

/* ---- steppers: Duffel's limits (9 travelers, one infant per adult); stays as the prototype (copy.md note 10) ---- */
export type StepKey = 'adults' | 'children' | 'infants' | 'guests' | 'kids' | 'rooms';
export function allowed(s: SearchState, k: StepKey, v: number): boolean {
  if (k === 'adults') return v >= 1 && v + s.children + s.infants <= 9 && v >= s.infants;
  if (k === 'children') return v >= 0 && s.adults + v + s.infants <= 9;
  if (k === 'infants') return v >= 0 && v <= s.adults && s.adults + s.children + v <= 9;
  if (k === 'rooms') return v >= 1 && v <= 8 && v <= s.guests;
  if (k === 'guests') return v >= 1 && v >= s.rooms && v + s.kids <= 16;
  if (k === 'kids') return v >= 0 && s.guests + v <= 16;
  return false;
}

/* the ages list, exactly as long as the children count (a stepper change may have left it longer or shorter) */
export const kidAgesOf = (s: SearchState): (number | null)[] => Array.from({ length: s.kids }, (_, i) => s.kidAges[i] ?? null);

export const TODAY = () => today();
