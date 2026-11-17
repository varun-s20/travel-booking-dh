'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): visitor state
   The simulated backend's database for one browser, kept in
   localStorage (key overwing:v1), so the demo works on any host:
   - the session, accounts registered here, and the demo account
     (Maya Okafor, content/copy.md), seeded on first log in;
   - saved travelers, profile edits, password changes;
   - bookings made here (the order route handlers return them) and
     cancellations, merged with the demo account's four bookings;
   - checkout drafts: travelers and guests between form and payment.
   Log in, demo rules: an account registered here needs its own password;
   any other address with a password of 8 characters or more opens the
   demo account (there are no real accounts to check against); five
   failures in a row lock log in for three minutes.
   Components read it through useStore(), which is null until the page
   has hydrated, so server and first client render always match.
   ===================================================================== */
import { useSyncExternalStore } from 'react';
import { DEMO_TRAVELERS, DEMO_USER, demoBookings, type Booking, type Status } from '@/lib/mock/bookings';

export type User = { id: string; firstName: string; lastName: string; email: string; phone: string; passwordChangedAt: string; homeAirport?: string };
export type SavedTraveler = { id: string; title: string; given: string; family: string; dob: string; gender: 'f' | 'm'; type: 'adult' | 'child' | 'infant' };
type Account = { user: User; password: string | null; travelers: SavedTraveler[] };
export type PassengerDraft = { title: string; given: string; family: string; day: string; month: string; year: string; gender: '' | 'f' | 'm'; passport?: string; country?: string; expDay?: string; expMonth?: string; expYear?: string; save?: boolean };
export type Draft = { passengers?: PassengerDraft[]; guests?: { given: string; family: string }[]; requests?: string; adjust?: number; email?: string; phone?: string;
  /* round 3 (spec B8): the estimated arrival time on the guest form, passed to the hotel with the booking */
  arrival?: string };

type State = {
  v: 1;
  session: string | null;
  accounts: Record<string, Account>;
  bookings: Booking[];
  changes: Record<string, { status?: Status; canceledAt?: string }>;
  drafts: Record<string, Draft>;
  fails: { n: number; until: number };
};

const KEY = 'overwing:v1';
const EMPTY: State = { v: 1, session: null, accounts: {}, bookings: [], changes: {}, drafts: {}, fails: { n: 0, until: 0 } };

let current: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (current) return current;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as State) : null;
    current = parsed && parsed.v === 1 ? { ...EMPTY, ...parsed } : { ...EMPTY };
  } catch { current = { ...EMPTY }; }
  return current;
}

function save(next: State) {
  current = next;
  try {
    /* round 3: lib/history.ts writes `history` into the same object; keep the stored one, never this copy's */
    const stored = JSON.parse(window.localStorage.getItem(KEY) || 'null') as { history?: unknown } | null;
    window.localStorage.setItem(KEY, JSON.stringify(stored?.history ? { ...next, history: stored.history } : next));
  } catch { /* private mode: the session still works in memory */ }
  listeners.forEach((l) => l());
}

