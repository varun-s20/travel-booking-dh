/* =====================================================================
   Landfall (working name, a placeholder): the search card (Kasa)
   One white card with labelled fields (Expedia technique). Each field
   opens a panel that grows out of the card as one surface at 1025 and up
   (height 200ms) and a full-screen sheet below (title, 44px close, fixed
   Clear and Done footer). Place list combobox, two-month range calendar
   with arrow keys, steppers with Duffel's limits, cabin class.
   Validation: a white chip under the card at 1440; below 1025 the missing
   field's sheet opens with the message at its top. Submit goes to the
   results URL with the search in the query.
   Props:
   - variant 'hero' (home and 404: under the hero tabs), 'drop' (inner
     pages: dropped from the compact bar at 1025 and up, or inside the
     change-search sheet below)
   - autoOpen: open this field on mount (compact bar segments)
   - listen: answer lib/client.ts requestSearch() (only one card per page)
   - onPanel(open): tells the hero when a panel is open (it hides the caption)
   State lives in components/search/store.ts.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIRPORTS, CITIES, type Airport, type City } from '@/lib/data/places';
import { CABINS } from '@/lib/cabins';
import { addRecent } from '@/lib/recent';
import { api } from '@/lib/api';
import { MQ_DESKTOP, SEARCH_EVENT, prefersReducedMotion, trapTab, useMedia, type SearchSeg } from '@/lib/client';
import { nights, sameDay, short } from '@/lib/dates';
import Icon from '@/components/ui/Icon';
import Calendar from './Calendar';
import {
  allowed, datesText, missing, partyText, placeValue, resultsHref, roomsText, setSearch, getSearch, submitStatus, useSearch,
  type FieldName, type StepKey, type Tab
} from './store';

type Props = { variant?: 'hero' | 'drop'; autoOpen?: FieldName | null; listen?: boolean; onPanel?: (open: boolean) => void; onSubmitted?: () => void };

const TITLES: Record<FieldName, (tab: Tab) => string> = {
  from: () => 'Flying from', to: () => 'Flying to', dest: () => 'Staying in',
  dates: (t) => (t === 'flights' ? 'Dates' : 'Check in and out'), party: () => 'Travelers', rooms: () => 'Guests and rooms'
};

export default function SearchCard({ variant = 'hero', autoOpen = null, listen = false, onPanel, onSubmitted }: Props) {
  const s = useSearch();
  const router = useRouter();
  const desktop = useMedia(MQ_DESKTOP, true);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [open, setOpen] = useState<FieldName | null>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean }>({ text: '', error: false });
  const [invalid, setInvalid] = useState<FieldName | null>(null);
  const [sheetMsg, setSheetMsg] = useState('');
  const [turned, setTurned] = useState(false);
  const [focusKey, setFocusKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Partial<Record<FieldName, HTMLDivElement | null>>>({});
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLButtonElement | null>>>({});

  const fid = (n: FieldName) => `${uid}-f-${n}`;
  const pid = (n: FieldName) => `${uid}-p-${n}`;

  /* ---- open and close ---- */
  const close = useCallback((returnFocus = true) => {
    /* a guidance line ("Lisbon added. Now choose your dates.") ends with its panel; errors and the submit line stay */
    setStatus((st) => (st.error || st.text.startsWith('Searching') ? st : { text: '', error: false }));
    setOpen((cur) => {
      if (cur && returnFocus) {
        const p = panelRefs.current[cur];
        if (p && p.contains(document.activeElement)) fieldRefs.current[cur]?.focus({ preventScroll: true });
      }
      return null;
    });
    setSheetMsg('');
  }, []);

  const openField = useCallback((name: FieldName, msg = '') => {
    setOpen(name);
    setSheetMsg(msg);
    setFocusKey((k) => k + 1);
  }, []);

  useEffect(() => { onPanel?.(!!open); }, [open, onPanel]);

  /* panel height at 1025 and up (Kasa: the card grows); sheets lock the page below */
  useEffect(() => {
    const body = document.body;
    if (!open) { body.classList.remove('is-sheet'); if (!desktop) body.classList.remove('is-locked'); return; }
    if (!desktop) { body.classList.add('is-locked', 'is-sheet'); return; }
    const p = panelRefs.current[open];
    if (!p) return;
    p.style.height = '0px';
    const raf = requestAnimationFrame(() => { p.style.height = `${(p.firstElementChild as HTMLElement).scrollHeight}px`; });
    return () => cancelAnimationFrame(raf);
  }, [open, desktop]);
  useEffect(() => () => { document.body.classList.remove('is-sheet', 'is-locked'); }, []);
  /* keep the open panel's height in step with its content (list filtering, month change) */
  useEffect(() => {
    if (!open || !desktop) return;
    const p = panelRefs.current[open];
    const inner = p?.firstElementChild as HTMLElement | undefined;
    if (!p || !inner || !('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(() => { p.style.height = `${inner.scrollHeight}px`; });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [open, desktop]);

  /* focus into the opened panel: the search box, the calendar (Calendar focuses itself), or the first stepper */
  useEffect(() => {
    if (!open || open === 'dates') return;
    const p = panelRefs.current[open];
    const t = window.setTimeout(() => {
      const target = p?.querySelector<HTMLElement>('input[type="text"], .m-step__btn:not(:disabled), .m-opt input:checked');
      target?.focus({ preventScroll: true });
    }, desktop ? 60 : 160);
    return () => window.clearTimeout(t);
  }, [open, focusKey, desktop]);

  /* close on a click outside (1025 and up) and on Escape */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!desktop) return;
      const t = e.target as Node;
      if (!document.documentElement.contains(t) || cardRef.current?.contains(t)) return;
      close(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey, true); };
  }, [open, desktop, close]);
  useEffect(() => { close(false); }, [desktop, close]);
  useEffect(() => { close(false); setStatus({ text: '', error: false }); setInvalid(null); }, [s.tab, close]);

  /* ---- autoOpen (compact bar segments) and requestSearch() (Fly here, destination cards, nav, pre-footer) ---- */
  useEffect(() => {
    if (!autoOpen) return;
    const t = window.setTimeout(() => { fieldRefs.current[autoOpen]?.focus({ preventScroll: true }); openField(autoOpen); }, 80);
    return () => window.clearTimeout(t);
  }, [autoOpen, openField]);

  useEffect(() => {
    if (!listen) return;
    const on = (e: Event) => {
      const { mode, seg, message } = (e as CustomEvent<{ mode?: Tab; seg?: SearchSeg; message?: string }>).detail || {};
      if (mode && mode !== getSearch().tab) setSearch({ tab: mode });
      const card = cardRef.current;
      const far = card ? card.getBoundingClientRect().top < 0 || card.getBoundingClientRect().bottom > window.innerHeight : false;
      if (far) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      const go = () => {
        const cur = getSearch();
        const hasDates = !!cur.start && (cur.tab === 'flights' || !!cur.end);
        if (message) setStatus({ text: hasDates && seg === 'dates' ? message.split('. ')[0] + '.' : message, error: false });
        if (!seg) return;
        /* dates already chosen: the route changed, nothing else to ask */
        if (seg === 'dates' && hasDates) { fieldRefs.current.dates?.focus({ preventScroll: true }); return; }
        if (seg === 'go') { cardRef.current?.querySelector<HTMLButtonElement>('.m-search__go')?.focus({ preventScroll: true }); return; }
        if (seg === 'focus-from') { fieldRefs.current[getSearch().tab === 'flights' ? 'from' : 'dest']?.focus({ preventScroll: true }); return; }
        fieldRefs.current[seg]?.focus({ preventScroll: true });
        openField(seg);
      };
      window.setTimeout(go, far && !prefersReducedMotion() ? 650 : 30);
    };
    window.addEventListener(SEARCH_EVENT, on);
    return () => window.removeEventListener(SEARCH_EVENT, on);
  }, [listen, openField]);

  /* ---- picks ---- */
  function pickPlace(name: FieldName, p: Airport | City) {
    setInvalid(null); setStatus({ text: '', error: false });
    if (name === 'dest') setSearch({ dest: p as City });
    else {
      const a = p as Airport;
      setSearch((cur) => name === 'from'
        ? { from: a, to: cur.to && cur.to.city === a.city ? null : cur.to }
        : { to: a, from: cur.from && cur.from.city === a.city ? null : cur.from });
    }
    const cur = getSearch();
    const next: FieldName | null = name === 'from' ? (cur.to ? 'dates' : 'to') : 'dates';
    setOpen(null);
    if (next === 'dates' && cur.start && cur.end) { window.setTimeout(() => fieldRefs.current[name]?.focus({ preventScroll: true }), 0); return; }
    window.setTimeout(() => { fieldRefs.current[next!]?.focus({ preventScroll: true }); openField(next!); }, desktop ? 40 : 260);
  }
  function pickDay(d: Date) {
    setInvalid(null); setStatus({ text: '', error: false }); setSheetMsg('');
    const cur = getSearch();
    if (!cur.start || (cur.start && cur.end) || d < cur.start) setSearch({ start: d, end: null });
    else if (sameDay(d, cur.start)) setSearch({ end: null });
    else setSearch({ end: d });
  }
  function step(k: StepKey, by: number) {
    const cur = getSearch();
    const v = cur[k] + by;
    if (allowed(cur, k, v)) setSearch({ [k]: v } as Partial<typeof cur>);
  }

  /* ---- submit ---- */
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cur = getSearch();
    const miss = missing(cur);
    setOpen(null);
    if (miss) {
      setInvalid(miss.field);
      setStatus({ text: miss.message, error: true });
      const f = fieldRefs.current[miss.field];
      f?.focus();
      if (!desktop) openField(miss.field, miss.message);
      return;
    }
    setInvalid(null);
    setStatus({ text: submitStatus(cur), error: false });
    onSubmitted?.();
    const href = resultsHref(cur);
    /* round 3, Developer A: every search from a card feeds "Recommended for you" (lib/recent.ts) */
    const q = Object.fromEntries(new URLSearchParams(href.split('?')[1] || ''));
    addRecent(cur.tab === 'hotels'
      ? { kind: 'hotel-search', params: q, label: `Hotels in ${cur.dest?.name ?? ''}` }
      : { kind: 'flight-search', params: q, label: `${cur.from?.city ?? ''} to ${cur.to?.city ?? ''}` });
    router.push(href);
  }

  /* ---- render helpers ---- */
  const fieldProps = (name: FieldName) => ({
    ref: (el: HTMLButtonElement | null) => { fieldRefs.current[name] = el; },
    type: 'button' as const, id: fid(name), 'aria-expanded': open === name, 'aria-controls': pid(name),
    'aria-invalid': invalid === name ? true : undefined, 'aria-describedby': invalid === name ? `${uid}-status` : undefined,
    onClick: () => (open === name ? close() : openField(name))
  });
  const value = (text: string, empty: string) => <span className={`m-search__value${text ? '' : ' is-empty'}`}>{text || empty}</span>;
  const tab = s.tab;
  const sheetHead = (name: FieldName) => (
    <div className="m-panel__head"><p className="m-panel__title">{TITLES[name](tab)}</p><button type="button" className="a-roundx" onClick={() => close()} aria-label="Close"><Icon name="close" /></button></div>
  );
  const done = (clear?: () => void) => (
    <div className="m-panel__foot">
      {clear && <button type="button" className="a-textbtn" onClick={clear}>Clear</button>}
      <button type="button" className="m-panel__done" onClick={() => close()}>Done</button>
    </div>
  );
  const panel = (name: FieldName, body: React.ReactNode, foot: React.ReactNode, split = false) => (
    <div ref={(el) => { panelRefs.current[name] = el; }} className={`m-panel${open === name ? ' is-open' : ''}`} id={pid(name)} role="dialog" aria-modal={!desktop || undefined} aria-label={TITLES[name](tab)} inert={open !== name}
      onKeyDown={(e) => { if (!desktop && open === name) trapTab(e); /* group F: Tab stays inside the phone sheet (critic, home fix 3) */ }}>
      <div className="m-panel__in">
        {sheetHead(name)}
        <div className={`m-panel__body${split ? ' -split' : ''}`}>
          {sheetMsg && open === name && !desktop && <p className="m-panel__msg" role="alert">{sheetMsg}</p>}
          {body}
        </div>
        {foot}
      </div>
    </div>
  );

  return (
    <div className={`m-search${variant === 'drop' ? ' -drop' : ''}`} data-hero-card={variant === 'hero' || undefined}>
      <div ref={cardRef} className={`m-search__card${open && desktop ? ' is-open' : ''}`}>
        {tab === 'flights' ? (
          <form inert={!desktop && !!open} className="m-search__form" id={variant === 'hero' ? 'form-flights' : `${uid}-form-flights`} role={variant === 'hero' ? 'tabpanel' : undefined} aria-labelledby={variant === 'hero' ? 'tab-flights' : undefined} aria-label={variant === 'hero' ? undefined : 'Search flights'} noValidate onSubmit={submit}>
            <div className="m-search__fields -flights">
              <button className="m-search__field" {...fieldProps('from')}>
                <span className="m-search__label"><Icon name="pin" />From</span>{value(placeValue(s.from), 'City or airport')}
              </button>
              <button type="button" className={`m-search__swap${turned ? ' is-turned' : ''}`} aria-label="Swap From and To"
                onClick={() => { setSearch((c) => ({ from: c.to, to: c.from })); if (!prefersReducedMotion()) setTurned((t) => !t); }}><Icon name="swap" /></button>
              <button className="m-search__field -to" {...fieldProps('to')}>
                <span className="m-search__label"><Icon name="pin" />To</span>{value(placeValue(s.to), 'City or airport')}
              </button>
              <button className="m-search__field" {...fieldProps('dates')}>
                <span className="m-search__label"><Icon name="calendar" />Dates</span>{value(datesText(s), 'Add dates')}
              </button>
              <button className="m-search__field" {...fieldProps('party')}>
                <span className="m-search__label"><Icon name="users" />Travelers</span>{value(partyText(s), '')}
              </button>
            </div>
            <button className="m-search__go" type="submit"><Icon name="search" />Search flights</button>
          </form>
        ) : (
          <form inert={!desktop && !!open} className="m-search__form" id={variant === 'hero' ? 'form-hotels' : `${uid}-form-hotels`} role={variant === 'hero' ? 'tabpanel' : undefined} aria-labelledby={variant === 'hero' ? 'tab-hotels' : undefined} aria-label={variant === 'hero' ? undefined : 'Search hotels'} noValidate onSubmit={submit}>
            <div className="m-search__fields">
              <button className="m-search__field" {...fieldProps('dest')}>
                <span className="m-search__label"><Icon name="pin" />Destination</span>{value(s.dest ? s.dest.name : '', 'City or area')}
              </button>
              <button className="m-search__field" {...fieldProps('dates')}>
                <span className="m-search__label"><Icon name="calendar" />Check in and out</span>{value(datesText(s), 'Add dates')}
              </button>
              <button className="m-search__field" {...fieldProps('rooms')}>
                <span className="m-search__label"><Icon name="users" />Guests and rooms</span>{value(roomsText(s), '')}
              </button>
            </div>
            <button className="m-search__go" type="submit"><Icon name="search" />Search hotels</button>
          </form>
        )}

        {tab === 'flights' && panel('from', <PlaceList kind="airport" name="from" uid={uid} selected={s.from?.code} reset={open === 'from' ? focusKey : -1} onPick={(p) => pickPlace('from', p)} />, done(() => setSearch({ from: null })))}
        {tab === 'flights' && panel('to', <PlaceList kind="airport" name="to" uid={uid} selected={s.to?.code} reset={open === 'to' ? focusKey : -1} onPick={(p) => pickPlace('to', p)} />, done(() => setSearch({ to: null })))}
        {tab === 'hotels' && panel('dest', <PlaceList kind="city" name="dest" uid={uid} selected={s.dest?.id} reset={open === 'dest' ? focusKey : -1} onPick={(p) => pickPlace('dest', p)} />, done(() => setSearch({ dest: null })))}
        {panel('dates', <>
          {open === 'dates' && <Calendar start={s.start} end={s.end} kind={tab} focusKey={focusKey} onPick={pickDay} />}
          <p className="m-cal__hint" aria-live="polite">{calHint(s)}</p>
        </>, done(() => setSearch({ start: null, end: null })))}
        {tab === 'flights' && panel('party', <>
          <div>
            <div className="m-steps">
              <Stepper k="adults" name="Adults" help="12 and over" s={s} step={step} more="More adults" fewer="Fewer adults" />
              <Stepper k="children" name="Children" help="2 to 11" s={s} step={step} more="More children" fewer="Fewer children" />
              <Stepper k="infants" name="Infants" help="Under 2, on a lap" s={s} step={step} more="More infants" fewer="Fewer infants" />
            </div>
            <p className="m-steps__note" aria-live="polite">{partyNote(s)}</p>
          </div>
          <fieldset className="m-opts">
            <legend>Cabin class</legend>
            {CABINS.map((c) => (
              <label className="m-opt" key={c.value}><input type="radio" name={`${uid}-cabin`} value={c.value} checked={s.cabin === c.value} onChange={() => setSearch({ cabin: c.value })} />{c.label}</label>
            ))}
          </fieldset>
        </>, done(), true)}
        {tab === 'hotels' && panel('rooms', <>
          <div className="m-steps -row">
            <Stepper k="guests" name="Adults" help="18 and over" s={s} step={step} more="More adults" fewer="Fewer adults" />
            <Stepper k="kids" name="Children" help="0 to 17" s={s} step={step} more="More children" fewer="Fewer children" />
            <Stepper k="rooms" name="Rooms" help="Up to one per adult" s={s} step={step} more="More rooms" fewer="Fewer rooms" />
          </div>
          <p className="m-steps__note">Up to 8 rooms and 16 guests in one search.</p>
        </>, done())}
      </div>
      <p className={`m-search__status${status.error ? ' is-error' : ''}`} id={`${uid}-status`} role="status" aria-live="polite">{status.text}</p>
    </div>
  );
}

