/* =====================================================================
   Landfall (working name, a placeholder), group F: flight parts
   The pieces every booking step shares, all carrying the landfall line
   (the concept: arriving is the moment that matters):
   - AirlineTile: the airline's code in a tile (Duffel sends logos live;
     the demo airlines are fiction, so the tile shows the code)
   - LegLine: one leg on a result row: departure, the landfall line with
     duration and stops on it, the arrival set heavier
   - Timeline: the itinerary as a vertical landfall line per segment,
     ending in the accent where the plane lands; layovers as foam bands
   - TripSummary: the booking summary card, the landfall line above the
     total (spec 2b, Flight details; Kasa's price rule)
   - Breakdown: the price breakdown dialog (a sheet below 1025)
   - ExpiryLine and ExpiredDialog: Duffel offers expire 30 minutes
     after the search
   - FareChange: the fare went up or down banner
   Copy: landfall/content/copy.md, Flights and Booking and payment.
   ===================================================================== */
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { airlineName, airlineOf, airport, cityOf, type Fare, type Slice, type Pax } from '@/lib/travel/flights';
import { clock, duration, durationLong, money } from '@/lib/format';
import { airportFull, layoverRow, legHeading, legNote, nextDay, paxLine, stopsLower, travelersWord } from '@/lib/text';
import { cabinLabel, type Cabin } from '@/lib/cabins';
import Icon from '@/components/ui/Icon';
import Dialog from '@/components/ui/Dialog';
import Price from '@/components/ui/Price';
import Notice from '@/components/ui/Notice';
import Photo from '@/components/ui/Photo';
import { destinationPhoto } from '@/lib/data/destinations';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useExpiry } from './trip';

/* ---------- airline ---------- */
/* the airline's logo when the supplier sends one (Duffel's SVG symbol), otherwise its code in the tile */
export function AirlineTile({ code }: { code: string }) {
  const logo = airlineOf(code)?.logo;
  if (logo) return <span className="f-tile" aria-hidden="true"><img src={logo} alt="" width={24} height={24} loading="lazy" decoding="async" referrerPolicy="no-referrer" /></span>;
  return <span className="f-tile t-code" aria-hidden="true">{code}</span>;
}

/* ---------- a leg on a result row ---------- */
export function LegLine({ slice }: { slice: Slice }) {
  const label = slice.stops ? `${duration(slice.dur)}, ${stopsLower(slice.stops)} in ${slice.layovers.map((l) => cityOf(l.at)).join(' and ')}` : `${duration(slice.dur)}, nonstop`;
  const plus = nextDay(slice);
  return (
    <div className="f-leg">
      <p className="f-leg__end">
        <span className="f-leg__time t-num">{clock(slice.dep)}</span>
        <span className="f-leg__place t-code">{slice.from}</span>
      </p>
      <div className="a-landfall -leg f-leg__line"><span className="a-landfall__label t-num">{label}</span></div>
      <p className="f-leg__end -arr">
        <span className="f-leg__time t-num">{clock(slice.arr)}{plus > 0 && <sup className="f-leg__plus">+{plus}<span className="sr-only"> arrives the next day</span></sup>}</span>
        <span className="f-leg__place">{cityOf(slice.to)}</span>
      </p>
    </div>
  );
}

/* ---------- itinerary timeline ---------- */
/* suppliers don't always name the terminal: then only the airport */
function terminalLine(code: string, t: string) {
  return t ? `${airportFull(code)}, ${t}` : airportFull(code);
}