function update(fn: (s: State) => State) { save(fn(load())); }

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { current = null; load(); l(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
}

export function useStore(): State | null {
  return useSyncExternalStore(subscribe, load, () => null);
}

/* ===== Session and accounts ===== */
const demoAccount = (): Account => ({ user: { ...DEMO_USER }, password: null, travelers: DEMO_TRAVELERS.map((t) => ({ ...t })) });

export function currentUser(s: State | null): User | null {
  if (!s?.session) return null;
  return s.accounts[s.session]?.user ?? null;
}
export function savedTravelers(s: State | null): SavedTraveler[] {
  if (!s?.session) return [];
  return s.accounts[s.session]?.travelers ?? [];
}
export const initials = (u: User) => `${u.firstName[0] || ''}${u.lastName[0] || ''}`.toUpperCase();

const norm = (e: string) => e.trim().toLowerCase();
function findByEmail(s: State, email: string): Account | undefined {
  return Object.values(s.accounts).find((a) => norm(a.user.email) === norm(email));
}

/* bookings made while logged out join the account that logs in next, in this browser */
function claimGuest(s: State, id: string): Booking[] {
  return s.bookings.map((b) => (b.owner === null ? { ...b, owner: id } : b));
}

export type LoginResult = { ok: true } | { ok: false; error: 'mismatch' | 'too_many' };
export function logIn(email: string, password: string): LoginResult {
  const s = load();
  const now = Date.now();
  if (s.fails.until > now) return { ok: false, error: 'too_many' };
  const local = findByEmail(s, email);
  const good = local && local.password !== null ? local.password === password : password.length >= 8;
  if (!good) {
    const n = s.fails.n + 1;
    const locked = n >= 5;
    save({ ...s, fails: { n: locked ? 0 : n, until: locked ? now + 3 * 60 * 1000 : 0 } });
    return { ok: false, error: locked ? 'too_many' : 'mismatch' };
  }
  const account = local && local.password !== null ? local : s.accounts[DEMO_USER.id] ?? demoAccount();
  const id = account.user.id;
  save({ ...s, session: id, accounts: { ...s.accounts, [id]: account }, bookings: claimGuest(s, id), fails: { n: 0, until: 0 } });
  return { ok: true };
}

export function register(v: { firstName: string; lastName: string; email: string; password: string }): { ok: boolean } {
  const s = load();
  if (norm(v.email) === norm(DEMO_USER.email) || findByEmail(s, v.email)) return { ok: false };
  const id = `usr_${Math.random().toString(36).slice(2, 10)}`;
  const today = new Date().toISOString().slice(0, 10);
  const account: Account = { user: { id, firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim(), phone: '', passwordChangedAt: today }, password: v.password, travelers: [] };
  save({ ...s, session: id, accounts: { ...s.accounts, [id]: account }, bookings: claimGuest(s, id) });
  return { ok: true };
}

export function logOut() { update((s) => ({ ...s, session: null })); }

function updateAccount(fn: (a: Account) => Account) {
  update((s) => {
    if (!s.session || !s.accounts[s.session]) return s;
    return { ...s, accounts: { ...s.accounts, [s.session]: fn(s.accounts[s.session]) } };
  });
}

/* round 3 (spec B11): the home airport the searches start from */
export function saveHomeAirport(code: string) {
  updateAccount((a) => ({ ...a, user: { ...a.user, homeAirport: code } }));
}

export function saveProfile(p: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>) {
  updateAccount((a) => ({ ...a, user: { ...a.user, ...p } }));
}

export function changePassword(currentPw: string, next: string): boolean {
  const s = load();
  const a = s.session ? s.accounts[s.session] : undefined;
  if (!a) return false;
  /* the demo account takes any current password of 8 or more characters until one is set here */
  const okCurrent = a.password !== null ? a.password === currentPw : currentPw.length >= 8;
  if (!okCurrent) return false;
  updateAccount((acc) => ({ ...acc, password: next, user: { ...acc.user, passwordChangedAt: new Date().toISOString().slice(0, 10) } }));
  return true;
}

export function deleteAccount() {
  update((s) => {
    if (!s.session) return s;
    const accounts = { ...s.accounts };
    delete accounts[s.session];
    return { ...s, session: null, accounts };
  });
}

export function saveTraveler(t: SavedTraveler) {
  updateAccount((a) => {
    const i = a.travelers.findIndex((x) => x.id === t.id);
    const travelers = i > -1 ? a.travelers.map((x) => (x.id === t.id ? t : x)) : [...a.travelers, t];
    return { ...a, travelers };
  });
}
export function removeTraveler(id: string) { updateAccount((a) => ({ ...a, travelers: a.travelers.filter((t) => t.id !== id) })); }

/* ===== Bookings ===== */
function withChanges(s: State, b: Booking): Booking {
  const c = s.changes[b.ref];
  return c ? ({ ...b, ...c } as Booking) : b;
}

export function bookingsFor(s: State | null): Booking[] {
  const u = currentUser(s);
  if (!s || !u) return [];
  const mine = s.bookings.filter((b) => b.owner === u.id);
  const demo = u.id === DEMO_USER.id ? demoBookings() : [];
  return [...mine, ...demo].map((b) => withChanges(s, b));
}

/* Any booking this browser knows: its own, or the demo account's (the confirmation page needs no log in) */
export function findBooking(s: State | null, ref: string): Booking | null {
  if (!s) return null;
  const b = s.bookings.find((x) => x.ref === ref) || demoBookings().find((x) => x.ref === ref);
  return b ? withChanges(s, b) : null;
}

export function addBooking(b: Booking) { update((s) => ({ ...s, bookings: [b, ...s.bookings.filter((x) => x.ref !== b.ref)] })); }

export function cancelBooking(ref: string) {
  update((s) => ({ ...s, changes: { ...s.changes, [ref]: { status: 'canceled', canceledAt: new Date().toISOString().slice(0, 10) } } }));
}

/* ===== Checkout drafts ===== */
export function getDraft(key: string): Draft { return load().drafts[key] || {}; }
export function setDraft(key: string, d: Draft) { update((s) => ({ ...s, drafts: { ...s.drafts, [key]: { ...s.drafts[key], ...d } } })); }
export function clearDraft(key: string) {
  update((s) => { const drafts = { ...s.drafts }; delete drafts[key]; return { ...s, drafts }; });
}
