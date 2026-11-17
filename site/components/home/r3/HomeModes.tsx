'use client';
/* =====================================================================
   Round 3 home (Developer A, spec A1): the Flights / Hotels switch
   changes the home page in place, with the mode in the URL.
   - The hero tabs, the rail and the tab bar all set it: the hero search
     reports its tab (PRODUCT_EVENT); a change pushes /?mode=hotels.
   - Back and Forward (popstate) swap to the stored mode with no new entry
     and set the hero tab quietly (setSearchMode).
   - The server renders the mode from ?mode=, so a link or a reload shows
     the right page first. Old /#hotels and /#search-hotels links are read
     as the mode and replaced with ?mode=hotels.
   - The blinds: sections near the viewport drop a blind over each photo
     and fade their text (220ms, staggered), swap while closed, then lift
     (420ms). Sections out of view swap with no motion. Reduced motion:
     the content swaps at once. Clicks during a swap queue the last mode.
   ===================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCT_EVENT, prefersReducedMotion, setSearchMode, type SearchMode } from '@/lib/client';
import { useHistory } from '@/lib/history';
import type { HomeData } from '@/lib/mock/home';
import { TrustPanel } from '@/components/home/TrustPanel';
import { PreFooterBand } from '@/components/home/PreFooterBand';
import { CityGrid, DealBanner, DealCards, Faqs, HowItWorks, Recommended, RecentSearches, Browse, Timing, Trending } from './Sections';
import { Icon } from '@/components/Icon';

const TITLE = { flights: 'Overwing | Book flights', hotels: 'Overwing | Book hotels' };
const STATUS = { flights: 'Showing flight deals and routes', hotels: 'Showing hotel deals and stays' };
const CLOSE = 220 + 150, OPEN = 420 + 150;

export function HomeModes({ data, initialMode }: { data: HomeData; initialMode: SearchMode }) {
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [phase, setPhase] = useState<'idle' | 'closing' | 'opening'>('idle');
  const [status, setStatus] = useState('');
  const history = useHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  const shown = useRef<SearchMode>(initialMode);
  const busy = useRef(false);
  const queued = useRef<SearchMode | null>(null);

  /* the entry cards follow the mode (CSS order on .t-home[data-mode]) and the hero lead swaps */
  const mark = (m: SearchMode) => {
    const home = rootRef.current?.closest('.t-home') as HTMLElement | null;
    if (home) home.dataset.mode = m;
    document.title = TITLE[m];
    /* Next.js restores the stored head on Back and Forward after popstate; set the title again once it has */
    window.setTimeout(() => { if (shown.current === m) document.title = TITLE[m]; }, 120);
  };

  const swap = useCallback((target: SearchMode) => {
    if (busy.current) { queued.current = target; return; }
    if (target === shown.current) return;
    const root = rootRef.current;
    const near = root ? Array.from(root.querySelectorAll<HTMLElement>('.r3-swap[data-near]')) : [];
    const finish = () => {
      shown.current = target;
      setMode(target);
      mark(target);
      setStatus(STATUS[target]);
    };
    if (prefersReducedMotion() || !near.length) { finish(); return; }
    busy.current = true;
    /* hold each slot's height so the page does not jump while the visitor reads */
    root?.querySelectorAll<HTMLElement>('.r3-swap').forEach((s) => { s.style.minHeight = `${s.offsetHeight}px`; });
    setPhase('closing');
    window.setTimeout(() => {
      finish();
      setPhase('opening');
      window.setTimeout(() => {
        setPhase('idle');
        root?.querySelectorAll<HTMLElement>('.r3-swap').forEach((s) => { s.style.minHeight = ''; });
        busy.current = false;
        const next = queued.current;
        queued.current = null;
        if (next && next !== shown.current) swap(next);
      }, OPEN);
    }, CLOSE);
  }, []);

  /* which sections are near the viewport (rootMargin 200px); only those animate */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) (e.target as HTMLElement).dataset.near = '';
      else delete (e.target as HTMLElement).dataset.near;
    }), { rootMargin: '200px 0px' });
    const watch = () => root.querySelectorAll('.r3-swap').forEach((s) => io.observe(s));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  /* the hero search reports its tab: a change by the visitor pushes the URL */
  useEffect(() => {
    const on = (e: Event) => {
      const m = (e as CustomEvent<{ mode: SearchMode | null }>).detail.mode;
      if (!m) return;
      const urlMode = new URLSearchParams(window.location.search).get('mode') === 'hotels' ? 'hotels' : 'flights';
      if (m !== urlMode) history_push(m);
      swap(m);
    };
    window.addEventListener(PRODUCT_EVENT, on);
    return () => window.removeEventListener(PRODUCT_EVENT, on);
  }, [swap]);

  /* Back and Forward */
  useEffect(() => {
    const on = () => {
      const m = new URLSearchParams(window.location.search).get('mode') === 'hotels' ? 'hotels' : 'flights';
      setSearchMode(m);
      swap(m);
    };
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, [swap]);

  /* old hash links, and a new ?mode= arriving through client navigation (footer links on the home page).
     The hash is read during the first render: the hero search strips #search-hotels in its own effect, which runs first */
  const [arrivalHash] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash));
  useEffect(() => {
    const h = arrivalHash;
    if (h === '#hotels' || h === '#search-hotels') {
      window.history.replaceState({ mode: 'hotels' }, '', '/?mode=hotels');
      setSearchMode('hotels');
      swap('hotels');
    } else if (h === '#flights') {
      window.history.replaceState({ mode: 'flights' }, '', '/?mode=flights');
    }
  }, [swap, arrivalHash]);
  /* Next.js re-applies the route's stored <title> after history changes it did not make; keep the mode's title */
  useEffect(() => {
    const fix = () => {
      /* only while the home page is on screen: never over the next page's title during a client navigation */
      if (!rootRef.current?.isConnected || window.location.pathname !== '/') return;
      const want = TITLE[shown.current];
      if (document.title !== want) document.title = want;
    };
    const mo = new MutationObserver(fix);
    mo.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);
  useEffect(() => {
    if (initialMode === shown.current) return;
    setSearchMode(initialMode);
    shown.current = initialMode;
    setMode(initialMode);
    mark(initialMode);
    /* the hash target exists only once the new mode renders */
    const hash = window.location.hash;
    if (hash.length > 1) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
  }, [initialMode]);
  useEffect(() => { mark(shown.current); }, []);

  const p = { data, mode };
  return (
    <div className="r3-home" ref={rootRef} data-phase={phase}>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <ModeDock mode={mode} />
      <RecentSearches {...p} history={history} key={`recent-${mode}`} />
      <Recommended {...p} history={history} key={`rec-${mode}`} />
      <DealBanner {...p} key={`banner-${mode}`} />
      <DealCards {...p} key={`deals-${mode}`} />
      <Trending {...p} key={`trend-${mode}`} />
      <Browse {...p} key={`browse-${mode}`} />
      <Timing {...p} history={history} key={`time-${mode}`} />
      <HowItWorks mode={mode} key={`how-${mode}`} />
      <TrustPanel />
      <Faqs mode={mode} key={`faq-${mode}`} />
      <CityGrid {...p} key={`city-${mode}`} />
      <PreFooterBand mode={mode} />
    </div>
  );
}

function history_push(m: SearchMode) {
  window.history.pushState({ mode: m }, '', `/?mode=${m}`);
}

/* Critic, round 3 second pass: below the hero the mode was shown only by the rail. From 1025 a small Flights / Hotels
   switch docks in the empty centre of the top bar once the hero search is out of view. It sends the same event as
   the rail, so the swap, the URL, the title and Back behave the same. */
function ModeDock({ mode }: { mode: SearchMode }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.o-homeHero');
    if (!hero || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting && e.boundingClientRect.bottom < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`o-modeDock${on ? ' is-on' : ''}`} role="group" aria-label="Show flights or hotels" aria-hidden={on ? undefined : true}>
      {(['flights', 'hotels'] as const).map((m) => (
        <button key={m} type="button" className="o-modeDock__btn" aria-pressed={mode === m} tabIndex={on ? 0 : -1} onClick={() => { if (mode !== m) setSearchMode(m); }}>
          <Icon name={m === 'flights' ? 'plane' : 'bed'} />{m === 'flights' ? 'Flights' : 'Hotels'}
        </button>
      ))}
    </div>
  );
}