/* copy.md: Field panels, Dates hints */
function calHint(s: ReturnType<typeof getSearch>): string {
  if (s.tab === 'flights') {
    if (!s.start) return 'Choose your outbound date';
    if (!s.end) return 'Now choose your return date, or press Done for a one-way trip';
    return `${short(s.start)} to ${short(s.end)}, return`;
  }
  if (!s.start) return 'Choose your check-in date';
  if (!s.end) return 'Now choose your check-out date';
  const k = nights(s.start, s.end);
  return `${short(s.start)} to ${short(s.end)}, ${k} ${k === 1 ? 'night' : 'nights'}`;
}
function partyNote(s: ReturnType<typeof getSearch>): string {
  if (s.adults + s.children + s.infants >= 9) return "That's 9 travelers, the most you can book at once.";
  if (s.infants >= s.adults && s.infants > 0) return "Each infant travels on an adult's lap, so add an adult first.";
  return 'Up to 9 travelers, and one infant per adult.';
}

function Stepper({ k, name, help, s, step, more, fewer }: { k: StepKey; name: string; help: string; s: ReturnType<typeof getSearch>; step: (k: StepKey, by: number) => void; more: string; fewer: string }) {
  const lab = `lab-${k}`;
  return (
    <div className="m-step">
      <span><span className="m-step__name" id={lab}>{name}</span><span className="m-step__help">{help}</span></span>
      <span className="m-step__ctrl">
        <button type="button" className="m-step__btn" aria-label={fewer} disabled={!allowed(s, k, s[k] - 1)} onClick={() => step(k, -1)}><Icon name="minus" /></button>
        <span className="m-step__n" aria-live="polite" aria-labelledby={lab}>{s[k]}</span>
        <button type="button" className="m-step__btn" aria-label={more} disabled={!allowed(s, k, s[k] + 1)} onClick={() => step(k, 1)}><Icon name="plus" /></button>
      </span>
    </div>
  );
}

