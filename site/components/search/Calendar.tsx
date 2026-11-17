'use client';
/* =====================================================================
   Range calendar (Hipcamp's: deep ends, tint band between), two months.
   Ported from the approved prototype:
   - the band stops at a row's edge with a round end, never poking past
     a Saturday start or a Sunday end (round 3, critic);
   - one way parks the return date and switching back restores it
     (the parent keeps the parked date, round 3);
   - the hint keeps its own line and ends with the dates and the night
     count (round 2);
   - arrow keys move a single tab stop around the days.
   Hint and value wording: content/copy.md, Search.
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { Toggle } from '@/components/search/Toggle';
import { BOOK_AHEAD_DAYS, DAYS, MONTHS, addDays, iso, longLabel, nights, range, sameDay, short, today } from '@/lib/dates';

export type Trip = 'return' | 'oneway';

type Props = {
  kind: 'flights' | 'hotels';
  idPrefix: string;
  start: Date | null;
  end: Date | null;
  trip?: Trip;
  onChange: (start: Date | null, end: Date | null) => void;
  onTrip?: (t: Trip) => void;
  onDone: () => void;
};

const MONTH_COUNT = 2;

function firstOf(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }

export function hintFor(kind: 'flights' | 'hotels', start: Date | null, end: Date | null, single: boolean): string {
  const n = start && end ? nights(start, end) : 0;
  const stay = n === 0 ? 'same day' : `${n} ${n === 1 ? 'night' : 'nights'}`;
  if (kind === 'hotels') return !start ? 'Choose your check-in date' : !end ? 'Now choose your check-out date' : `${range(start, end)}, ${stay}`;
  if (!start) return 'Choose your departure date';
  if (single) return `Departing ${DAYS[start.getDay()]}, ${short(start)}`;
  return !end ? 'Now choose your return date' : `${range(start, end)}, ${stay}`;
}

/* Mounted only while its popover is open (components/search/Search.tsx),
   so each opening starts on the chosen start's month, and today's date
   is read in the browser, never during server rendering. */
