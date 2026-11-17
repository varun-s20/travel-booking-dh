/* =====================================================================
   Landfall (working name, a placeholder): home hero
   See the place first (spec 1): three cities where they meet the water,
   full-bleed, crossfading every 6.5s (900ms), each settling from 1.06
   to 1 over 7s, the whole photo zooming to 1.125 as the hero scrolls
   away (Varun V5). The pause button stops all three; the tab being
   hidden pauses it too; reduced motion starts paused on the first photo
   with a Play button. Centred headline with Kasa's word reveal, subline,
   Flights and Hotels tabs with the landfall line, the search card, and
   the arrival caption naming a real fare with "Fly here".
   Ported from landfall/prototype/ (index.html and global.js).
   Copy: landfall/content/copy.md, Home, Hero.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { addScrollJob, prefersReducedMotion, requestSearch } from '@/lib/client';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import SearchCard from '@/components/search/SearchCard';
import { airportByCode, cityById, getSearch, setSearch, useSearch, type Tab } from '@/components/search/store';

const SLIDE_MS = 6500;   /* --d-slide */
const ZOOM_MAX = 1.125;  /* --zoom-scroll */

/* sizes allow for the scroll zoom to 1.125, so 1440 and up ask for the 2400 file (round 3, A1) */
export const HERO_SIZES = '(min-aspect-ratio: 3/2) 113vw, 169vh';
const SLIDES = [
  { key: 'lisbon', slug: 'lisbon', photo: 'hero/lisbon-alfama-river', sizes: HERO_SIZES, place: 'Lisbon', code: 'LIS', fare: 'London to Lisbon, return from $412', chip: 'Lisbon, return from $412',
    alt: "Lisbon's Alfama roofs running down to the Tagus under a deep blue sky, a cruise ship at the quay" },
  { key: 'capetown', slug: 'cape-town', photo: 'hero/cape-town-waterfront', sizes: HERO_SIZES, place: 'Cape Town', code: 'CPT', fare: 'London to Cape Town, return from $1,138', chip: 'Cape Town, return from $1,138',
    alt: "Table Mountain above Cape Town's waterfront, seen across the harbour" },
  /* the New York panorama is 2:1, so tall viewports need a wider file */
  { key: 'newyork', slug: 'new-york', photo: 'hero/new-york-harbour', sizes: '(min-aspect-ratio: 2/1) 113vw, 231vh', place: 'New York', code: 'JFK', fare: 'London to New York, return from $684', chip: 'New York, return from $684',
    alt: "Lower Manhattan's skyline seen from the harbour on a clear day" }
];

/* round 3, A1: the copy follows the mode; the photos do not (the place is the same whichever way you arrive) */
const COPY = {
  flights: { title: 'Land somewhere new', sub: 'Flights and hotels, with taxes and fees in every price' },
  hotels: { title: 'Wake up somewhere new', sub: 'Hotels with the price of the whole stay up front, taxes and fees included' }
} as const;

type Props = { stays?: Record<string, number | null> };

