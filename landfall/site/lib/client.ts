'use client';
/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): client helpers
   Small hooks and helpers shared by the interactive components:
   - media flags read once and kept live (desktop, reduced motion);
   - the dialog pattern from conventions.md: page inert while a dialog
     is open, focus inside, Tab kept inside, focus back to the opener;
   - one scroll listener batched in requestAnimationFrame;
   - the search request bus: entry cards and the pre-footer ask the
     hero search to open on a tab (no shared React tree needed).
   ===================================================================== */
import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export const MQ_DESKTOP = '(min-width: 1025px)';
export const MQ_REDUCE = '(prefers-reduced-motion: reduce)';

export function useMedia(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = () => setMatches(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MQ_REDUCE).matches;
}

/* ---- dialogs ---- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function visibleFocusables(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
}

/* The app wrapper (data-app in app/layout.tsx) goes inert while a dialog
   rendered into <body> is open, so nothing behind it can be reached. */
export function setAppInert(on: boolean) {
  const app = document.querySelector('[data-app]');
  if (!app) return;
  if (on) app.setAttribute('inert', '');
  else app.removeAttribute('inert');
}

/* Tab stays inside the dialog: put this on the dialog's onKeyDown */
export function trapTab(e: ReactKeyboardEvent<HTMLElement>) {
  if (e.key !== 'Tab') return;
  const f = visibleFocusables(e.currentTarget);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---- scroll: one passive listener, batched in a frame ---- */
type ScrollJob = (y: number) => void;
const jobs = new Set<ScrollJob>();
let ticking = false;
let listening = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = window.scrollY;
    jobs.forEach((job) => job(y));
  });
}
export function addScrollJob(job: ScrollJob): () => void {
  jobs.add(job);
  if (!listening) { window.addEventListener('scroll', onScroll, { passive: true }); listening = true; }
  job(window.scrollY);
  return () => { jobs.delete(job); };
}

/* ---- search requests ----
   Landfall (build, 2026-11-11): segments renamed to the search card's own
   fields (plumbing.md item 1). The one card that listens (the hero card on
   home, the compact bar's card on inner pages) switches to `mode`, comes
   into view, opens `seg` and shows `message` in its status line.
   'go' focuses the Search button; 'focus-from' focuses From (pre-footer). */
export type SearchMode = 'flights' | 'hotels';
export type SearchSeg = 'from' | 'to' | 'dates' | 'party' | 'dest' | 'rooms' | 'go' | 'focus-from';
export const SEARCH_EVENT = 'landfall:search';
export function requestSearch(mode?: SearchMode, seg?: SearchSeg, message?: string) {
  window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: { mode, seg, message } }));
}

/* ---- toasts (landfall/content/copy.md, Toasts and system messages): components/chrome/Toaster.tsx shows them ---- */
export const TOAST_EVENT = 'landfall:toast';
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message } }));
}
