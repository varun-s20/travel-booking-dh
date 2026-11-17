/* =====================================================================
   Landfall (working name, a placeholder): the home mode switch
   Round 3, Part A0. Flights is "/", Hotels is "/?mode=hotels". The page
   renders on the server from searchParams, so a shared Hotels link paints
   Hotels on the first frame: HomeMode primes the shared search store with
   the mode before the first client render and gives the server snapshot
   the same mode (ServerTab), so nothing flashes.
   The mode is the search store's tab, so the hero tabs, the header links
   and every section stay in step. A change pushes a history entry (Back
   returns to the other mode); popstate switches back without a reload or
   a scroll. A polite live region says "Showing hotels" or "Showing flights".
   ModeSwap: both modes' content is rendered; the inactive one is hidden
   (out of the accessibility tree). In view, the old content fades out
   (--d-mode-out, --ease-in, 6px up), the new rises --rise-mode and fades
   in (--d-mode-in, --ease-reveal), cards staggered by --d-mode-stagger (6
   at most), and the box eases between the two heights over --d-panel.
   Out of view, or with reduced motion, it swaps at once.
   ===================================================================== */
'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/client';
import { primeTab, ServerTab, setSearch, useSearch, type Tab } from '@/components/search/store';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useMode(): Tab { return useSearch().tab; }

function urlMode(): Tab { return new URLSearchParams(location.search).get('mode') === 'hotels' ? 'hotels' : 'flights'; }
function urlFor(mode: Tab): string {
  const q = new URLSearchParams(location.search);
  if (mode === 'hotels') q.set('mode', 'hotels'); else q.delete('mode');
  const s = q.toString();
  return `${location.pathname}${s ? `?${s}` : ''}${location.hash}`;
}

export function HomeMode({ initial, children }: { initial: Tab; children: ReactNode }) {
  /* before the first client render: the store follows the URL's mode */
  const primed = useRef(false);
  if (!primed.current && typeof window !== 'undefined') { primeTab(initial); primed.current = true; }
  const mode = useMode();
  const [said, setSaid] = useState('');
  const first = useRef(true);

  /* other subscribers (the header) hear the primed mode */
  useIso(() => { setSearch({ tab: initial }); }, [initial]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (urlMode() !== mode) history.pushState({ lfMode: mode }, '', urlFor(mode));
    setSaid(mode === 'hotels' ? 'Showing hotels' : 'Showing flights');
  }, [mode]);

  useEffect(() => {
    /* Next's router also answers popstate (and may restore or move the scroll); the switch keeps the
       visitor where they are, so hold the scroll for a moment while both settle */
    const onPop = () => {
      const m = urlMode();
      if (m === getTab()) return;
      const y = window.scrollY;
      setSearch({ tab: m });
      let n = 0;
      const keep = () => { if (Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); if (++n < 45) requestAnimationFrame(keep); };
      requestAnimationFrame(keep);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <ServerTab.Provider value={initial}>
      <div className="t-home" data-mode={mode}>
        {children}
        <p className="sr-only" role="status" aria-live="polite">{said}</p>
      </div>
    </ServerTab.Provider>
  );
}
function getTab(): Tab { return (document.querySelector('.t-home') as HTMLElement | null)?.dataset.mode === 'hotels' ? 'hotels' : 'flights'; }

/* ---------- ModeSwap ---------- */
type SwapProps = { flights: ReactNode; hotels: ReactNode; className?: string; as?: 'div' | 'span' };

export function ModeSwap({ flights, hotels, className }: SwapProps) {
  const mode = useMode();
  const [shown, setShown] = useState<Tab>(mode);
  const [phase, setPhase] = useState<'' | 'out' | 'in'>('');
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (mode === shown) return;
    const el = box.current;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const r = el?.getBoundingClientRect();
    const inView = !!r && r.bottom > 0 && r.top < window.innerHeight;
    if (!el || !inView || prefersReducedMotion()) { setShown(mode); setPhase(''); return; }
    const h0 = el.offsetHeight;
    el.style.height = `${h0}px`;
    setPhase('out');
    timers.current.push(window.setTimeout(() => {
      setShown(mode);
      setPhase('in');
      /* timers, not animation frames, so a throttled tab never leaves the box at a fixed height */
      timers.current.push(window.setTimeout(() => {
        const inner = el.querySelector<HTMLElement>(':scope > .m-swap__pane:not([hidden])');
        const h1 = inner ? inner.offsetHeight : h0;
        el.style.height = `${h1}px`;
        timers.current.push(window.setTimeout(() => { el.style.height = ''; }, 220));
        timers.current.push(window.setTimeout(() => setPhase(''), 640));
      }, 32));
    }, 160));
  }, [mode, shown]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  return (
    <div ref={box} className={['m-swap', phase ? `is-${phase}` : '', className || ''].filter(Boolean).join(' ')}>
      <div className="m-swap__pane" hidden={shown !== 'flights'}>{flights}</div>
      <div className="m-swap__pane" hidden={shown !== 'hotels'}>{hotels}</div>
    </div>
  );
}
