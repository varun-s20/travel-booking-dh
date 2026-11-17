'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): the search
   Hipcamp's pill with a white thumb that lifts under the open field,
   The Hoxton's small caps labels on both tabs, popovers 12px below.
   On phones and tablets (below 900px) the hero shows the cells inline
   as one white card; touching a cell opens the full-screen sheet on
   that cell (revision 2026-11-11, item 14). The compact bar keeps one
   summary pill below 900 that opens the same sheet.
   Ported from the approved prototype's global.js, behaviour for
   behaviour (its round 2 and 3 fixes are noted where they live).
   Submitting routes to the results page with the search in the URL.
   The compact variant is Kasa's pinned bar on results and hotel pages:
   the same cells in a 60px card, filled from the page's search; it
   condenses on the way down (Search shrinks to its arrow) and returns
   on the way up (spec 2b, Chrome).
   Every word on screen is from content/copy.md, Search.
   ===================================================================== */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Toggle } from '@/components/search/Toggle';
import { Calendar, type Trip } from '@/components/search/Calendar';
import { People, whoValue, type Cabin, type Counts } from '@/components/search/People';
import { AIRPORTS, CITIES, type Airport, type City } from '@/lib/data/places';
import { iso, longDay, range, shortDay, short } from '@/lib/dates';
import { fromIso } from '@/lib/format';
import { recordSearch } from '@/lib/history';
import { MODE_EVENT, MQ_SEARCH, SEARCH_EVENT, addScrollJob, prefersReducedMotion, requestSearch, setAppInert, setProduct, trapTab, useMedia, type SearchMode } from '@/lib/client';
import { ROUTES } from '@/lib/site';

type SegId = 'from' | 'to' | 'dates' | 'who' | 'place';
type Place = Airport | City;

type Flights = { from: Airport | null; fromText: string; to: Airport | null; toText: string; start: Date | null; end: Date | null; parked: Date | null; trip: Trip; counts: Counts; cabin: Cabin };
type Hotels = { place: City | null; placeText: string; start: Date | null; end: Date | null; counts: Counts };

const F0: Flights = { from: null, fromText: '', to: null, toText: '', start: null, end: null, parked: null, trip: 'return', counts: { adults: 1, children: 0, infants: 0 }, cabin: 'economy' };
const H0: Hotels = { place: null, placeText: '', start: null, end: null, counts: { adults: 2, children: 0, rooms: 1 } };

/* what a results or hotel page passes in, from its URL */
export type SearchInitial = {
  mode: SearchMode;
  flights?: { from: string; to: string; depart: string; ret: string | null; adults: number; children: number; infants: number; cabin: Cabin };
  hotels?: { place: string; checkin: string; checkout: string; adults: number; children: number; rooms: number };
};

function initialFlights(i?: SearchInitial['flights']): Flights {
  if (!i) return F0;
  const from = AIRPORTS.find((a) => a.code === i.from) || null, to = AIRPORTS.find((a) => a.code === i.to) || null;
  return {
    from, fromText: from ? from.city : '', to, toText: to ? to.city : '',
    start: fromIso(i.depart), end: i.ret ? fromIso(i.ret) : null, parked: null, trip: i.ret ? 'return' : 'oneway',
    counts: { adults: i.adults, children: i.children, infants: i.infants }, cabin: i.cabin
  };
}
function initialHotels(i?: SearchInitial['hotels']): Hotels {
  if (!i) return H0;
  const place = CITIES.find((c) => c.id === i.place) || null;
  return { place, placeText: place ? `${place.name}, ${place.country}` : '', start: fromIso(i.checkin), end: fromIso(i.checkout), counts: { adults: i.adults, children: i.children, rooms: i.rooms } };
}

const ORDER: Record<SearchMode, SegId[]> = { flights: ['from', 'to', 'dates', 'who'], hotels: ['place', 'dates', 'who'] };
const STATUS_ID = 'search-status';

/* ---- places: ranking and typed-text resolution ----
   Rank: airport code first, then a word that starts with the query, then
   anything containing it ("lon" puts London above Barcelona). To never
   offers the airport chosen as From (and the reverse), and same-city
   airports drop to the end (round 3, critic). */
function isAirport(p: Place): p is Airport { return (p as Airport).code !== undefined; }
function score(p: Place, q: string): number {
  if (!q) return 0;
  if (isAirport(p)) {
    const code = p.code.toLowerCase();
    if (code === q) return 0;
    if (code.startsWith(q)) return 1;
  }
  const text = (isAirport(p) ? [p.name, p.city, p.country] : [p.name, p.country]).join(' ').toLowerCase();
  if (text.split(/[\s,.()]+/).some((w) => w.startsWith(q))) return 2;
  return text.includes(q) ? 3 : -1;
}
function rank(kind: 'airports' | 'cities', query: string, away: Airport | null): Place[] {
  const q = query.trim().toLowerCase();
  const src: Place[] = kind === 'airports' ? AIRPORTS : CITIES;
  return src
    .map((p, i) => {
      let s = score(p, q);
      if (away && s > -1 && isAirport(p)) { if (p.code === away.code) s = -1; else if (p.city === away.city) s += 10; }
      return { p, s, i };
    })
    .filter((x) => x.s > -1)
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .map((x) => x.p);
}
/* Typed text that names one place is accepted without picking from the list:
   an exact code, city or name, or a single match (round 3, critic: "Paris" then Tab was refused) */
