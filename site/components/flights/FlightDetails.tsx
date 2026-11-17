'use client';
/* =====================================================================
   Flight details and fares (spec 2b; round 3 spec B2): the itinerary
   timeline, then the airline's own fare families side by side as a
   native radio group, rows aligned across them (bags, seat, changes,
   refund), the bags table per traveler type and the change and refund
   rules, beside the sticky summary with the price per traveler type
   (a bottom bar on phones). Continue checks the price with the airline
   first: it can go up or down, sell out, or the offer can expire, and
   each shows its panel in the main column (copy.md, Flights).
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Itinerary } from '@/components/flights/Itinerary';
import { Glyph } from '@/components/booking/Glyphs';
import { BottomBar, PhoneSummary, Summary, useExpiry } from '@/components/booking/Summary';
import { Notice } from '@/components/ui/Notice';
import { AIRLINES, fareDifference, fareFor, fareStep, faresFor, offerTotals, travelers, type Fare, type FareId, type FareRows, type FlightSearch, type Offer, type PriceCheck } from '@/lib/mock/flights';
import { setDraft } from '@/lib/store';
import { money } from '@/lib/format';
import { paxLine, routeTitle, travelersWord } from '@/lib/text';
import { clock, dayRange } from '@/lib/format';

export function flightSummaryLines(o: Offer, s: FlightSearch, fare: FareId): string[] {
  return [
    `${routeTitle(s.from, s.to)}, ${s.ret ? 'return' : 'one way'}`,
    dayRange(s.depart, s.ret),
    /* round 3, second critic round: each flight's times and flight numbers stay in view on travelers and checkout */
    ...o.slices.map((sl) => `${sl.from} ${clock(sl.dep)} to ${sl.to} ${clock(sl.arr)}${sl.arr >= 1440 ? ' (+1)' : ''}, ${sl.segments.map((g) => g.flight).join(' and ')}`),
    `${paxLine(o.passengers)}, ${fareFor(o.owner, fare).name} fare`
  ];
}

/* ---- the fare table, row by row (spec B2.2): each cell ticked, for a fee or not included ---- */
type Tone = 'yes' | 'fee' | 'no';
const ROWS: { key: keyof FareRows; label: string; icon: string }[] = [
  { key: 'personalItem', label: 'Personal item', icon: 'bag-personal' },
  { key: 'cabinBag', label: 'Cabin bag', icon: 'bag-cabin' },
  { key: 'checkedBag', label: 'Checked bags', icon: 'bag-checked' },
  { key: 'seatChoice', label: 'Seat choice', icon: 'seat' },
  { key: 'changes', label: 'Changes', icon: 'change' },
  { key: 'refunds', label: 'Refund', icon: 'refund' }
];
function cellParts(cell: string): { tone: Tone; text: string }[] {
  return cell.split(';').map((x) => x.trim()).filter(Boolean).map((part) => {
    if (/^For a fee:/i.test(part)) { const t = part.replace(/^For a fee:\s*/i, ''); return { tone: 'fee' as Tone, text: /\$\d/.test(t) ? t : `${t}, for a fee` }; }
    if (/^Not allowed$/i.test(part)) return { tone: 'no' as Tone, text: 'Not allowed' };
    if (/^Not refundable$/i.test(part)) return { tone: 'no' as Tone, text: 'Not refundable' };
    return { tone: 'yes' as Tone, text: part };
  });
}
function Cell({ cell }: { cell: string }) {
  return (
    <ul className="m-fam__cell">
      {cellParts(cell).map((p) => (
        <li className={`m-fam__part -${p.tone}`} key={p.text}>
          <span className="m-fam__mark" aria-hidden="true"><Icon name={p.tone === 'yes' ? 'tick' : p.tone === 'fee' ? 'info' : 'close'} /></span>
          <span>{p.text}<span className="sr-only">{p.tone === 'yes' ? ', included' : p.tone === 'fee' ? '' : ', not included'}</span></span>
        </li>
      ))}
    </ul>
  );
}


/* the per-traveler-type lines of the price (spec B2.5); with taxes and fees they add up to the total */
export function fareBreakdown(o: Offer, fare: FareId, adjust = 0): { label: string; value: string }[] {
  const p = o.passengers;
  const seat = o.perSeat + fareStep(o, fare) + adjust - o.taxPerSeat;
  const t = offerTotals(o, fare, adjust);
  const infantTotal = t.total - t.tax - seat * (p.adults + p.children);
  const rows = [{ label: p.adults === 1 ? 'Adult' : `Adults x${p.adults}`, value: money(seat * p.adults) }];
  if (p.children) rows.push({ label: p.children === 1 ? 'Child' : `Children x${p.children}`, value: money(seat * p.children) });
  if (p.infants) rows.push({ label: p.infants === 1 ? 'Infant on a lap' : `Infants on a lap x${p.infants}`, value: money(infantTotal) });
  rows.push({ label: 'Taxes and fees', value: money(t.tax) });
  return rows;
}

