/* =====================================================================
   The itinerary as a vertical timeline (spec 2b, flight details): for
   each leg a heading with its side note, then departure, the flight
   (airline, number, aircraft, cabin) and arrival on one line with dots,
   layover rows in tint between flights. Used on the details page, the
   confirmation and the booking detail. Rows: content/copy.md, itinerary.
   ===================================================================== */
import { Fragment } from 'react';
import { Icon } from '@/components/Icon';
import { AIRLINES, type Slice } from '@/lib/mock/flights';
import { cabinLabel, type Cabin } from '@/lib/cabins';
import { airportFull, airportShort, layoverRow, legHeading, legNote } from '@/lib/text';
import { clock } from '@/lib/format';

function Day({ min }: { min: number }) {
  const d = Math.floor(min / 1440);
  if (d <= 0) return null;
  return <sup className="m-itin__next"><span aria-hidden="true">+{d}</span><span className="sr-only">, arrives the next day</span></sup>;
}

export function Itinerary({ slices, cabin, origin, headingLevel = 3 }: { slices: Slice[]; cabin: Cabin; origin?: string; headingLevel?: 3 | 4 }) {
  const H = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div className="m-itin">
      {slices.map((s, i) => (
        <section className="m-itin__leg" key={i} aria-label={legHeading(i, s)}>
          <div className="m-itin__head">
            <H className="m-itin__title">{legHeading(i, s)}</H>
            <p className="m-itin__note">{legNote(s)}</p>
          </div>
          <ol className="m-itin__rows">
            {s.segments.map((g, j) => (
              <Fragment key={g.flight}>
                <li className="m-itin__row -stop">
                  <span className="m-itin__time">{clock(g.dep)}<Day min={g.dep} /></span>
                  <span className="m-itin__place">{airportFull(g.from)}, {g.fromTerminal.replace(' ', ' ')}</span>
                </li>
                <li className="m-itin__row -flight">
                  <span className="m-itin__plane" aria-hidden="true"><Icon name="plane" size="s" /></span>
                  <span className="m-itin__flight">
                    {AIRLINES[g.airline]?.name} {g.flight}, {g.aircraft}, {cabinLabel(cabin)}
                    {g.operatedBy && <span className="m-itin__op">Operated by {AIRLINES[g.operatedBy]?.name}</span>}
                  </span>
                </li>
                <li className="m-itin__row -stop">
                  <span className="m-itin__time">{clock(g.arr)}<Day min={g.arr} /></span>
                  <span className="m-itin__place">{airportFull(g.to)}, {g.toTerminal.replace(' ', ' ')}</span>
                </li>
                {j < s.layovers.length && (
                  <li className="m-itin__row -layover">
                    <Icon name={s.layovers[j].overnight ? 'moon' : s.layovers[j].leaveFrom ? 'swap' : 'clock'} size="s" />
                    <span>{layoverRow(s.layovers[j])}</span>
                  </li>
                )}
              </Fragment>
            ))}
            {/* the return lands at another airport than the trip left from */}
            {i === 1 && origin && s.to !== origin && (
              <li className="m-itin__row -layover">
                <Icon name="swap" size="s" />
                <span>You arrive at {airportShort(s.to)} and leave from {airportShort(origin)}. Allow time to travel between them.</span>
              </li>
            )}
          </ol>
        </section>
      ))}
    </div>
  );
}