export function Timeline({ slices, cabin, headingLevel = 3, baggage }: { slices: Slice[]; cabin: Cabin; headingLevel?: 2 | 3; baggage?: string }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="f-tl">
      {slices.map((s, i) => (
        <section className="f-tl__leg" key={i} aria-label={legHeading(i, s)}>
          <div className="f-tl__head">
            <H className="f-tl__title t-title">{legHeading(i, s)}</H>
            <p className="f-tl__note t-small t-muted t-num">{legNote(s)}</p>
          </div>
          <ol className="f-tl__list">
            {s.segments.map((seg, j) => {
              const lay = s.layovers[j];
              const last = j === s.segments.length - 1;
              const air = airlineName(seg.airline);
              const plus = Math.floor(seg.arr / 1440);
              return (
                <li key={seg.flight} className="f-tl__item">
                  <div className={`f-tl__seg${last ? ' -land' : ''}`}>
                    <p className="f-tl__row">
                      <span className="f-tl__time t-num">{clock(seg.dep)}</span>
                      <span className="f-tl__node" aria-hidden="true" />
                      <span className="f-tl__where">{terminalLine(seg.from, seg.fromTerminal)}</span>
                    </p>
                    <p className="f-tl__row -mid">
                      <span className="f-tl__time" />
                      <span className="f-tl__rail" aria-hidden="true" />
                      <span className="f-tl__flight t-small">
                        <span>{air} {seg.flight}{seg.aircraft ? `, ${seg.aircraft}` : ''}, {cabinLabel(cabin)}</span>
                        {seg.operatedBy && <span className="t-muted">Operated by {airlineName(seg.operatedBy)}</span>}
                        <span className="t-muted t-num"><span aria-hidden="true">{duration(seg.dur)}</span><span className="sr-only">{durationLong(seg.dur)}</span></span>
                      </span>
                    </p>
                    <p className="f-tl__row -arr">
                      <span className="f-tl__time t-num">{clock(seg.arr)}{plus > 0 && <sup className="f-leg__plus">+{plus}<span className="sr-only"> arrives the next day</span></sup>}</span>
                      <span className="f-tl__node" aria-hidden="true" />
                      <span className="f-tl__where">{terminalLine(seg.to, seg.toTerminal)}</span>
                    </p>
                  </div>
                  {lay && !last && (
                    <p className="f-tl__lay t-small"><Icon name={lay.leaveFrom || lay.overnight ? 'alert' : 'clock'} size="sm" />{lay.leaveFrom || lay.overnight ? layoverRow(lay) : `Change planes, ${duration(lay.dur)} in ${cityOf(lay.at)}`}</p>
                  )}
                </li>
              );
            })}
          </ol>
          {baggage && <p className="f-tl__bag t-small"><Icon name="bag" size="sm" /><span><b>Baggage</b> {baggage}</span></p>}
        </section>
      ))}
    </div>
  );
}

/* ---------- price breakdown ---------- */
export type BreakdownRows = { rows: [string, number][]; total: number; unit: string; line?: string };

export function Breakdown({ open, onClose, data }: { open: boolean; onClose: () => void; data: BreakdownRows }) {
  return (
    <Dialog open={open} onClose={onClose} title="Price breakdown" sheet footer={<Button variant="ghost" onClick={onClose}>Close</Button>} closeLabel="Close price breakdown">
      <dl className="f-bd">
        {data.rows.map(([k, v]) => (
          <div className="f-bd__row" key={k}><dt>{k}</dt><dd className="t-num">{money(v)}</dd></div>
        ))}
        <div className="f-bd__row -total"><dt>Total</dt><dd className="t-num">{money(data.total)}</dd></div>
      </dl>
      <p className="f-bd__unit t-small t-muted t-num">{data.unit}</p>
      {data.line && <p className="f-bd__line t-small">{data.line}</p>}
    </Dialog>
  );
}

export function flightBreakdown(amounts: { base: number; tax: number; total: number }, pax: Pax, unit: string): BreakdownRows {
  return {
    rows: [[`Flights, ${paxLine(pax)}`, amounts.base], ['Taxes and fees', amounts.tax]],
    total: amounts.total, unit,
    line: 'This is the price for everyone on the booking. We check it again with the airline before you pay.'
  };
}

/* ---------- expiry line ---------- */
export function ExpiryLine({ expiresAt, confirmed, onExpire }: { expiresAt: number; confirmed?: boolean; onExpire?: () => void }) {
  const e = useExpiry(expiresAt);
  const [said, setSaid] = useState(false);
  const fired = useRef(false);
  useEffect(() => {
    if (!e) return;
    if (e.soon && !e.expired && !said) setSaid(true);
    if (e.expired && !fired.current) { fired.current = true; onExpire?.(); }
    if (!e.expired) fired.current = false;
  }, [e, said, onExpire]);
  if (!e) return <p className="m-summary__valid" aria-hidden="true">&nbsp;</p>;
  const text = confirmed ? `Price confirmed. Valid until ${e.at}.` : e.soon ? `Price valid until ${e.at}. Less than 5 minutes left.` : `Price valid until ${e.at}`;
  return (
    <>
      <p className={`m-summary__valid${e.soon ? ' is-soon' : ''}`}><Icon name="clock" size="sm" />{text}</p>
      <p className="sr-only" aria-live="polite">{said ? 'Your price is valid for 5 more minutes.' : ''}</p>
    </>
  );
}

