'use client';
/* =====================================================================
   Landfall: who is signed in, in the browser
   The session lives in Supabase's auth cookies; the browser never reads
   them. useSession() asks /api/auth/session once per page load and
   shares the answer with every component (header, footer, checkout,
   account pages). After signing in, out or editing the profile, call
   refreshSession() so everything updates together.
   status 'loading' renders like signed out, so server and first client
   render always match.
   ===================================================================== */
import { useSyncExternalStore } from 'react';
import { api } from '@/lib/api';

export type AccountUser = { id: string; email: string; firstName: string; lastName: string; phone: string; role: 'customer' | 'admin' | string; emailPending?: string | null };
export type Session = { status: 'loading' | 'ready'; user: AccountUser | null };

const LOADING: Session = { status: 'loading', user: null };
let current: Session = LOADING;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: Session) { current = next; listeners.forEach((l) => l()); }

export function refreshSession(): Promise<void> {
  if (inflight) return inflight;
  inflight = api<{ user: AccountUser | null }>('/api/auth/session').then((r) => {
    set({ status: 'ready', user: r.data?.user ?? null });
  }).finally(() => { inflight = null; });
  return inflight;
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (current.status === 'loading' && !inflight) void refreshSession();
  return () => { listeners.delete(l); };
}

export function useSession(): Session {
  return useSyncExternalStore(subscribe, () => current, () => LOADING);
}

export async function signOut(): Promise<void> {
  await api('/api/auth/sign-out', { method: 'POST' });
  set({ status: 'ready', user: null });
}

export const initials = (u: Pick<AccountUser, 'firstName' | 'lastName' | 'email'>) =>
  `${u.firstName[0] || ''}${u.lastName[0] || ''}`.toUpperCase() || (u.email[0] || '?').toUpperCase();
