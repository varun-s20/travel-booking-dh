/* =====================================================================
   Landfall (working name, a placeholder): pinned compact search (Kasa)
   860 x 52 at 1440 with three segments (route, dates, party) and a 44px
   navy icon button; one 52px pill below 1025 (route in bold, dates and
   party under it). Header.tsx's scroll job shows, hides and docks it
   (data-compact): floating at 24 with the header hidden, docked at 74
   under the header with the header's white strip behind it.
   - mode 'home': appears once the hero card and photo have gone; a
     segment scrolls back to the hero card and opens that field.
   - mode 'page' (inner pages): always shown. Pass the page's search
     (flights={FlightSearch} or stays={StaySearch}); a segment opens the
     search in place: the card drops from the bar at 1025 and up, a
     full-screen sheet below. It also answers requestSearch() from
     lib/client.ts ("Change dates" buttons on results and hotel pages).
   Inner pages wrap their content in <div className="t-page -search">.
   ===================================================================== */
'use client';
import { useEffect, useRef, useState } from 'react';
import { MQ_DESKTOP, SEARCH_EVENT, requestSearch, useMedia, type SearchSeg } from '@/lib/client';
import type { FlightSearch } from '@/lib/travel/flights';
import type { StaySearch } from '@/lib/travel/hotels';
import Icon from '@/components/ui/Icon';
import Dialog from '@/components/ui/Dialog';
import SearchCard from './SearchCard';
import {
  compactDates, compactLine, compactParty, compactSpoken, datesSpoken, flightsState, routeText, seedFlights, seedStays, setSearch,
  staysState, useSearch, type FieldName, type SearchState
} from './store';

/* dateless (final pass): a hotel page reached without dates (/hotels?place=lisbon) shows "Hotels in Lisbon" and "Add dates",
   not the dates the server filled in for its own defaults */
type Props = { mode?: 'home' | 'page'; flights?: FlightSearch; stays?: StaySearch; dateless?: boolean };

export default function CompactSearch({ mode = 'page', flights, stays, dateless = false }: Props) {
  const live = useSearch();
  const [seeded, setSeeded] = useState(!flights && !stays);
  const fromProps: SearchState | null = flights ? flightsState(flights) : stays ? { ...staysState(stays), ...(dateless ? { start: null, end: null } : {}) } : null;
  const s = seeded || !fromProps ? live : fromProps;
  const desktop = useMedia(MQ_DESKTOP, true);
  const [drop, setDrop] = useState<{ field: FieldName | null } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  /* seed the shared store from the page's search */
  useEffect(() => {
    if (flights) seedFlights(flights);
    else if (stays && dateless) setSearch({ ...staysState(stays), start: null, end: null });
    else if (stays) seedStays(stays);
    setSeeded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flights && JSON.stringify(flights), stays && JSON.stringify(stays), dateless]);

  const fieldFor = (k: 'route' | 'dates' | 'party'): FieldName =>
    k === 'route' ? (s.tab === 'flights' ? 'to' : 'dest') : k === 'party' ? (s.tab === 'flights' ? 'party' : 'rooms') : 'dates';

  function go(k: 'route' | 'dates' | 'party' | 'go') {
    if (mode === 'home') {
      requestSearch(s.tab, k === 'go' ? 'go' : fieldFor(k));
      return;
    }
    setDrop({ field: k === 'go' ? null : fieldFor(k) });
  }

  /* inner pages: answer requestSearch() by opening the search in place */
  useEffect(() => {
    if (mode !== 'page') return;
    const on = (e: Event) => {
      const { mode: m, seg } = (e as CustomEvent<{ mode?: 'flights' | 'hotels'; seg?: SearchSeg }>).detail || {};
      if (m) setSearch({ tab: m });
      setDrop({ field: seg && seg !== 'go' && seg !== 'focus-from' ? seg : null });
    };
    window.addEventListener(SEARCH_EVENT, on);
    return () => window.removeEventListener(SEARCH_EVENT, on);
  }, [mode]);

  /* the drop at 1025 and up closes on Escape and on a click outside */
  useEffect(() => {
    if (!drop || !desktop) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDrop(null); requestAnimationFrame(() => wrap.current?.querySelector<HTMLButtonElement>('.m-compact__go')?.focus()); } };
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (t === wrap.current || (document.documentElement.contains(t) && !wrap.current?.contains(t))) setDrop(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [drop, desktop]);

  const route = routeText(s);
  const empty = route === 'Where to?' || route === 'Which city?';
  const party = compactParty(s);
  const goLabel = mode === 'home' ? 'Go to the search' : 'Change search';
  const partyName = s.tab === 'flights' ? 'Change travelers' : 'Change guests and rooms';

  return (
    <div ref={wrap} className={`m-compact${mode === 'page' ? ' is-shown is-docked' : ''}${mode === 'page' && drop && desktop ? ' is-open' : ''}`} data-compact={mode} role="region" aria-label="Your search">
      <div className="m-compact__bar">
        <button type="button" className={`m-compact__seg${empty ? ' is-empty' : ''}`} aria-label={`Change route, ${route}`} onClick={() => go('route')}><Icon name="pin" /><span>{route}</span></button>
        <button type="button" className={`m-compact__seg${s.start ? '' : ' is-empty'}`} aria-label={`Change dates, ${datesSpoken(s)}`} onClick={() => go('dates')}><Icon name="calendar" /><span>{compactDates(s)}</span></button>
        <button type="button" className="m-compact__seg" aria-label={`${partyName}, ${party}`} onClick={() => go('party')}><Icon name="users" /><span>{party}</span></button>
        <button type="button" className="m-compact__one" aria-label={compactSpoken(s)} onClick={() => go('route')}><b>{route}</b><span>{compactLine(s)}</span></button>
        <button type="button" className="m-compact__go" aria-label={goLabel} onClick={() => go('go')}><Icon name="search" /></button>
      </div>
      {mode === 'page' && drop && desktop && (
        <div className="m-compact__drop">
          <SearchCard variant="drop" autoOpen={drop.field} onSubmitted={() => setDrop(null)} />
        </div>
      )}
      {mode === 'page' && !desktop && (
        <Dialog open={!!drop} onClose={() => setDrop(null)} title="Your search" sheet>
          {drop && <SearchCard variant="drop" autoOpen={drop.field} onSubmitted={() => setDrop(null)} />}
        </Dialog>
      )}
    </div>
  );
}
