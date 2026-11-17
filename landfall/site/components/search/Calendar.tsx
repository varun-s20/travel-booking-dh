/* =====================================================================
   Landfall (working name, a placeholder): range calendar (Kasa)
   Two months, side by side from 641px and stacked below; 40px day circles, navy ends, mist
   range, past days off, today ringed; one tab stop with arrow keys
   (Left/Right a day, Up/Down a week, crossing months). Day names follow
   copy.md: "Friday, November 20, 2026", plus ", outbound" / ", return"
   (hotels ", check-in" / ", check-out"), ", today", ", unavailable".
   ===================================================================== */
'use client';
import { useEffect, useRef, useState } from 'react';
import { addDays, BOOK_AHEAD_DAYS, longLabel, MONTHS, sameDay, today as todayFn } from '@/lib/dates';
import Icon from '@/components/ui/Icon';

type Props = { start: Date | null; end: Date | null; onPick: (d: Date) => void; kind: 'flights' | 'hotels'; focusKey: number };

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function Calendar({ start, end, onPick, kind, focusKey }: Props) {
  const today = todayFn();
  const last = addDays(today, BOOK_AHEAD_DAYS);
  const [view, setView] = useState(() => { const d = start || today; return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [active, setActive] = useState<Date>(() => start || today);
  const root = useRef<HTMLDivElement>(null);
  const wantFocus = useRef(false);

  /* focus the picked or first open day when the panel opens */
  useEffect(() => {
    const d = start || today;
    setActive(d);
    setView(new Date(d.getFullYear(), d.getMonth(), 1));
    wantFocus.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);
  /* the request stays until the focus lands: a re-render in between (view or active change) reschedules it */
  useEffect(() => {
    if (!wantFocus.current) return;
    const t = window.setTimeout(() => {
      const day = root.current?.querySelector<HTMLButtonElement>('[tabindex="0"]');
      if (day) { day.focus({ preventScroll: true }); wantFocus.current = false; }
    }, 60);
    return () => window.clearTimeout(t);
  });

  /* two months: side by side from 641px, stacked below (spec 4, critic 2026-11-11) */
  const months = [view, new Date(view.getFullYear(), view.getMonth() + 1, 1)];
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const ends = kind === 'flights' ? [', outbound', ', return'] : [', check-in', ', check-out'];
  /* one tab stop: the active day, or the first open day when the months shown don't hold it */
  const activeIn = months.some((m) => m.getMonth() === active.getMonth() && m.getFullYear() === active.getFullYear());
  const stop = activeIn ? active : (view < today ? today : view);

  function move(d: Date) {
    if (d < today || d > last) return;
    setActive(d);
    const shown = months.some((m) => m.getMonth() === d.getMonth() && m.getFullYear() === d.getFullYear());
    if (!shown) setView(new Date(d.getFullYear(), d.getMonth() - (d > view ? 1 : 0), 1));
    wantFocus.current = true;
  }
  function onKey(e: React.KeyboardEvent) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map)) return;
    e.preventDefault();
    move(addDays(active, map[e.key]));
  }

  return (
    <div className="m-cal" ref={root} onKeyDown={onKey}>
      {months.map((m, mi) => {
        const y = m.getFullYear(), mo = m.getMonth();
        const lead = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
        const capId = `cap-${kind}-${mi}`;
        return (
          <div className="m-cal__month" key={`${y}-${mo}`}>
            <p className="m-cal__cap" id={capId}>{MONTHS[mo]} {y}</p>
            {mi === 0 && <button type="button" className="m-cal__nav -prev" aria-label="Previous month" disabled={m <= firstMonth} onClick={() => setView(new Date(y, mo - 1, 1))}><Icon name="chev-l" /></button>}
            {mi === months.length - 1 && <button type="button" className="m-cal__nav -next" aria-label="Next month" disabled={new Date(y, mo + 1, 1) > last} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}><Icon name="chev-r" /></button>}
            <div className="m-cal__grid" role="group" aria-labelledby={capId}>
              {DOW.map((d) => <span className="m-cal__dow" aria-hidden="true" key={d}>{d}</span>)}
              {Array.from({ length: lead }, (_, i) => <span className="m-cal__cell" aria-hidden="true" key={`b${i}`} />)}
              {Array.from({ length: days }, (_, i) => {
                const dt = new Date(y, mo, i + 1);
                const off = dt < today || dt > last;
                const isStart = sameDay(dt, start), isEnd = sameDay(dt, end);
                const cls = ['m-cal__cell', start && end && dt > start && dt < end ? 'is-between' : '', isStart && end ? 'is-start' : '', isEnd ? 'is-end' : ''].filter(Boolean).join(' ');
                const label = longLabel(dt) + (isStart ? ends[0] : '') + (isEnd ? ends[1] : '') + (sameDay(dt, today) ? ', today' : '') + (off ? ', unavailable' : '');
                return (
                  <span className={cls} key={i}>
                    <button type="button" className={['m-cal__day', isStart || isEnd ? 'is-picked' : '', sameDay(dt, today) ? 'is-today' : ''].filter(Boolean).join(' ')}
                      disabled={off} aria-pressed={isStart || isEnd} aria-label={label} tabIndex={sameDay(dt, stop) ? 0 : -1}
                      onClick={() => { setActive(dt); onPick(dt); wantFocus.current = true; }}>{i + 1}</button>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