export function FlightDetails({ offer, search, resultsHref, initialFare }: { offer: Offer; search: FlightSearch; resultsHref: string; initialFare: FareId }) {
  const router = useRouter();
  const [fare, setFare] = useState<FareId>(initialFare);
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState<PriceCheck | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { expired } = useExpiry(offer.expiresAt);
  const adjust = check && (check.status === 'up' || check.status === 'down') ? check.adjust : 0;
  const t = offerTotals(offer, fare, adjust);
  const n = travelers(offer.passengers);
  const next = `/flights/${offer.id}/passengers?fare=${fare}`;
  const fares: Fare[] = faresFor(offer.owner);
  const chosen = fareFor(offer.owner, fare);
  const p = offer.passengers;
  const paxTypes = [...(p.adults ? [p.adults === 1 ? 'Adult' : `Adults (${p.adults})`] : []), ...(p.children ? [p.children === 1 ? 'Child' : `Children (${p.children})`] : [])];

  async function onContinue() {
    if (busy) return;
    if (check && (check.status === 'up' || check.status === 'down')) return go(check.adjust);
    setBusy(true);
    try {
      const r = await fetch(`/api/flights/offers/${offer.id}/check`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fare }) });
      const j = await r.json();
      const c: PriceCheck = j.data;
      if (c.status === 'ok') return go(0);
      setCheck(c);
      setBusy(false);
    } catch {
      setBusy(false);
    }
  }
  /* every check result takes focus once its panel is on screen (critic round 1: sold out left focus on the page) */
  useEffect(() => {
    if (!check || check.status === 'ok') return;
    panelRef.current?.scrollIntoView({ block: 'center' });
    panelRef.current?.focus({ preventScroll: true });
  }, [check]);
  function go(adj: number) {
    setDraft(offer.id, { adjust: adj });
    router.push(next);
  }

  /* phones: the fares are a sideways rail; it opens on the chosen fare (spec B2.2) */
  const famsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = famsRef.current, on = el?.querySelector<HTMLElement>('.m-fam.is-on');
    if (el && on && el.scrollWidth > el.clientWidth) el.scrollLeft = on.offsetLeft - el.offsetLeft - 16;
  }, []);
  const showExpired = expired || check?.status === 'expired';
  let panel: React.ReactNode = null;
  if (showExpired) {
    panel = (
      <Notice ref={panelRef} title="These prices have expired"
        actions={<a className="a-button" href={resultsHref}><span className="a-button__label">Search again</span><Icon name="arrow" className="a-button__icon" /></a>}>
        <p>Airline prices are only valid for a short time after a search. Search again to see current fares.</p>
      </Notice>
    );
  } else if (check?.status === 'sold_out') {
    panel = (
      <Notice ref={panelRef} title="This flight is no longer available"
        actions={<a className="a-button" href={resultsHref}><span className="a-button__label">Back to results</span></a>}>
        <p>The seats at this fare sold out after you searched. Other flights on your dates may still have space.</p>
      </Notice>
    );
  } else if (check?.status === 'up') {
    panel = (
      <Notice ref={panelRef} tone="warn" icon="alert" title={<>The price has gone up by <span className="m-notice__delta">{money(check.delta)}</span></>}
        actions={<>
          <button className="a-button" type="button" onClick={() => go(check.adjust)}><span className="a-button__label">Continue at {money(check.total)}</span><Icon name="arrow" className="a-button__icon" /></button>
          <a className="a-link" href={resultsHref}>Back to results</a>
        </>}>
        <p>The airline changed the fare after you searched. The new total for {travelersWord(n)} is {money(check.total)}.</p>
      </Notice>
    );
  } else if (check?.status === 'down') {
    panel = (
      <Notice ref={panelRef} title={`The price has dropped by ${money(-check.delta)}`}
        actions={<button className="a-button" type="button" onClick={() => go(check.adjust)}><span className="a-button__label">Continue</span><Icon name="arrow" className="a-button__icon" /></button>}>
        <p>The airline lowered the fare after you searched. The new total for {travelersWord(n)} is {money(check.total)}.</p>
      </Notice>
    );
  }

  const blocked = showExpired || check?.status === 'sold_out';
  const continueBtn = (block: boolean) => blocked ? null : (
    <button className={`a-button${block ? ' -block' : ' -steady'}`} type="button" aria-disabled={busy || undefined} onClick={onContinue}>
      <span className="a-button__label">Continue</span><Icon name="arrow" className="a-button__icon" />
    </button>
  );

  return (
    <div className="o-detail">
      <div className="o-detail__main">
        {panel && <div className="o-detail__panel">{panel}</div>}

        <section className="o-detail__section" aria-labelledby="itin-title">
          <h2 className="a-h2" id="itin-title">Your flights</h2>
          <Itinerary slices={offer.slices} cabin={offer.cabin} origin={search.from} />
        </section>

        <section className="o-detail__section" aria-labelledby="fares-title">
          <div className="o-detail__headRow">
            <h2 className="a-h2" id="fares-title">Choose your fare</h2>
          </div>
          <p className="o-detail__intro">Every fare is on the same flights. They differ in bags, seats and what happens if your plans change.</p>
          <div className="m-fams" ref={famsRef} role="radiogroup" aria-labelledby="fares-title" style={{ '--fams': fares.length } as React.CSSProperties}>
            {fares.map((f) => {
              const on = f.id === fare;
              const diff = fareDifference(offer, f.id);
              const tot = offerTotals(offer, f.id, adjust).total;
              return (
                <div className={`m-fam${on ? ' is-on' : ''}${blocked ? ' is-off' : ''}`} key={f.id}>
                  <div className="m-fam__head">
                    <span className="m-fam__name">{f.name}</span>
                    <span className="m-fam__total">{money(tot)}</span>
                    <span className="m-fam__for">total for {travelersWord(n)}</span>
                    <span className="m-fam__diff">{diff ? <>+{money(diff)}<span className="sr-only"> more than {fares[0].name}</span></> : 'Included in the price'}</span>
                  </div>
                  {ROWS.map((r) => (
                    <div className="m-fam__row" key={r.key}>
                      <span className="m-fam__label"><Glyph name={r.icon} size="s" />{r.label}</span>
                      <Cell cell={f.rows?.[r.key] ?? ''} />
                    </div>
                  ))}
                  <label className={`a-button -small -steady m-fam__btn${on ? ' -soft' : ' -outline'}`}>
                    <input className="m-fam__radio" type="radio" name="fare" value={f.id} checked={on} disabled={blocked} onChange={() => { setFare(f.id); setCheck(null); }} />
                    <span className="a-button__label">{on ? 'Selected' : `Choose ${f.name}`}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <p className="o-detail__note">The airline sets these rules. We show them exactly as the airline sends them.</p>
        </section>

        <section className="o-detail__section" aria-labelledby="bags-title">
          <h2 className="a-h2" id="bags-title">Bags in the {chosen.name} fare</h2>
          <div className="m-bagTable__wrap">
            <table className="m-bagTable">
              <thead><tr><th scope="col">Traveler</th><th scope="col">Personal item</th><th scope="col">Cabin bag</th><th scope="col">Checked bags</th></tr></thead>
              <tbody>
                {paxTypes.map((t) => (
                  <tr key={t}>
                    <th scope="row">{t}</th>
                    <td><Cell cell={chosen.rows?.personalItem ?? ''} /></td>
                    <td><Cell cell={chosen.rows?.cabinBag ?? ''} /></td>
                    <td><Cell cell={chosen.rows?.checkedBag ?? ''} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="o-detail__section" aria-labelledby="rules-title">
          <h2 className="a-h2" id="rules-title">Changes and refunds</h2>
          <dl className="m-rules">
            <div className="m-rules__row"><dt><Glyph name="change" size="s" />Changes</dt><dd><Cell cell={chosen.rows?.changes ?? ''} /></dd></div>
            <div className="m-rules__row"><dt><Glyph name="refund" size="s" />Refund</dt><dd><Cell cell={chosen.rows?.refunds ?? ''} /></dd></div>
            <div className="m-rules__row"><dt><Glyph name="seat" size="s" />Seat choice</dt><dd><Cell cell={chosen.rows?.seatChoice ?? ''} /></dd></div>
            <div className="m-rules__row"><dt><Icon name="plane" size="s" />Sold by</dt><dd>{AIRLINES[offer.owner]?.name}</dd></div>
          </dl>
        </section>
        {/* phones: the fare, taxes and total under the fares, as on the forms after it (critic, 11 Nov: no breakdown on this page at 390) */}
        <PhoneSummary total={money(t.total)}>
          <Summary title="Your trip" id="details-phone" lines={flightSummaryLines(offer, search, fare)}
            rows={fareBreakdown(offer, fare, adjust)}
            total={money(t.total)} />
        </PhoneSummary>
      </div>

      <aside className="o-detail__side">
        <Summary title="Your trip" lines={flightSummaryLines(offer, search, fare)}
          rows={fareBreakdown(offer, fare, adjust)}
          total={money(t.total)} expiresAt={blocked ? undefined : offer.expiresAt} action={continueBtn(true)} />
      </aside>
      {!blocked && <BottomBar price={money(t.total)} label="total" action={continueBtn(false)} />}
    </div>
  );
}