function resolveText(kind: 'airports' | 'cities', text: string, away: Airport | null): Place | null {
  const q = text.trim().toLowerCase();
  if (!q) return null;
  const found = rank(kind, q, away);
  const exact = found.filter((p) => isAirport(p)
    ? p.code.toLowerCase() === q || p.name.toLowerCase() === q || p.city.toLowerCase() === q
    : p.id === q || p.name.toLowerCase() === q || p.country.toLowerCase() === q);
  return found.length === 1 ? found[0] : exact[0] || null;
}
/* the cell shows the city; the airport code sits on the label row, so long names never clip (round 2, critic) */
function placeLabel(p: Place): string { return isAirport(p) ? p.city : `${p.name}, ${p.country}`; }

function datesValue(kind: SearchMode, start: Date | null, end: Date | null, single: boolean): string {
  if (!start) return 'Add dates';
  if (single) return shortDay(start);
  if (!end) return `From ${short(start)}`;
  return range(start, end);
}

/* =====================================================================
   One combobox cell: From, To, Destination
   ===================================================================== */
type ComboProps = {
  id: string; seg: SegId; label: string; placeholder: string; icon: string; head: string; name: string;
  kind: 'airports' | 'cities';
  chosen: Place | null; text: string; away: Airport | null;
  isOpen: boolean; invalid: boolean;
  quiet: React.MutableRefObject<boolean>;
  onOpen: () => void; onClose: () => void;
  onText: (t: string) => void; onChoose: (p: Place, stay: boolean) => void;
};

