'use client';
/* =====================================================================
   Travelers and cabin (flights) or guests and rooms (hotels): Hipcamp's
   stepper rows, The Hoxton's cabin pills. Limits follow Duffel: at most
   9 seated passengers and one lap infant per adult; one room needs an
   adult. When a limit is reached the line from content/copy.md shows
   under the steppers. A button that becomes disabled hands focus to
   its partner, so keyboard focus is never lost.
   ===================================================================== */
import { useRef } from 'react';
import { Icon } from '@/components/Icon';

import { CABINS, type Cabin } from '@/lib/cabins';
export { CABINS, type Cabin };

export type Counts = Record<string, number>;

type Row = { key: string; title: string; help: string; add: string; remove: string; min: number; max: number };

function rowsFor(kind: 'flights' | 'hotels', c: Counts): Row[] {
  if (kind === 'flights') {
    return [
      { key: 'adults', title: 'Adults', help: 'Ages 12 or above', add: 'Add an adult', remove: 'Remove an adult', min: Math.max(1, c.infants), max: Math.min(9, 9 - c.children) },
      { key: 'children', title: 'Children', help: 'Ages 2 to 11', add: 'Add a child', remove: 'Remove a child', min: 0, max: Math.min(8, 9 - c.adults) },
      { key: 'infants', title: 'Infants', help: 'Under 2, on a lap', add: 'Add an infant', remove: 'Remove an infant', min: 0, max: Math.min(4, c.adults) }
    ];
  }
  return [
    { key: 'adults', title: 'Adults', help: 'Ages 18 or above', add: 'Add an adult', remove: 'Remove an adult', min: Math.max(1, c.rooms), max: 8 },
    { key: 'children', title: 'Children', help: 'Ages 0 to 17', add: 'Add a child', remove: 'Remove a child', min: 0, max: 6 },
    { key: 'rooms', title: 'Rooms', help: 'Up to one per adult', add: 'Add a room', remove: 'Remove a room', min: 1, max: Math.min(4, c.adults) }
  ];
}

function plural(n: number, one: string, many: string) { return `${n} ${n === 1 ? one : many}`; }

/* Short enough for the cell: "2 adults" alone, "3 travelers" once children or infants join (prototype round 2) */
export function whoValue(kind: 'flights' | 'hotels', c: Counts, cabin?: Cabin): string {
  if (kind === 'flights') {
    const all = c.adults + c.children + c.infants;
    const who = c.children || c.infants ? plural(all, 'traveler', 'travelers') : plural(c.adults, 'adult', 'adults');
    return `${who}, ${CABINS.find((x) => x.value === cabin)?.short ?? 'Economy'}`;
  }
  const parts = [plural(c.adults, 'adult', 'adults')];
  if (c.children) parts.push(plural(c.children, 'child', 'children'));
  parts.push(plural(c.rooms, 'room', 'rooms'));
  return parts.join(', ');
}

type Props = {
  kind: 'flights' | 'hotels';
  idPrefix: string;
  counts: Counts;
  cabin?: Cabin;
  onCounts: (c: Counts) => void;
  onCabin?: (c: Cabin) => void;
  onDone: () => void;
};

export function People({ kind, idPrefix, counts, cabin, onCounts, onCabin, onDone }: Props) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rows = rowsFor(kind, counts);

  function step(row: Row, by: number) {
    const v = Math.min(Math.max(counts[row.key] + by, row.min), row.max);
    if (v === counts[row.key]) return;
    const next = { ...counts, [row.key]: v };
    onCounts(next);
    /* if this button just hit its limit, move focus to the other one */
    const after = rowsFor(kind, next).find((r) => r.key === row.key)!;
    const hit = by > 0 ? v >= after.max : v <= after.min;
    if (hit) requestAnimationFrame(() => refs.current[`${row.key}${by > 0 ? '-' : '+'}`]?.focus());
  }

  const notes: string[] = [];
  if (kind === 'flights') {
    if (counts.adults + counts.children >= 9) notes.push('You can book for up to 9 travelers at a time.');
    if (counts.infants > 0 && counts.infants >= counts.adults) notes.push('Each infant travels on an adult’s lap, so add an adult first.');
  }

  return (
    <>
      {rows.map((r) => (
        <div className="m-stepper" key={r.key}>
          <div>
            <p className="m-stepper__title" id={`${idPrefix}-${r.key}-t`}>{r.title}</p>
            <p className="m-stepper__help">{r.help}</p>
          </div>
          <div className="m-stepper__ctrl">
            <button ref={(el) => { refs.current[`${r.key}-`] = el; }} className="a-round m-stepper__btn" type="button" aria-label={r.remove} disabled={counts[r.key] <= r.min} onClick={() => step(r, -1)}>
              <Icon name="minus" size="s" />
            </button>
            <output className="m-stepper__count" aria-labelledby={`${idPrefix}-${r.key}-t`} aria-live="polite">{counts[r.key]}</output>
            <button ref={(el) => { refs.current[`${r.key}+`] = el; }} className="a-round m-stepper__btn" type="button" aria-label={r.add} disabled={counts[r.key] >= r.max} onClick={() => step(r, 1)}>
              <Icon name="plus" size="s" />
            </button>
          </div>
          <input type="hidden" name={r.key} value={counts[r.key]} />
        </div>
      ))}
      <div aria-live="polite">
        {notes.map((n) => (
          <p className="m-stepper__note" key={n}><Icon name="info" size="s" />{n}</p>
        ))}
      </div>
      {kind === 'flights' && onCabin && (
        <fieldset className="m-choices">
          <legend className="m-pop__sub">Cabin</legend>
          {CABINS.map((c) => (
            <label className="a-choice" key={c.value}>
              <input className="a-choice__input" type="radio" name="cabin" value={c.value} checked={cabin === c.value} onChange={() => onCabin(c.value)} />
              {c.label}
            </label>
          ))}
        </fieldset>
      )}
      <div className="m-pop__foot">
        <span />
        <button className="a-button -small -steady" type="button" onClick={onDone}><span className="a-button__label">Done</span></button>
      </div>
    </>
  );
}
