'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): visitor history
   Round 3 spec 0.6: the visitor's recent searches and views, kept in this
   browser only, under the `overwing:v1` object, key `history`, newest
   first, 8 of each at most, de-duplicated by route or place. They feed
   the home page's "Pick up where you left off" and "Recommended for you".
   lib/store.ts keeps its own copy of `overwing:v1` in memory and writes
   the whole object back, so history is read and written straight from
   storage and every write keeps the keys the store owns, and the store
   never drops ours: on save it spreads the parsed object (store.ts load).
   ===================================================================== */
import { useSyncExternalStore } from 'react';

export type SearchEntry = {
  mode: 'flights' | 'hotels';
  from?: string; to?: string; place?: string;
  depart?: string; return?: string | null; checkin?: string; checkout?: string;
  adults: number; children: number; infants?: number; rooms?: number; cabin?: string;
  at: number;
};
export type ViewEntry = { kind: 'hotel' | 'route' | 'city'; id: string; at: number };
export type History = { searches: SearchEntry[]; views: ViewEntry[] };

const KEY = 'overwing:v1';
const EVENT = 'overwing:history';
const EMPTY: History = { searches: [], views: [] };
const MAX = 8;

function readAll(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : { v: 1 };
  } catch { return { v: 1 }; }
}

let cache: { raw: string | null; value: History } | null = null;
export function readHistory(): History {
  if (typeof window === 'undefined') return EMPTY;
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { /* private mode */ }
  if (cache && cache.raw === raw) return cache.value;
  const h = (readAll().history as History | undefined) ?? EMPTY;
  const value: History = { searches: Array.isArray(h.searches) ? h.searches : [], views: Array.isArray(h.views) ? h.views : [] };
  cache = { raw, value };
  return value;
}

function write(next: History) {
  try {
    const all = readAll();
    all.history = next;
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch { /* private mode: nothing is remembered */ }
  window.dispatchEvent(new CustomEvent(EVENT));
}

const searchKey = (s: SearchEntry) => (s.mode === 'flights' ? `f:${s.from}-${s.to}` : `h:${s.place}`);

export function recordSearch(entry: Omit<SearchEntry, 'at'>) {
  const s: SearchEntry = { ...entry, at: Date.now() };
  const h = readHistory();
  write({ ...h, searches: [s, ...h.searches.filter((x) => searchKey(x) !== searchKey(s))].slice(0, MAX) });
}

export function recordView(v: Omit<ViewEntry, 'at'>) {
  const h = readHistory();
  write({ ...h, views: [{ ...v, at: Date.now() }, ...h.views.filter((x) => !(x.kind === v.kind && x.id === v.id))].slice(0, MAX) });
}

export function clearHistory() { write({ searches: [], views: [] }); }

function subscribe(l: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) l(); };
  window.addEventListener(EVENT, l);
  window.addEventListener('storage', onStorage);
  return () => { window.removeEventListener(EVENT, l); window.removeEventListener('storage', onStorage); };
}

/* null on the server and in the first client render, so the page hydrates with the first-visit rows */
export function useHistory(): History | null {
  return useSyncExternalStore(subscribe, readHistory, () => null);
}