function ComboField(props: ComboProps) {
  const { id, label, placeholder, icon, head, name, kind, chosen, text, away, isOpen, invalid, quiet, onOpen, onClose, onText, onChoose } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(-1);
  const listId = `${id}-list`;
  /* a chosen place shows the whole list again when reopened */
  const query = chosen && text === placeLabel(chosen) ? '' : text;
  const items = useMemo(() => (isOpen ? rank(kind, query, away) : []), [isOpen, kind, query, away]);

  useEffect(() => { if (isOpen) { setActive(-1); if (listRef.current) listRef.current.scrollTop = 0; } }, [isOpen]);
  useEffect(() => { if (active >= items.length) setActive(items.length ? 0 : -1); }, [items.length, active]);

  function highlight(i: number) {
    if (!items.length) return;
    const n = (i + items.length) % items.length;
    setActive(n);
    requestAnimationFrame(() => {
      const list = listRef.current, o = document.getElementById(`${listId}-${n}`);
      if (!list || !o) return;
      if (o.offsetTop < list.scrollTop) list.scrollTop = o.offsetTop;
      else if (o.offsetTop + o.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = o.offsetTop + o.offsetHeight - list.clientHeight;
    });
  }

  return (
    <>
      <div className="m-search__field" data-field onMouseDown={(e) => { if (e.target !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); } }}>
        <Icon name={icon} />
        <span className="m-search__text">
          <span className="m-search__labelRow">
            <label className="m-search__label a-label" htmlFor={id}>{label}</label>
            {kind === 'airports' && <span className="m-search__code a-label" id={`${id}-code`}>{chosen && isAirport(chosen) ? chosen.code : ''}</span>}
          </span>
          <input
            ref={inputRef}
            className="m-search__input"
            id={id}
            type="text"
            name={name}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-activedescendant={isOpen && active > -1 ? `${listId}-${active}` : undefined}
            aria-describedby={[kind === 'airports' ? `${id}-code` : '', invalid ? STATUS_ID : ''].filter(Boolean).join(' ') || undefined}
            aria-invalid={invalid || undefined}
            value={text}
            onFocus={() => { if (!quiet.current) onOpen(); }}
            onChange={(e) => {
              onText(e.target.value);
              if (!isOpen) onOpen();
              setActive(e.target.value.trim() ? 0 : -1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) onOpen();
                highlight(active + (e.key === 'ArrowDown' ? 1 : -1));
              } else if (e.key === 'Enter') {
                if (isOpen && active > -1 && items[active]) { e.preventDefault(); onChoose(items[active], false); }
              } else if (e.key === 'Tab') {
                onClose();
              }
            }}
            onBlur={() => {
              if (chosen) return;
              const p = resolveText(kind, text, away);
              if (p) onChoose(p, true);
            }}
          />
        </span>
      </div>
      <div className="m-pop -list" id={`${id}-pop`} hidden={!isOpen}>
        <p className="m-pop__head" id={`${id}-head`}>{head}</p>
        <ul className="m-pop__list" id={listId} role="listbox" aria-labelledby={`${id}-head`} ref={listRef}>
          {isOpen && !items.length && (
            <li className="m-pop__empty" role="presentation">No places match “{text.trim()}”. Check the spelling or type a three-letter airport code.</li>
          )}
          {items.map((p, i) => (
            <li
              key={isAirport(p) ? p.code : p.id}
              className="m-option"
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChoose(p, false)}
            >
              <span className="m-option__disc" aria-hidden="true"><Icon name={isAirport(p) ? 'plane' : 'city'} size="s" /></span>
              <span className="m-option__text">
                <span className="m-option__title">{p.name}</span>
                <span className="m-option__sub">{isAirport(p) ? `${p.city}, ${p.country}` : p.country}</span>
              </span>
              {isAirport(p) && <span className="m-option__code">{p.code}</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* =====================================================================
   A button cell that opens a popover: Dates, Travelers, Guests and rooms
   ===================================================================== */
function PopField({ id, label, value, set, icon, isOpen, invalid, onToggle, popClass, popLabel, children }: {
  id: string; label: string; value: string; set: boolean; icon: string; isOpen: boolean; invalid: boolean;
  onToggle: () => void; popClass: string; popLabel: string; children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="m-search__field"
        type="button"
        data-field
        aria-expanded={isOpen}
        aria-controls={`${id}-pop`}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? STATUS_ID : undefined}
        onClick={onToggle}
      >
        <Icon name={icon} />
        <span className="m-search__text">
          <span className="m-search__label a-label">{label}</span>
          <span className={`m-search__value${set ? ' is-set' : ''}`}>{value}</span>
        </span>
      </button>
      <div className={`m-pop ${popClass}`} id={`${id}-pop`} role="group" aria-label={popLabel} hidden={!isOpen}>
        {isOpen && children}
      </div>
    </>
  );
}

/* =====================================================================
   The search
   ===================================================================== */
export function Search({ variant = 'hero', initial }: { variant?: 'hero' | 'compact'; initial?: SearchInitial }) {
  const router = useRouter();
  /* the pill and its popovers from 900px (revision item 11); below it the stacked card and the sheet */
  const desktop = useMedia(MQ_SEARCH);
  const compact = variant === 'compact';
  const [mode, setMode] = useState<SearchMode>(initial?.mode || 'flights');
  const [fl, setFl] = useState<Flights>(() => initialFlights(initial?.flights));
  const [ho, setHo] = useState<Hotels>(() => initialHotels(initial?.hotels));
  const [condensed, setCondensed] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [openSeg, setOpenSeg] = useState<SegId | null>(null);
  const [invalid, setInvalid] = useState<SegId | null>(null);
  const [status, setStatus] = useState<{ msg: string; kind?: 'error' | 'done' }>({ msg: '' });
  const [sheet, setSheet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const quiet = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /* the cell that opened the sheet (phones), and whether its picker opens with it (a failed search only focuses) */
  const sheetSeg = useRef<{ seg: SegId; quiet: boolean } | null>(null);
  const segEls = useRef<Record<string, HTMLDivElement | null>>({});
  const pills = useRef<Record<string, HTMLDivElement | null>>({});
  const thumbs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => setMounted(true), []);

  /* the home search reports its tab, so the rail and the tab bar mark that product as current (item 7) */
  useEffect(() => {
    if (compact) return;
    setProduct(mode);
  }, [compact, mode]);
  useEffect(() => (compact ? undefined : () => setProduct(null)), [compact]);

  /* compact bar: condenses on the way down, returns on the way up (Kasa) */
  useEffect(() => {
    if (!compact) return;
    let last = window.scrollY;
    return addScrollJob((y) => {
      setScrolledPast(y > 8);
      if (y < 120) setCondensed(false);
      else if (y > last + 4) setCondensed(true);
      else if (y < last - 4) setCondensed(false);
      last = y;
    });
  }, [compact]);

  /* arriving on /#search (the 404's "Start a search") works like the in-page buttons: focus From on
     desktop, open the sheet on the phone (critic round 2: focus stayed on the page) */
  useEffect(() => {
    const h = window.location.hash;
    /* the rail's and the tab bar's Flights and Hotels from another page (/#flights, /#hotels): the search is set
       to that product, in view, first field focused quietly on wide screens (revision item 7) */
    if (!compact && (h === '#flights' || h === '#hotels')) {
      const t = window.setTimeout(() => requestSearch(h === '#hotels' ? 'hotels' : 'flights', undefined, true), 60);
      return () => window.clearTimeout(t);
    }
    if (h !== '#search' && h !== '#search-hotels') return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    const t = window.setTimeout(() => requestSearch(h === '#search-hotels' ? 'hotels' : undefined), 60);
    return () => window.clearTimeout(t);
  }, []);

  const segEl = useCallback((seg: SegId, m: SearchMode = mode) => segEls.current[`${m}:${seg}`] || null, [mode]);
  const control = (el: HTMLElement | null) => el?.querySelector<HTMLElement>('input[role="combobox"], button[data-field]') || null;

  const open = useCallback((seg: SegId) => { setOpenSeg(seg); setInvalid((i) => (i === seg ? null : i)); }, []);
  const close = useCallback(() => setOpenSeg(null), []);

  function clearInvalid(seg: SegId) {
    if (invalid !== seg) return;
    setInvalid(null);
    if (status.kind === 'error') setStatus({ msg: '' });
  }

  /* ---- the thumb lifts under the open cell; popovers sit 12px below, kept inside the pill (desktop) ---- */
  useLayoutEffect(() => {
    if (!desktop || !openSeg) return;
    const seg = segEl(openSeg), thumb = thumbs.current[mode], pill = pills.current[mode];
    if (!seg || !thumb || !pill) return;
    thumb.style.left = `${seg.offsetLeft}px`;
    thumb.style.width = `${seg.offsetWidth}px`;
    const pop = seg.querySelector<HTMLElement>('.m-pop');
    if (!pop) return;
    const w = pop.offsetWidth, pw = pill.clientWidth, sl = seg.offsetLeft;
    let x = openSeg === 'who' ? sl + seg.offsetWidth - w : openSeg === 'dates' ? sl + seg.offsetWidth / 2 - w / 2 : sl;
    x = Math.min(Math.max(x, 0), Math.max(0, pw - w));
    pop.style.left = `${x - sl}px`;
  }, [openSeg, mode, desktop, segEl]);

  /* ---- outside clicks close the open cell. On click, not press: in the
     phone sheet the pickers sit inline, so closing on press would move
     the button under the finger before the click lands ---- */
  useEffect(() => {
    if (!openSeg) return;
    const seg = segEl(openSeg);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!document.documentElement.contains(t)) return; /* a re-rendered calendar arrow */
      if (seg && !seg.contains(t)) close();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openSeg, segEl, close]);

  /* ---- phone sheet: a dialog over an inert page ---- */
  useEffect(() => {
    if (!sheet) return;
    setAppInert(true);
    const from = sheetSeg.current;
    /* opened from a cell: that cell's keyboard or picker is ready; otherwise focus starts on Close */
    requestAnimationFrame(() => {
      const c = from ? control(segEls.current[`${mode}:${from.seg}`]) : null;
      if (!c || !from) { document.getElementById('search-close')?.focus(); return; }
      quiet.current = from.quiet;
      c.focus();
      quiet.current = false;
      if (!from.quiet && c.tagName === 'BUTTON') open(from.seg);
    });
    return () => {
      setAppInert(false);
      setOpenSeg(null);
      /* focus goes back to the cell on the card, or to the compact bar's summary pill */
      const back = sheetSeg.current;
      sheetSeg.current = null;
      requestAnimationFrame(() => {
        const c = back ? control(segEls.current[`${mode}:${back.seg}`]) : null;
        if (c) { quiet.current = true; c.focus({ preventScroll: true }); quiet.current = false; }
        else triggerRef.current?.focus();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);
  useEffect(() => { if (desktop) { setSheet(false); setOpenSeg(null); } }, [desktop]);

  /* ---- requests from the entry cards and the pre-footer band ---- */
  useEffect(() => {
    const onRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ mode?: SearchMode; seg?: SegId; inPlace?: boolean }>).detail || {};
      const m = detail.mode;
      const target = m || mode;
      setCondensed(false);
      if (m && m !== mode) switchMode(m);
      const wide = window.matchMedia(MQ_SEARCH).matches;
      /* the tab bar's Flights and Hotels on the home page: switch and bring the card into view, no sheet, no keyboard */
      if (!wide && detail.inPlace) {
        if (!compact) rootRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      if (!wide) { sheetSeg.current = detail.seg ? { seg: detail.seg, quiet: false } : null; setSheet(true); return; }
      rootRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      /* focus the first cell without opening its list, so nothing covers the search while it scrolls in.
         Critic round 1 (10 Nov): the cell showed no ring when focus arrived this way; the keyboard flag
         makes the accent ring show until the next pointer press */
      requestAnimationFrame(() => {
        const seg = detail.seg && ORDER[target].includes(detail.seg) ? detail.seg : ORDER[target][0];
        const input = control(segEls.current[`${target}:${seg}`]);
        document.documentElement.classList.add('is-kbd');
        quiet.current = true;
        input?.focus({ preventScroll: true });
        quiet.current = false;
        /* "Change dates" opens the calendar straight away */
        if (detail.seg && input?.tagName === 'BUTTON') open(seg);
      });
    };
    window.addEventListener(SEARCH_EVENT, onRequest);
    return () => window.removeEventListener(SEARCH_EVENT, onRequest);
  });

  /* round 3 (spec A1): Back and Forward on the home page set the tab quietly, with no scroll and no focus */
  useEffect(() => {
    if (compact) return;
    const on = (e: Event) => { const m = (e as CustomEvent<{ mode: SearchMode }>).detail.mode; if (m !== mode) switchMode(m); };
    window.addEventListener(MODE_EVENT, on);
    return () => window.removeEventListener(MODE_EVENT, on);
  });

  function switchMode(m: SearchMode) {
    setOpenSeg(null);
    setInvalid(null);
    setStatus({ msg: '' });
    setMode(m);
  }

  /* after a choice the next cell takes over, as the pill reads left to right */
  function advance(from: SegId) {
    const order = ORDER[mode], next = order[order.indexOf(from) + 1];
    if (!next) return;
    requestAnimationFrame(() => {
      const c = control(segEl(next));
      if (!c) return;
      c.focus();
      if (c.tagName === 'BUTTON') open(next);
    });
  }

  /* ---- shared cell behaviour: Escape closes, keyboard leaving closes ---- */
  function segProps(m: SearchMode, seg: SegId) {
    const isOpen = mode === m && openSeg === seg;
    return {
      'data-seg': seg,
      ref: (el: HTMLDivElement | null) => { segEls.current[`${m}:${seg}`] = el; },
      className: `m-search__seg -${seg}${seg === 'dates' && m === 'hotels' ? ' -stay' : ''}${isOpen ? ' is-open' : ''}${invalid === seg && mode === m ? ' is-invalid' : ''}`,
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          e.stopPropagation();
          close();
          const c = control(e.currentTarget);
          if (c && document.activeElement !== c) c.focus();
        }
      },
      onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
        if (!document.documentElement.classList.contains('is-kbd')) return;
        const next = e.relatedTarget as Node | null;
        if (isOpen && next && !e.currentTarget.contains(next)) close();
      },
      /* clicks inside a popover never move focus out of the cell (main carries
         tabindex -1 for the skip link, so a click on plain text would focus it) */
      onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
        const t = e.target as HTMLElement;
        if (t.closest('.m-pop') && !t.closest('input[type="text"]')) e.preventDefault();
      }
    };
  }

  /* ---- submit: validate, then go to the results ---- */
  function fail(seg: SegId, msg: string) {
    setStatus({ msg, kind: 'error' });
    setInvalid(seg);
    /* phones: a failed search opens the sheet on the failing cell, with the message in view (item 14) */
    if (!desktop && !sheet) {
      sheetSeg.current = { seg, quiet: true };
      setSheet(true);
      return;
    }
    const c = control(segEl(seg));
    if (c) {
      /* focus the field without opening its popover, so nothing covers the message */
      quiet.current = true;
      c.focus();
      quiet.current = false;
    }
  }
  const pickMsg = (typed: string, fallback: string) => (typed.trim() ? `Choose “${typed.trim()}” from the list, or type a city or airport code.` : fallback);

  function submitFlights(e: React.FormEvent) {
    e.preventDefault();
    close();
    const from = fl.from || (resolveText('airports', fl.fromText, fl.to) as Airport | null);
    const to = fl.to || (resolveText('airports', fl.toText, from) as Airport | null);
    if (from !== fl.from || to !== fl.to) setFl((f) => ({ ...f, from, to, fromText: from ? placeLabel(from) : f.fromText, toText: to ? placeLabel(to) : f.toText }));
    if (!from) return fail('from', pickMsg(fl.fromText, 'Choose the city or airport you are flying from.'));
    if (!to) return fail('to', pickMsg(fl.toText, 'Choose where you are flying to.'));
    if (from.code === to.code) return fail('to', 'Choose a destination different from where you start.');
    if (!fl.start) return fail('dates', 'Choose your departure date.');
    if (fl.trip === 'return' && !fl.end) return fail('dates', 'Choose your return date, or switch to one way.');
    setStatus({ msg: `Searching flights from ${from.city} to ${to.city}`, kind: 'done' });
    const q = new URLSearchParams({ from: from.code, to: to.code, depart: iso(fl.start) });
    if (fl.trip === 'return' && fl.end) q.set('return', iso(fl.end));
    q.set('adults', String(fl.counts.adults));
    q.set('children', String(fl.counts.children));
    q.set('infants', String(fl.counts.infants));
    q.set('cabin', fl.cabin);
    setSheet(false);
    recordSearch({ mode: 'flights', from: from.code, to: to.code, depart: iso(fl.start), return: fl.trip === 'return' && fl.end ? iso(fl.end) : null, adults: fl.counts.adults, children: fl.counts.children, infants: fl.counts.infants, cabin: fl.cabin });
    router.push(`${ROUTES.flights}?${q}`);
  }

  function submitHotels(e: React.FormEvent) {
    e.preventDefault();
    close();
    const place = ho.place || (resolveText('cities', ho.placeText, null) as City | null);
    if (place !== ho.place) setHo((h) => ({ ...h, place, placeText: place ? placeLabel(place) : h.placeText }));
    if (!place) return fail('place', pickMsg(ho.placeText, 'Choose the city you want to stay in.'));
    if (!ho.start || !ho.end) return fail('dates', 'Choose your check-in and check-out dates.');
    setStatus({ msg: `Searching hotels in ${place.name}`, kind: 'done' });
    const q = new URLSearchParams({ place: place.id, checkin: iso(ho.start), checkout: iso(ho.end), adults: String(ho.counts.adults), children: String(ho.counts.children), rooms: String(ho.counts.rooms) });
    setSheet(false);
    recordSearch({ mode: 'hotels', place: place.id, checkin: iso(ho.start), checkout: iso(ho.end), adults: ho.counts.adults, children: ho.counts.children, rooms: ho.counts.rooms });
    router.push(`${ROUTES.hotels}?${q}`);
  }

  /* ---- phone trigger: summarises what was entered (round 2, critic: it looked as if the input was lost) ---- */
  const trigger = useMemo(() => {
    const single = fl.trip === 'oneway';
    if (mode === 'flights') {
      const a = fl.from ? fl.from.city : '', b = fl.to ? fl.to.city : '';
      const route = a && b ? `${a} to ${b}` : a ? `From ${a}` : b ? `To ${b}` : '';
      const dates = fl.start && (single || fl.end) ? datesValue('flights', fl.start, fl.end, single) : '';
      const who = whoValue('flights', fl.counts, fl.cabin);
      const label = route || dates ? `Flights${dates ? `, ${dates}` : ''}` : 'Flights and hotels';
      const longDates = fl.start ? (single ? longDay(fl.start) : fl.end ? `${longDay(fl.start)} to ${longDay(fl.end)}` : '') : '';
      const aria = a && b ? ['Change search: flights', route, longDates, who].filter(Boolean).join(', ') : undefined;
      return { label, value: route || 'Where to?', set: !!route, aria };
    }
    const city = ho.place ? ho.place.name : '';
    const dates = ho.start && ho.end ? datesValue('hotels', ho.start, ho.end, false) : '';
    const value = city ? `${city}, ${whoValue('hotels', ho.counts).split(', ')[0]}` : '';
    const longDates = ho.start && ho.end ? `${longDay(ho.start)} to ${longDay(ho.end)}` : '';
    const aria = city ? ['Change search: hotels', city, longDates, whoValue('hotels', ho.counts)].filter(Boolean).join(', ') : undefined;
    return { label: `Hotels${dates ? `, ${dates}` : ''}`, value: value || 'Where to?', set: !!value, aria };
  }, [mode, fl, ho]);

  /* ---- the panel: inline on desktop, a full-screen sheet on the phone ---- */
  function renderPanel(asSheet: boolean) {
    const fOpen = (seg: SegId) => mode === 'flights' && openSeg === seg;
    const hOpen = (seg: SegId) => mode === 'hotels' && openSeg === seg;
    const flSingle = fl.trip === 'oneway';
    return (
      <div
        className={`m-search__panel${asSheet ? ' is-sheet' : ''}`}
        id="search-panel"
        role={asSheet ? 'dialog' : undefined}
        aria-modal={asSheet || undefined}
        aria-labelledby={asSheet ? 'search-sheet-title' : undefined}
        /* phones and tablets: a pointer on a cell opens the full-screen sheet on that cell, with its keyboard or picker
           ready; the card stays as the summary of what was chosen. Keyboard users tab through the cells in place,
           and their pickers open inline under the cell (prototype global.js, phoneCell) */
        onMouseDownCapture={!asSheet && !desktop ? (e) => {
          if ((e.target as HTMLElement).closest('[data-field]')) { e.preventDefault(); e.stopPropagation(); }
        } : undefined}
        onClickCapture={!asSheet && !desktop ? (e) => {
          const field = (e.target as HTMLElement).closest('[data-field]');
          const seg = field?.closest<HTMLElement>('[data-seg]')?.dataset.seg as SegId | undefined;
          if (!field || !seg || e.detail === 0) return;
          e.preventDefault();
          e.stopPropagation();
          sheetSeg.current = { seg, quiet: false };
          setSheet(true);
        } : undefined}
        onKeyDown={asSheet ? (e) => {
          if (e.key === 'Escape' && !openSeg) { e.preventDefault(); setSheet(false); }
          trapTab(e);
        } : undefined}
      >
        <div className="m-search__sheetHead">
          <h2 className="m-search__sheetTitle" id="search-sheet-title">Search</h2>
          <button className="a-round" id="search-close" type="button" aria-label="Close search" onClick={() => setSheet(false)}><Icon name="close" /></button>
        </div>

        <div className="m-search__modes">
          <Toggle
            label="What to search"
            value={mode}
            onChange={switchMode}
            options={[{ value: 'flights', label: 'Flights', controls: 'search-flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', controls: 'search-hotels', icon: 'bed' }]}
          />
        </div>

        {/* Flights: From, To, Dates (with return or one way), Travelers and cabin */}
        <form className="m-search__form" id="search-flights" action={ROUTES.flights} method="get" noValidate aria-label="Search flights" hidden={mode !== 'flights'} onSubmit={submitFlights}>
          <div className={`m-search__pill${mode === 'flights' && openSeg ? ' is-active' : ''}`} ref={(el) => { pills.current.flights = el; }}>
            <span className="m-search__thumb" aria-hidden="true" ref={(el) => { thumbs.current.flights = el; }} />
            <div {...segProps('flights', 'from')}>
              <ComboField id="fl-from" seg="from" name="from_label" label="From" placeholder="City or airport" icon="depart" head="Cities and airports" kind="airports"
                chosen={fl.from} text={fl.fromText} away={fl.to} isOpen={fOpen('from')} invalid={invalid === 'from' && mode === 'flights'} quiet={quiet}
                onOpen={() => open('from')} onClose={close}
                onText={(t) => { setFl((f) => ({ ...f, fromText: t, from: null })); clearInvalid('from'); }}
                onChoose={(p, stay) => { setFl((f) => ({ ...f, from: p as Airport, fromText: placeLabel(p) })); clearInvalid('from'); if (!stay) { close(); advance('from'); } }} />
              <input type="hidden" name="from" value={fl.from?.code || ''} />
            </div>
            <div {...segProps('flights', 'to')}>
              <ComboField id="fl-to" seg="to" name="to_label" label="To" placeholder="Where to?" icon="pin" head="Cities and airports" kind="airports"
                chosen={fl.to} text={fl.toText} away={fl.from} isOpen={fOpen('to')} invalid={invalid === 'to' && mode === 'flights'} quiet={quiet}
                onOpen={() => open('to')} onClose={close}
                onText={(t) => { setFl((f) => ({ ...f, toText: t, to: null })); clearInvalid('to'); }}
                onChoose={(p, stay) => { setFl((f) => ({ ...f, to: p as Airport, toText: placeLabel(p) })); clearInvalid('to'); if (!stay) { close(); advance('to'); } }} />
              <input type="hidden" name="to" value={fl.to?.code || ''} />
            </div>
            <div {...segProps('flights', 'dates')}>
              <PopField id="fl-dates" label="Dates" icon="cal" value={datesValue('flights', fl.start, fl.end, flSingle)} set={!!fl.start}
                isOpen={fOpen('dates')} invalid={invalid === 'dates' && mode === 'flights'} onToggle={() => (fOpen('dates') ? close() : open('dates'))}
                popClass="-dates" popLabel="Choose dates">
                <Calendar kind="flights" idPrefix="fl-cal" start={fl.start} end={flSingle ? null : fl.end} trip={fl.trip}
                  onChange={(start, end) => { setFl((f) => ({ ...f, start, end: f.trip === 'oneway' ? null : end, parked: start ? f.parked : null })); if (start && (flSingle || end)) clearInvalid('dates'); }}
                  /* one way parks the return date; switching back restores it (round 3, critic) */
                  onTrip={(trip) => {
                    setFl((f) => trip === 'oneway'
                      ? { ...f, trip, parked: f.end, end: null }
                      : { ...f, trip, end: f.parked && f.start && f.parked >= f.start ? f.parked : null, parked: null });
                    if (trip === 'oneway' && fl.start) clearInvalid('dates');
                  }}
                  onDone={() => { close(); control(segEl('dates'))?.focus(); }} />
              </PopField>
              <input type="hidden" name="depart" value={iso(fl.start)} />
              <input type="hidden" name="return" value={flSingle ? '' : iso(fl.end)} />
            </div>
            <div {...segProps('flights', 'who')}>
              <PopField id="fl-who" label="Travelers" icon="people" value={whoValue('flights', fl.counts, fl.cabin)} set
                isOpen={fOpen('who')} invalid={false} onToggle={() => (fOpen('who') ? close() : open('who'))}
                popClass="-who" popLabel="Travelers and cabin">
                <People kind="flights" idPrefix="fl" counts={fl.counts} cabin={fl.cabin}
                  onCounts={(counts) => setFl((f) => ({ ...f, counts }))} onCabin={(cabin) => setFl((f) => ({ ...f, cabin }))}
                  onDone={() => { close(); control(segEl('who'))?.focus(); }} />
              </PopField>
            </div>
            <button className="a-button -steady m-search__go" type="submit"><span className="a-button__label">Search</span><Icon name="arrow" className="a-button__icon" /></button>
          </div>
        </form>

        {/* Hotels: Destination, Check in and out, Guests and rooms.
            If the Duffel Stays account is not approved, drop this form and the toggle; nothing else depends on it. */}
        <form className="m-search__form" id="search-hotels" action={ROUTES.hotels} method="get" noValidate aria-label="Search hotels" hidden={mode !== 'hotels'} onSubmit={submitHotels}>
          <div className={`m-search__pill${mode === 'hotels' && openSeg ? ' is-active' : ''}`} ref={(el) => { pills.current.hotels = el; }}>
            <span className="m-search__thumb" aria-hidden="true" ref={(el) => { thumbs.current.hotels = el; }} />
            <div {...segProps('hotels', 'place')}>
              <ComboField id="ho-place" seg="place" name="place_label" label="Destination" placeholder="City or area" icon="pin" head="Cities" kind="cities"
                chosen={ho.place} text={ho.placeText} away={null} isOpen={hOpen('place')} invalid={invalid === 'place' && mode === 'hotels'} quiet={quiet}
                onOpen={() => open('place')} onClose={close}
                onText={(t) => { setHo((h) => ({ ...h, placeText: t, place: null })); clearInvalid('place'); }}
                onChoose={(p, stay) => { setHo((h) => ({ ...h, place: p as City, placeText: placeLabel(p) })); clearInvalid('place'); if (!stay) { close(); advance('place'); } }} />
              <input type="hidden" name="place" value={ho.place?.id || ''} />
            </div>
            <div {...segProps('hotels', 'dates')}>
              <PopField id="ho-dates" label="Check in and out" icon="cal" value={datesValue('hotels', ho.start, ho.end, false)} set={!!ho.start}
                isOpen={hOpen('dates')} invalid={invalid === 'dates' && mode === 'hotels'} onToggle={() => (hOpen('dates') ? close() : open('dates'))}
                popClass="-dates" popLabel="Choose dates">
                <Calendar kind="hotels" idPrefix="ho-cal" start={ho.start} end={ho.end}
                  onChange={(start, end) => { setHo((h) => ({ ...h, start, end })); if (start && end) clearInvalid('dates'); }}
                  onDone={() => { close(); control(segEl('dates'))?.focus(); }} />
              </PopField>
              <input type="hidden" name="checkin" value={iso(ho.start)} />
              <input type="hidden" name="checkout" value={iso(ho.end)} />
            </div>
            <div {...segProps('hotels', 'who')}>
              <PopField id="ho-who" label="Guests and rooms" icon="bed" value={whoValue('hotels', ho.counts)} set
                isOpen={hOpen('who')} invalid={false} onToggle={() => (hOpen('who') ? close() : open('who'))}
                popClass="-who" popLabel="Guests and rooms">
                <People kind="hotels" idPrefix="ho" counts={ho.counts}
                  onCounts={(counts) => setHo((h) => ({ ...h, counts }))}
                  onDone={() => { close(); control(segEl('who'))?.focus(); }} />
              </PopField>
            </div>
            <button className="a-button -steady m-search__go" type="submit"><span className="a-button__label">Search</span><Icon name="arrow" className="a-button__icon" /></button>
          </div>
        </form>

        <p className={`m-search__status${status.kind === 'error' ? ' is-error' : status.kind === 'done' ? ' is-done' : ''}`} id={STATUS_ID} role="status">{status.msg}</p>
      </div>
    );
  }

  return (
    <div className={compact ? `m-search -compact${condensed ? ' is-condensed' : ''}${scrolledPast ? ' is-scrolled' : ''}` : 'o-homeHero__search m-search'} id="search" ref={rootRef} data-pinned-search={compact || undefined}>
      {compact && <button
        ref={triggerRef}
        className="m-search__trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={sheet}
        aria-controls="search-panel"
        aria-label={trigger.aria}
        onClick={() => setSheet(true)}
      >
        <Icon name="search" />
        <span className="m-search__triggerText">
          <span className="a-label">{trigger.label}</span>
          <span className={`m-search__triggerValue${trigger.set ? ' is-set' : ''}`}>{trigger.value}</span>
        </span>
        <span className="m-search__triggerGo" aria-hidden="true"><Icon name="arrow" /></span>
      </button>}
      {sheet && mounted ? createPortal(renderPanel(true), document.body) : renderPanel(false)}
    </div>
  );
}
