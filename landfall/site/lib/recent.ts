/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): recent trips
   Round 3 (round3-spec.md A5). The visitor's recent searches and views,
   kept in this browser only (localStorage "lf.recent"), never sent to the
   server. At most 12 entries, newest first, each
   { kind, at, params, label, price? }:
   - flight-search: params from, to, depart, return, adults, children, infants, cabin
   - hotel-search:  params place, checkin, checkout, adults, children, rooms
   - flight-view:   params as flight-search, plus offer (Part B, flight details)
   - hotel-view:    params hotel, place, and the stay dates if known (Part B, hotel detail)
   label: what the card shows ("London to Lisbon", "Hotels in Lisbon", "Casa Lanterna").
   price: the lowest price seen, in whole dollars, when the page knows it.
   Every read and write is wrapped, so a blocked or empty store is safe.
   Written by Developer A (search entries and the reader); Part B calls
   addRecent() for the view entries.
   ===================================================================== */
export type RecentKind = 'flight-search' | 'hotel-search' | 'flight-view' | 'hotel-view';
export type Recent = { kind: RecentKind; at: number; params: Record<string, string>; label: string; price?: number };

export const RECENT_KEY = 'lf.recent';
export const RECENT_EVENT = 'landfall:recent';
const MAX = 12;

export function readRecent(): Recent[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as Recent[]) : [];
    return Array.isArray(list) ? list.filter((e) => e && typeof e.kind === 'string' && e.params && typeof e.label === 'string') : [];
  } catch { return []; }
}

function write(list: Recent[]) {
  try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX))); } catch { /* blocked: the row keeps its default */ }
  try { window.dispatchEvent(new Event(RECENT_EVENT)); } catch { /* no window */ }
}

const sameEntry = (a: Recent, b: Omit<Recent, 'at'>) => a.kind === b.kind && JSON.stringify(a.params) === JSON.stringify(b.params);

export function addRecent(e: Omit<Recent, 'at'>) {
  if (typeof window === 'undefined') return;
  const list = readRecent().filter((x) => !sameEntry(x, e));
  const prev = readRecent().find((x) => sameEntry(x, e));
  const price = e.price ?? prev?.price;
  write([{ ...e, price, at: Date.now() }, ...list]);
}

export function clearRecent() {
  try { window.localStorage.removeItem(RECENT_KEY); } catch { /* blocked */ }
  try { window.dispatchEvent(new Event(RECENT_EVENT)); } catch { /* no window */ }
}

export const isFlightKind = (k: RecentKind) => k === 'flight-search' || k === 'flight-view';