export default function Hero({ stays = {} }: Props) {
  const s = useSearch();
  const mode: Tab = s.tab;
  const [rerun, setRerun] = useState(false);
  const [animated, setAnimated] = useState(false);
  const lastMode = useRef(mode);
  const tabs = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ x: number; w: number } | null>(null);
  const [idx, setIdx] = useState(0);
  const [settling, setSettling] = useState<number | null>(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [caption, setCaption] = useState(0);
  const [searching, setSearching] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const zoom = useRef<HTMLDivElement>(null);

  /* load sequence: the js class is set in the head; is-loaded starts the reveal, is-settled drops the delays */
  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);
    if (rm) { setPaused(true); setSettling(null); }
    const root = document.documentElement;
    let t = 0;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.add('is-loaded'); t = window.setTimeout(() => root.classList.add('is-settled'), 2000); }));
    if (location.hash === '#hotels') setSearch({ tab: 'hotels' });
    if (location.hash === '#search') window.setTimeout(() => requestSearch(undefined, 'focus-from'), 400);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(t); root.classList.remove('is-loaded', 'is-settled'); };
  }, []);

  /* crossfade: the caption fades out, swaps, and fades back with the photo */
  const show = useCallback((n: number) => {
    const next = (n + SLIDES.length) % SLIDES.length;
    setIdx(next);
    setSettling(next);
    setSwapping(true);
    /* the caption changes at the crossfade's midpoint (--d-fade 900ms), on the same timer as the photo */
    window.setTimeout(() => { setCaption(next); setSwapping(false); }, 450);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    let hidden = document.hidden;
    let t = hidden ? 0 : window.setTimeout(() => show(idx + 1), SLIDE_MS);
    const onVis = () => {
      hidden = document.hidden;
      window.clearTimeout(t);
      if (!hidden) t = window.setTimeout(() => show(idx + 1), SLIDE_MS);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => { window.clearTimeout(t); document.removeEventListener('visibilitychange', onVis); };
  }, [idx, paused, reduced, show]);

  /* scroll zoom to 1.125 over the hero (Varun V5); stops while paused */
  useEffect(() => {
    if (reduced) return;
    return addScrollJob((y) => {
      const el = zoom.current, h = hero.current;
      if (!el || !h || paused) return;
      const p = Math.min(1, Math.max(0, y / h.offsetHeight));
      el.style.transform = `scale(${(1 + (ZOOM_MAX - 1) * p).toFixed(4)})`;
    });
  }, [paused, reduced]);

  function selectTab(tab: Tab, focus = false) {
    setSearch({ tab });
    if (focus) document.getElementById(`tab-${tab}`)?.focus();
  }
  /* mode switch: the headline re-runs its word reveal, the subline and card body rise in (CSS, data-modeanim) */
  useEffect(() => {
    if (lastMode.current === mode) return;
    lastMode.current = mode;
    setAnimated(true);
    if (prefersReducedMotion()) return;
    setRerun(true);
    const t = window.setTimeout(() => setRerun(false), 34);
    return () => window.clearTimeout(t);
  }, [mode]);
  /* the landfall line under the active tab slides to the new tab */
  useEffect(() => {
    const place = () => {
      const el = tabs.current?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (el) setLine({ x: el.offsetLeft, w: el.offsetWidth });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [mode]);
  function stayHere() {
    const dest = cityById(SLIDES[caption].slug);
    if (!dest) return;
    setSearch({ tab: 'hotels', dest });
    const cur = getSearch();
    requestSearch('hotels', cur.start && cur.end ? 'rooms' : 'dates', `${dest.name} added. Now choose your dates.`);
  }
  function flyHere() {
    const code = SLIDES[caption].code;
    const to = airportByCode(code);
    if (!to) return;
    const cur = getSearch();
    setSearch({ tab: 'flights', to, from: cur.from && cur.from.city === to.city ? null : cur.from });
    requestSearch('flights', getSearch().from ? 'dates' : 'from', `${to.city} added. Now choose your dates.`);
  }

  const cap = SLIDES[caption];
  const TITLE = COPY[mode].title;
  const words = TITLE.split(' ');
  const flyName = `Fly here: ${cap.fare} for one adult, taxes and fees included`;
  const rate = stays[cap.code];
  const stayLong = rate ? `Hotels in ${cap.place} from $${rate} a night` : `Hotels in ${cap.place}`;
  const stayName = `Stay here: ${stayLong}${rate ? ', taxes and fees included' : ''}`;
  return (
    <section ref={hero} className={`o-hero${paused ? ' is-paused' : ''}${searching ? ' is-searching' : ''}`} aria-labelledby="hero-title" data-modeanim={animated || undefined}>
      <div className="o-hero__photo" data-hero-photo>
        <div className="o-hero__zoom" ref={zoom}>
          {/* Each slide: one city seen where it meets the water (the image rule). Focal points per photo in global.css. */}
          {SLIDES.map((sl, i) => (
            <figure key={sl.key} className={`o-hero__slide -${sl.key}${i === idx ? ' is-current' : ''}${settling === i && !reduced ? ' is-settling' : ''}`} aria-hidden={i !== idx || undefined}>
              <Photo name={sl.photo} sizes={sl.sizes} alt={i === idx ? sl.alt : ''} priority={i === 0} box={false} />
            </figure>
          ))}
        </div>
        <div className="o-hero__scrim" aria-hidden="true" />
      </div>

      <div className="o-hero__inner">
        <h1 className={`o-hero__title t-display${rerun ? ' -rerun' : ''}`} id="hero-title" aria-label={TITLE} key={mode}>
          {words.map((w, i) => <span key={i}><span className="w" aria-hidden="true" style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span>{i < words.length - 1 ? ' ' : ''}</span>)}
        </h1>
        <p className="o-hero__sub t-lead" key={`sub-${mode}`}>{COPY[mode].sub}</p>
        <div className={`o-hero__tabs${line ? ' has-line' : ''}`} role="tablist" aria-label="What to search" ref={tabs}>
          {(['flights', 'hotels'] as const).map((t, i) => (
            <button key={t} type="button" role="tab" className="a-tab" id={`tab-${t}`} aria-selected={s.tab === t} aria-controls={s.tab === t ? `form-${t}` : undefined} tabIndex={s.tab === t ? 0 : -1}
              onClick={() => selectTab(t)}
              onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selectTab(i === 0 ? 'hotels' : 'flights', true); } }}>
              <Icon name={t === 'flights' ? 'plane' : 'bed'} />{t === 'flights' ? 'Flights' : 'Hotels'}
            </button>
          ))}
          {line && <span className="o-hero__tabline" aria-hidden="true" style={{ transform: `translateX(${line.x}px)`, width: `${line.w}px` }} />}
        </div>
      </div>

      <SearchCard variant="hero" listen onPanel={setSearching} />

      {/* arrival caption and pause: after the card in DOM order, placed on the photo by the grid; not a live region */}
      <div className="o-hero__caption">
        <span className={`o-hero__place${swapping ? ' is-swapping' : ''}`}>{cap.place}</span>
        <span className={`o-hero__fare${swapping ? ' is-swapping' : ''}`}>
          {mode === 'hotels' ? (<>
            <span className="o-hero__fareLong">{stayLong}</span>
            <span className="o-hero__fareShort">{rate ? `${cap.place}, from $${rate} a night` : `Hotels in ${cap.place}`}</span>
            <button type="button" className="a-flyhere" aria-label={stayName} onClick={stayHere}><span className="a-flyhere__text">Stay here</span><Icon name="arrow" /></button>
          </>) : (<>
            <span className="o-hero__fareLong">{cap.fare}</span>
            <span className="o-hero__fareShort">{cap.chip}</span>
            <button type="button" className="a-flyhere" aria-label={flyName} onClick={flyHere}><span className="a-flyhere__text">Fly here</span><Icon name="arrow" /></button>
          </>)}
        </span>
      </div>
      <button type="button" className="o-hero__pause" aria-pressed={paused} aria-label={paused ? 'Play the photos' : 'Pause the photos'}
        onClick={() => { const p = !paused; setPaused(p); if (!p && reduced) setReduced(false); }}>
        <Icon name={paused ? 'play' : 'pause'} />
      </button>
    </section>
  );
}
