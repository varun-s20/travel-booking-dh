'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): client helpers
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
/* revision 2026-11-11, item 11 (critic, 11 Nov: 1024 got the phone layout): the horizontal search pill and
   its popovers from 900px; the stacked card, the sheet and the tab bar below it. The rail stays at 1025. */
export const MQ_SEARCH = '(min-width: 900px)';
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

/* ---- search requests ---- */
export type SearchMode = 'flights' | 'hotels';
export const SEARCH_EVENT = 'overwing:search';
/* seg opens one cell straight away ("Change dates" on the results and hotel pages) */
export function requestSearch(mode?: SearchMode, seg?: 'from' | 'to' | 'dates' | 'who' | 'place', inPlace = false) {
  window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: { mode, seg, inPlace } }));
}

/* ---- the product in use (revision 2026-11-11, item 7): the rail and the tab bar mark Flights or Hotels as
   current. Results, detail and booking pages follow their path or their booking; on the home page the hero
   search reports the tab it is set to. ---- */
export const PRODUCT_EVENT = 'overwing:product';
/* round 3 (spec A1): the home page asks the hero search to show a tab without moving the page (Back and Forward) */
export const MODE_EVENT = 'overwing:mode';
export function setSearchMode(mode: SearchMode) { window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: { mode } })); }
let product: SearchMode | null = null;
export function setProduct(mode: SearchMode | null) {
  product = mode;
  window.dispatchEvent(new CustomEvent(PRODUCT_EVENT, { detail: { mode } }));
}
export function currentProduct(): SearchMode | null { return product; }

/* ---- toasts (copy.md, Toasts and system messages): components/chrome/Toaster.tsx shows them ---- */
export const TOAST_EVENT = 'overwing:toast';
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message } }));
}

/* ---- range sliders (revision 2026-11-11, item 22): the filled part of the track in teal, the rest in tint.
   The fill share goes to CSS as --fill (ui.css, .a-range) ---- */
export function rangeFill(value: number, min: number, max: number): React.CSSProperties {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 100;
  return { ['--fill' as string]: `${Math.min(100, Math.max(0, pct)).toFixed(1)}%` } as React.CSSProperties;
}
