'use client';
/* =====================================================================
   Landfall: checkout drafts in the browser
   Only what a customer types between the traveler or guest form and the
   payment step: names, dates of birth, passport details, contact. Kept in
   sessionStorage (key landfall:drafts:v2), so it is gone when the tab
   closes, and never in localStorage. Accounts, sessions and bookings live
   on the server now (lib/session.ts, /api/bookings).
   Components read it through useStore(), which is null until the page
   has hydrated, so server and first client render always match.
   ===================================================================== */
import { useSyncExternalStore } from 'react';

/* dates of birth and passport expiry as separate fields (the forms have three inputs);
   country: the passport's issuing country as an ISO alpha-2 code ("PT") */
export type PassengerDraft = {
  title: string; given: string; family: string; day: string; month: string; year: string; gender: '' | 'f' | 'm';
  type?: 'adult' | 'child' | 'infant';
  passport?: string; country?: string; expDay?: string; expMonth?: string; expYear?: string;
  /* save this traveler to the signed-in account at checkout */
  save?: boolean;
};
export type Draft = {
  passengers?: PassengerDraft[];
  guests?: { given: string; family: string }[];
  requests?: string;
  email?: string;
  phone?: string;
  /* the total the customer accepted after a price change */
  acceptedTotal?: number;
};

type State = { v: 2; drafts: Record<string, Draft> };

const KEY = 'landfall:drafts:v2';
const EMPTY: State = { v: 2, drafts: {} };

let current: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (current) return current;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as State) : null;
    current = parsed && parsed.v === 2 ? parsed : { ...EMPTY };
  } catch { current = { ...EMPTY }; }
  /* the old demo kept accounts and bookings in localStorage: remove them */
  try { window.localStorage.removeItem('landfall:v1'); } catch { /* storage blocked */ }
  return current;
}

function save(next: State) {
  current = next;
  try { window.sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: drafts still work in memory */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useStore(): State | null {
  return useSyncExternalStore(subscribe, load, () => null);
}

export function getDraft(key: string): Draft { return load().drafts[key] || {}; }
export function setDraft(key: string, d: Draft) { const s = load(); save({ ...s, drafts: { ...s.drafts, [key]: { ...s.drafts[key], ...d } } }); }
export function clearDraft(key: string) {
  const s = load();
  const drafts = { ...s.drafts };
  delete drafts[key];
  save({ ...s, drafts });
}