/* ---- place list: a combobox over the built-in places, plus the supplier's airport suggestions ----
   Airports: the built-in list answers at once; from two typed characters /api/places adds every
   airport the supplier knows (Duffel's place suggestions), merged after the built-in matches.
   Cities: the curated hotel cities; Duffel's test hotels only while Duffel runs in test mode. */
type PlaceItem = { key: string; name: string; meta: string; code?: string; value: Airport | City };
type Suggestion = { code: string; name: string; city: string; country: string; type: 'airport' | 'city' };
const SHOW_TEST_CITIES = process.env.NEXT_PUBLIC_SUPPLY === 'duffel-test';
function PlaceList({ kind, name, uid, selected, reset, onPick }: { kind: 'airport' | 'city'; name: string; uid: string; selected?: string; reset: number; onPick: (p: Airport | City) => void }) {
  const [q, setQ] = useState('');
  const [remote, setRemote] = useState<Airport[]>([]);
  const [looking, setLooking] = useState(false);
  useEffect(() => { if (reset >= 0) setQ(''); }, [reset]);
  useEffect(() => {
    const t = q.trim();
    if (kind !== 'airport' || t.length < 2) { setRemote([]); setLooking(false); return; }
    const ctl = new AbortController();
    setLooking(true);
    const timer = window.setTimeout(() => {
      api<{ places: Suggestion[] }>(`/api/places?q=${encodeURIComponent(t)}&type=airport`, { signal: ctl.signal }).then((r) => {
        if (ctl.signal.aborted) return;
        setLooking(false);
        setRemote((r.data?.places ?? []).filter((p) => p.type === 'airport').map((p) => ({ code: p.code, name: p.name, city: p.city, country: p.country })));
      });
    }, 200);
    return () => { ctl.abort(); window.clearTimeout(timer); };
  }, [q, kind]);
  const listId = `${uid}-list-${name}`, groupId = `${uid}-group-${name}`;
  const items: PlaceItem[] = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (kind === 'city') {
      return CITIES.filter((c) => (!c.testOnly || SHOW_TEST_CITIES) && (!t || c.name.toLowerCase().startsWith(t) || c.name.toLowerCase().includes(` ${t}`) || c.country.toLowerCase().startsWith(t)))
        .map((c) => ({ key: c.id, name: c.name, meta: c.country, value: c }));
    }
    const local = AIRPORTS.filter((a) => !t || a.city.toLowerCase().startsWith(t) || a.code.toLowerCase() === t || a.name.toLowerCase().startsWith(t) || a.name.toLowerCase().includes(` ${t}`) || a.country.toLowerCase().startsWith(t));
    const more = remote.filter((a) => !local.some((x) => x.code === a.code));
    return [...local, ...more].map((a) => ({ key: a.code, name: a.name, meta: [a.city, a.country].filter(Boolean).join(', '), code: a.code, value: a }));
  }, [q, kind, remote]);
  const listRef = useRef<HTMLUListElement>(null);
  const clean = q.replace(/[<>&"]/g, '');
  return (
    <>
      <label className="m-panel__find">
        <Icon name="search" />
        <span className="sr-only">{kind === 'city' ? 'City or area' : 'City or airport'}</span>
        <input type="text" placeholder={kind === 'city' ? 'City or area' : 'City or airport'} autoComplete="off" role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); listRef.current?.querySelector<HTMLButtonElement>('.m-place')?.focus(); }
            if (e.key === 'Enter') { e.preventDefault(); if (items[0]) onPick(items[0].value); }
          }} />
      </label>
      <p className="m-panel__group" id={groupId}>{kind === 'city' ? 'Cities' : 'Cities and airports'}</p>
      <ul className="m-places" id={listId} role="listbox" aria-labelledby={groupId} ref={listRef}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          const bs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('.m-place') || []);
          const i = bs.indexOf(document.activeElement as HTMLButtonElement);
          if (i < 0) return;
          e.preventDefault();
          const nx = bs[i + (e.key === 'ArrowDown' ? 1 : -1)];
          if (nx) nx.focus(); else if (e.key === 'ArrowUp') (listRef.current?.parentElement?.querySelector('input') as HTMLInputElement | null)?.focus();
        }}>
        {items.length ? items.map((p) => (
          <li key={p.key} role="presentation">
            <button type="button" className="m-place" role="option" aria-selected={selected === p.key} onClick={() => onPick(p.value)}>
              <span className="m-place__tile" aria-hidden="true"><Icon name={kind === 'city' ? 'pin' : 'plane'} /></span>
              <span><span className="m-place__name">{p.name}</span><span className="m-place__meta">{p.meta}</span></span>
              {p.code && <span className="m-place__code">{p.code}</span>}
            </button>
          </li>
        )) : looking ? (
          <li className="m-places__none" role="status">Looking up airports</li>
        ) : (
          <li className="m-places__none">{kind === 'city' ? `No cities match "${clean}". Check the spelling.` : `No places match "${clean}". Check the spelling or type a three-letter airport code.`}</li>
        )}
      </ul>
    </>
  );
}
