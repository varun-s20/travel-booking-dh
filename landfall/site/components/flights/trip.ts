/* =====================================================================
   Landfall (working name, a placeholder), group F: trip helpers
   Non-visual helpers shared by results, details, passengers, checkout
   and confirmation: draft keys, per-traveler amounts, the URLs between
   the booking steps, the expiry clock and its hook.
   ===================================================================== */
'use client';
import { useEffect, useState, type RefObject } from 'react';
import { searchQuery, travelers, type FareId, type FlightSearch, type Offer, type Pax } from '@/lib/travel/flights';
import { getDraft, setDraft } from '@/lib/store';

/* the browser keeps the traveler form and any accepted price change under this key */
export const flightDraftKey = (offerId: string) => `flight:${offerId}`;

/* carry a draft over when an expired offer is refreshed (its id changes) */
export function moveDraft(from: string, to: string) {
  const d = getDraft(from);
  if (Object.keys(d).length) setDraft(to, d);
}

export const perTraveler = (total: number, p: Pax) => Math.round(total / Math.max(1, travelers(p)));

export const resultsUrl = (s: FlightSearch) => `/flights?${searchQuery(s)}`;
export const detailsUrl = (id: string, fare: FareId) => `/flights/${id}?fare=${fare}`;
export const passengersUrl = (id: string, fare: FareId) => `/flights/${id}/passengers?fare=${fare}`;
export const checkoutUrl = (id: string, fare: FareId) => `/checkout?kind=flight&offer=${id}&fare=${fare}`;

/* "10:42" in the visitor's local time */
export function clockOf(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* The offer's validity, live: null on the server and the first client render (local time
   differs), then the clock time, whether under 5 minutes are left, and whether it has run out. */
export function useExpiry(expiresAt: number): { at: string; soon: boolean; expired: boolean } | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, []);
  if (now === null) return null;
  const left = expiresAt - now;
  return { at: clockOf(expiresAt), soon: left < 5 * 60 * 1000, expired: left <= 0 };
}

/* true while the element is on screen (the phone price bar steps aside while the summary card it repeats is in view) */
export function useInView(ref: RefObject<HTMLElement | null>): boolean {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: '0px 0px -72px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return v;
}

export type OfferLite = Pick<Offer, 'id' | 'expiresAt'>;