export function ExpiredDialog({ open, onRefresh, backHref, busy }: { open: boolean; onRefresh: () => void; backHref: string; busy?: boolean }) {
  return (
    <Dialog open={open} onClose={() => {}} dismissable={false} title="This price has expired"
      footer={<><ButtonLink variant="ghost" href={backHref}>Back to results</ButtonLink><Button onClick={onRefresh} disabled={busy} aria-busy={busy || undefined}>Refresh the price</Button></>}>
      <p className="t-body">Airline prices are only valid for a short time after a search. Refresh to get the current price for this flight.</p>
    </Dialog>
  );
}

/* ---------- the booking summary card ---------- */
/* place: the destination's airport code or city; its own water photo heads the card (the concept: see the place first) */
export function TripSummary({ title = 'Your trip', lines, total, unit, onBreakdown, expiry, action, after, className, place }: {
  title?: string; lines: ReactNode[]; total: number; unit: string; onBreakdown: () => void;
  expiry?: ReactNode; action?: ReactNode; after?: ReactNode; className?: string; place?: string;
}) {
  const d = place ? destinationPhoto(place) : undefined;
  return (
    <section className={['m-summary f-sum', className || ''].filter(Boolean).join(' ')} aria-label={title}>
      {d && <Photo name={d.image} alt="" className="f-sum__photo" sizes="(min-width: 1025px) 344px, calc(100vw - 80px)" />}
      <h2 className="m-summary__title">{title}</h2>
      <ul className="f-sum__lines">
        {lines.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      <div className="m-total f-sum__total">
        <Price total={total} unit={unit} size="lg" onBreakdown={onBreakdown} breakdownLabel={`${money(total)} total. See price breakdown`} />
        <button type="button" className="a-link f-sum__bd" onClick={onBreakdown}>See price breakdown</button>
        {expiry}
      </div>
      {action}
      {after}
    </section>
  );
}

/* ---------- fare went up or down ---------- */
export function FareChange({ before, after, pax, onContinue, backHref }: { before: number; after: number; pax: Pax; onContinue: () => void; backHref: string }) {
  const up = after > before;
  const n = travelersWord(pax.adults + pax.children + pax.infants);
  return (
    <Notice tone={up ? 'warn' : 'success'} focusOnMount className="f-change"
      title={up ? `The price went up by ${money(after - before)}` : `The price went down by ${money(before - after)}`}
      actions={up
        ? <><Button onClick={onContinue}>Continue at {money(after)}</Button><ButtonLink variant="ghost" href={backHref}>Back to results</ButtonLink></>
        : <Button onClick={onContinue}>Continue</Button>}>
      <p>{up
        ? `The airline changed the fare after you searched. Your new total for ${n} is ${money(after)}, taxes and fees included.`
        : `The airline lowered the fare after you searched. The new total for ${n} is ${money(after)}, taxes and fees included.`}</p>
      <p className="f-change__was t-num"><s aria-hidden="true">{money(before)}</s> <b aria-hidden="true">{money(after)}</b><span className="sr-only">Was {money(before)}, now {money(after)}</span></p>
    </Notice>
  );
}

export const placeCity = (code: string) => airport(code)?.city ?? code;

/* ---------- Round 3: reading an airline's fare family cells ----------
   The catalogue's rule ("How fare families work"): a cell starting "For a
   fee" is a fee item, "Not allowed" or "Not refundable" is not included,
   anything else is included. Seat choice counts only when the cell offers
   a choice ("Choose ..."): "Seat assigned at check-in" is no choice, so it
   reads as not included (its fee part, "Choose your seat", is the fee line). */
export type Need = 'cabin' | 'checked' | 'change' | 'refund' | 'seat';
export type CellKind = 'yes' | 'fee' | 'no';
export function cellKind(cell?: string): CellKind {
  const c = (cell ?? '').trim();
  if (!c) return 'no';
  if (/^For a fee/i.test(c)) return 'fee';
  if (/^(Not allowed|Not refundable|Not included|No |Seat assigned at check-in)/i.test(c)) return 'no';
  return 'yes';
}
/* every fare says what it includes (lib/travel/flights.ts, Fare.has), from Duffel's
   baggage and conditions or from the catalogue's cells by the rule above */
export function fareHas(f: Fare, need: Need): boolean {
  return f.has[need];
}