export function Calendar({ kind, idPrefix, start, end, trip, onChange, onTrip, onDone }: Props) {
  const single = trip === 'oneway';
  const t0 = today();
  const last = addDays(t0, BOOK_AHEAD_DAYS);
  const [view, setView] = useState(() => firstOf(start || t0));
  const [hover, setHover] = useState<Date | null>(null);
  const [focusDay, setFocusDay] = useState<Date | null>(null);
  const moveFocus = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const minNights = kind === 'hotels' ? 1 : 0;

  /* keyboard moves land focus on the new day once it has rendered */
  useEffect(() => {
    if (!moveFocus.current || !focusDay) return;
    moveFocus.current = false;
    bodyRef.current?.querySelector<HTMLButtonElement>(`[data-day="${iso(focusDay)}"]`)?.focus();
  }, [focusDay, view]);

  const lastShown = new Date(view.getFullYear(), view.getMonth() + MONTH_COUNT, 0);
  const rangeEnd = single ? null : end || (start && hover && hover > start ? hover : null);

  function pick(d: Date) {
    if (single) onChange(d, null);
    else if (!start || end || d < start || (minNights && sameDay(d, start))) {
      if (start && !end && minNights && sameDay(d, start)) return;
      onChange(d, null);
    } else onChange(start, d);
    setHover(null);
    setFocusDay(d);
  }

  function shift(n: number) {
    const v = new Date(view.getFullYear(), view.getMonth() + n, 1);
    setView(v);
    if (focusDay) {
      const lastV = new Date(v.getFullYear(), v.getMonth() + MONTH_COUNT, 0);
      if (focusDay < v || focusDay > lastV) setFocusDay(null);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.m-cal__day');
    if (!b) return;
    const step = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<string, number>)[e.key];
    if (!step) return;
    e.preventDefault();
    const [y, m, dd] = (b.dataset.day || '').split('-').map(Number);
    const d = addDays(new Date(y, m - 1, dd), step);
    if (d < t0 || d > last) return;
    if (d < view) setView(firstOf(d));
    else if (d > lastShown) setView(new Date(d.getFullYear(), d.getMonth() - MONTH_COUNT + 1, 1));
    moveFocus.current = true;
    setFocusDay(d);
  }

  /* one tab stop: the focused day, else the chosen start, else the first open day */
  const shownDays: Date[] = [];
  for (let m = 0; m < MONTH_COUNT; m++) {
    const first = new Date(view.getFullYear(), view.getMonth() + m, 1);
    const n = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= n; d++) shownDays.push(new Date(first.getFullYear(), first.getMonth(), d));
  }
  const enabled = (d: Date) => d >= t0 && d <= last;
  const tabbable =
    shownDays.find((d) => enabled(d) && sameDay(d, focusDay)) ||
    shownDays.find((d) => enabled(d) && sameDay(d, start)) ||
    shownDays.find(enabled) || null;

  function month(m: number) {
    const first = new Date(view.getFullYear(), view.getMonth() + m, 1);
    const titleId = `${idPrefix}-${iso(first)}`;
    const n = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first.getDay(); i++) cells.push(<span key={`b${i}`} className="m-cal__cell" />);
    for (let dn = 1; dn <= n; dn++) {
      const d = new Date(first.getFullYear(), first.getMonth(), dn);
      const isStart = sameDay(d, start);
      const isEnd = !single && sameDay(d, end);
      let inBand = !single && !!start && !!rangeEnd && d >= start && d <= rangeEnd;
      if (inBand && ((isStart && d.getDay() === 6) || (sameDay(d, rangeEnd) && d.getDay() === 0))) inBand = false;
      const cls = ['m-cal__cell'];
      if (inBand && !sameDay(start, rangeEnd)) cls.push('is-band');
      if (d.getDay() === 0 || dn === 1) cls.push('is-rowStart');
      if (d.getDay() === 6 || dn === n) cls.push('is-rowEnd');
      if (isStart) cls.push('is-start');
      if (rangeEnd && sameDay(d, rangeEnd)) cls.push('is-end');
      let label = longLabel(d);
      if (isStart) label += kind === 'hotels' ? ', check-in' : ', departure';
      if (isEnd) label += kind === 'hotels' ? ', check-out' : ', return';
      if (sameDay(d, t0)) label += ', today';
      cells.push(
        <span key={dn} className={cls.join(' ')}>
          <button
            type="button"
            className={`m-cal__day${sameDay(d, t0) ? ' is-today' : ''}`}
            data-day={iso(d)}
            disabled={!enabled(d)}
            tabIndex={tabbable && sameDay(d, tabbable) ? 0 : -1}
            aria-pressed={isStart || isEnd}
            aria-label={label}
            /* no focus() on pick: a pointer pick leaves no keyboard ring on the day */
            onClick={() => pick(d)}
          >
            {dn}
          </button>
        </span>
      );
    }
    return (
      <div key={titleId}>
        <h3 className="m-cal__title" id={titleId}>{MONTHS[first.getMonth()]} {first.getFullYear()}</h3>
        <div className="m-cal__grid" role="group" aria-labelledby={titleId}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => (
            <span key={i} className="m-cal__dow" aria-hidden="true" title={DAYS[i]}>{x}</span>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  const prevDisabled = view.getFullYear() === t0.getFullYear() && view.getMonth() === t0.getMonth();
  const nextDisabled = new Date(view.getFullYear(), view.getMonth() + MONTH_COUNT, 1) > last;

  return (
    <div className="m-cal">
      <div className="m-cal__top">
        {kind === 'flights' && trip && onTrip && (
          <Toggle
            small
            label="Trip type"
            value={trip}
            onChange={onTrip}
            options={[{ value: 'return', label: 'Return' }, { value: 'oneway', label: 'One way' }]}
          />
        )}
        <p className="m-cal__hint" aria-live="polite">{hintFor(kind, start, end, single)}</p>
      </div>
      <div
        className="m-cal__body"
        ref={bodyRef}
        onKeyDown={onKeyDown}
        onMouseOver={(e) => {
          if (!start || end || single) return;
          const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.m-cal__day');
          const ds = b && !b.disabled ? b.dataset.day : null;
          if (!ds) { if (hover) setHover(null); return; }
          const [y, m, dd] = ds.split('-').map(Number);
          const d = new Date(y, m - 1, dd);
          if (!sameDay(d, hover)) setHover(d);
        }}
        onMouseLeave={() => { if (hover) setHover(null); }}
      >
        <button type="button" className="a-round m-cal__nav -prev" aria-label="Previous month" disabled={prevDisabled} onClick={() => shift(-1)}><Icon name="chev-left" /></button>
        <button type="button" className="a-round m-cal__nav -next" aria-label="Next month" disabled={nextDisabled} onClick={() => shift(1)}><Icon name="chev-right" /></button>
        <div className="m-cal__months">{Array.from({ length: MONTH_COUNT }, (_, m) => month(m))}</div>
      </div>
      <div className="m-pop__foot">
        <button className="a-link" type="button" disabled={!start} onClick={() => { onChange(null, null); setFocusDay(null); setHover(null); }}>Clear dates</button>
        <button className="a-button -small -steady" type="button" onClick={onDone}><span className="a-button__label">Done</span></button>
      </div>
    </div>
  );
}
