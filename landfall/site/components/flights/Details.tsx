/* =====================================================================
   Landfall (working name, a placeholder), group F: flight details and fares
   Spec 2b, Flight details: two columns at 1025 and up (main 760, the
   summary 392 sticky). Main: the itinerary as a vertical landfall line per
   leg, then "Choose your fare" as radio rows (teal fill and ring on the
   chosen one), then the fare conditions accordion for the chosen fare.
   Summary: route, dates, travelers, the landfall line above the total,
   See price breakdown, the expiry line, Continue to passengers. Below
   1025 the summary becomes the sticky bottom price bar.
   Continue checks the price with the airline first: the fare can go up
   or down (banner above the summary), the seats can sell out, and the
   offer can expire (dialog with Refresh the price).
   Copy: landfall/content/copy.md, Flight details and fares, and No
   results, search failed, fare changed, offer expired.
   Round 3 (round3-spec.md B2): the owning airline's own fare families as
   a comparison table at 1025 and up (Selected column foam with a navy
   ring, Choose <name> per column) and swipe cards below; conditions and
   the baggage note from the chosen family; the price breakdown per
   traveler type with the hold time; a flight-view entry in lf.recent;
   the booking step line (Choose your fare, Travelers, Pay) under Back.
   Backend (2026-11-15): the fares are the offer's own (offer.fares, one
   supplier offer each). Continue asks POST /api/flights/offers/<id>/check
   for the fare's current price; an accepted change is kept in the draft
   (acceptedTotal) for checkout. "Refresh the price" after the expiry is
   POST /api/flights/offers/<id>/refresh: the same flights from a new
   search, with a new id. Cells the airline doesn't fill are left out.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { airlineName, cityOf, offerTotals, registerDict, searchQuery, travelers, type Fare, type FareId, type FlightSearch, type Offer, type PriceCheck } from '@/lib/travel/flights';
import { api } from '@/lib/api';
import { addRecent } from '@/lib/recent';
import { dayRange, money } from '@/lib/format';
import { flightMetaTrip, paxLine, routeTitle, travelersWord } from '@/lib/text';
import { MQ_DESKTOP, useMedia } from '@/lib/client';
import { setDraft } from '@/lib/store';
import Icon from '@/components/ui/Icon';
import Accordion from '@/components/ui/Accordion';
import Notice from '@/components/ui/Notice';
import PriceBar from '@/components/ui/PriceBar';
import { Button, ButtonLink } from '@/components/ui/Button';
import { flightRows } from '@/components/booking/PriceTable';
import { Breakdown, ExpiredDialog, ExpiryLine, FareChange, Timeline, TripSummary, cellKind, type BreakdownRows } from './parts';
import { clockOf, flightDraftKey, moveDraft, passengersUrl, perTraveler, resultsUrl, useInView } from './trip';

type Check = { status: 'idle' | 'busy' } | { status: 'changed'; before: number; after: number } | { status: 'sold_out' };

/* the parts of one catalogue cell ("A; For a fee: B"), each with its kind */
const parts = (cell?: string) => (cell ?? '').split(';').map((x) => x.trim()).filter(Boolean);
const partText = (x: string) => {
  if (/^Seat assigned at check-in$/i.test(x)) return 'Assigned at check-in';
  const t = x.replace(/^For a fee:\s*/i, '');
  return cellKind(x) === 'fee' && !/\$/.test(t) ? `${t}, for a fee` : t;
};
function Cell({ cell }: { cell?: string }) {
  const list = parts(cell);
  if (!list.length) return <span className="t-muted">Not listed</span>;
  return (
    <ul className="f-fam__cell">
      {list.map((x) => {
        const k = cellKind(x);
        return <li key={x} className={k === 'yes' ? '' : `-${k}`}>{k === 'no' ? <span aria-hidden="true" /> : <Icon name={k === 'yes' ? 'tick' : 'plus'} size="sm" />}<span>{partText(x)}{k === 'fee' && <span className="sr-only"> (costs extra)</span>}</span></li>;
      })}
    </ul>
  );
}
const sentence = (cell?: string) => parts(cell).map(partText).join('. ') + (parts(cell).length ? '.' : '');

/* fare conditions for the chosen family (the cells as the airline sends them; empty ones are left out) */
function conditions(f: Fare) {
  const r = f.rows;
  const lists = [
    { id: 'included', title: 'Included', icon: 'tick' as const, content: <p>{f.included.join('. ')}.</p> },
    { id: 'not', title: 'Not included', icon: 'info' as const, content: <p>{[...f.fee.map((x) => `${x}, for a fee`), ...f.notIncluded].join('. ') || 'Nothing listed.'}</p> }
  ];
  if (!r) return lists;
  const bags = [sentence(r.personal), sentence(r.cabin), sentence(r.checked)].filter(Boolean).join(' ');
  const items = [
    { id: 'changes', title: 'Changes', icon: 'change' as const, text: sentence(r.changes) },
    { id: 'refunds', title: 'Cancellation and refund', icon: 'refund' as const, text: sentence(r.refunds) },
    { id: 'baggage', title: 'Baggage', icon: 'bag' as const, text: bags },
    { id: 'seats', title: 'Seats', icon: 'seat' as const, text: sentence(r.seat) }
  ].filter((x) => x.text).map(({ text, ...x }) => ({ ...x, content: <p>{text}</p> }));
  return items.length ? items : lists;
}
type RowKey = 'personal' | 'cabin' | 'checked' | 'seat' | 'changes' | 'refunds';
const ROWS: { key: RowKey; label: string }[] = [
  { key: 'personal', label: 'Personal item' }, { key: 'cabin', label: 'Cabin bag' }, { key: 'checked', label: 'Checked bags' },
  { key: 'seat', label: 'Seat choice' }, { key: 'changes', label: 'Changes' }, { key: 'refunds', label: 'Cancellation and refund' }
];
const cellOf = (f: Fare, key: RowKey) => (f.rows ? f.rows[key] : undefined);

export default function Details({ offer: initial, search, fare: initialFare }: { offer: Offer; search: FlightSearch; fare: FareId }) {
  registerDict(initial.dict);
  const router = useRouter();
  const desktop = useMedia(MQ_DESKTOP, true);
  const [offer, setOffer] = useState(initial);
  const fams = offer.fares;
  const tiers = fams.map((f) => f.id);
  const [fare, setFare] = useState<FareId>(tiers.includes(initialFare) ? initialFare : tiers[tiers.length - 1]);
  const [check, setCheck] = useState<Check>({ status: 'idle' });
  const [expired, setExpired] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bd, setBd] = useState(false);
  const airline = airlineName(offer.owner);
  const back = resultsUrl(search);
  const amounts = offerTotals(offer, fare);
  const n = travelers(search);
  const per = `${money(perTraveler(amounts.total, search))} per traveler`;
  const fam = fams[Math.max(0, tiers.indexOf(fare))];
  const fareName = fam.name;
  /* comparison rows the airline fills for at least one fare */
  const rows = ROWS.filter((r) => fams.some((f) => parts(cellOf(f, r.key)).length));

  /* round 3: a flight-view entry for "Recommended for you" (lib/recent.ts, Developer A's writer) */
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(searchQuery(search)));
    addRecent({ kind: 'flight-view', params: { ...params, offer: initial.id }, label: `${cityOf(search.from)} to ${cityOf(search.to)}`, price: Math.round(perTraveler(offerTotals(initial, 'light').total, search) / 100) });
  }, [initial, search]);
  const onExpire = useCallback(() => setExpired(true), []);
  const asideRef = useRef<HTMLElement>(null);
  const summaryInView = useInView(asideRef);

  /* a fare id the airline doesn't sell (top on a 3-family airline) is shown as its highest family; the URL says so too */
  useEffect(() => {
    if (fare !== initialFare) window.history.replaceState(null, '', `/flights/${offer.id}?fare=${fare}`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 390: the swipe cards open on the chosen family */
  useEffect(() => {
    if (desktop) return;
    const li = document.querySelector<HTMLElement>('.f-fam__cards .is-on')?.parentElement;
    const ul = li?.parentElement;
    if (li && ul) ul.scrollLeft = li.offsetLeft - ul.offsetLeft - 16;
  }, [desktop]); // eslint-disable-line react-hooks/exhaustive-deps

  function chooseFare(id: FareId) {
    setFare(id);
    setCheck({ status: 'idle' });
    window.history.replaceState(null, '', `/flights/${offer.id}?fare=${id}`);
  }

  /* the fare's current price from the supplier; null when the check couldn't run */
  async function priceCheck(id = offer.id): Promise<PriceCheck | null> {
    const r = await api<PriceCheck>(`/api/flights/offers/${encodeURIComponent(id)}/check`, { method: 'POST', body: { fare } });
    return r.data ?? null;
  }

  /* acceptedTotal: a changed price the traveler agreed to; checkout pays that total */
  function goOn(acceptedTotal?: number) {
    setDraft(flightDraftKey(offer.id), { acceptedTotal });
    router.push(passengersUrl(offer.id, fare));
  }

  async function onContinue() {
    if (check.status === 'busy') return;
    if (Date.now() > offer.expiresAt) { setExpired(true); return; }
    setCheck({ status: 'busy' });
    const res = await priceCheck();
    if (!res) { setCheck({ status: 'idle' }); return; }
    if (res.status === 'ok') { goOn(); return; }
    if (res.status === 'expired') { setCheck({ status: 'idle' }); setExpired(true); return; }
    if (res.status === 'sold_out') { setCheck({ status: 'sold_out' }); return; }
    setCheck({ status: 'changed', before: amounts.total, after: res.total });
  }

  /* the same flights from a new search: new id and prices, valid for another half hour */
  async function onRefresh() {
    setRefreshing(true);
    const r = await api<{ offer: Offer }>(`/api/flights/offers/${encodeURIComponent(offer.id)}/refresh`, { method: 'POST' });
    setRefreshing(false);
    if (!r.data) {
      if (r.error.code === 'no_longer_available' || r.error.code === 'offer_expired') { setExpired(false); setCheck({ status: 'sold_out' }); }
      return;
    }
    const next = r.data.offer;
    registerDict(next.dict);
    const nextFare = next.fares.some((f) => f.id === fare) ? fare : next.fares[next.fares.length - 1].id;
    moveDraft(flightDraftKey(offer.id), flightDraftKey(next.id));
    setOffer(next);
    setFare(nextFare);
    setCheck({ status: 'idle' });
    window.history.replaceState(null, '', `/flights/${next.id}?fare=${nextFare}`);
    setExpired(false);
    setConfirmed(true);
  }

  const shownTotal = check.status === 'changed' ? check.after : amounts.total;
  const shownPer = check.status === 'changed' ? `${money(perTraveler(check.after, search))} per traveler` : per;
  const banner = check.status === 'changed'
    ? <FareChange before={check.before} after={check.after} pax={search} backHref={back} onContinue={() => goOn(check.after)} />
    : check.status === 'sold_out'
      ? <Notice tone="warn" focusOnMount className="f-change" title="This flight is no longer available" actions={<ButtonLink href={back}>Back to results</ButtonLink>}><p>The seats at this fare sold out after you searched. Other flights on your dates may still have space.</p></Notice>
      : null;
  const busy = check.status === 'busy';
  const blocked = check.status === 'sold_out' || check.status === 'changed';
  const breakdown = typeBreakdown(offer, fare, check.status === 'changed' ? check.after - check.before : 0, `${shownPer}, ${fareName} fare`);

  return (
    <div className="l-container f-offer">
      <p className="f-back"><a className="a-link" href={back}><Icon name="arrow-l" size="sm" />Back to results</a></p>
      {/* Round 3: booking steps (flights.css, shared .b-steps) */}
      <ol className="b-steps" aria-label="Booking steps">
        <li className="is-current" aria-current="step">Choose your fare</li>
        <li>Travelers</li>
        <li>Pay</li>
      </ol>
      <header className="f-offer__head">
        <h1 className="t-display t-h1">{routeTitle(search.from, search.to)}</h1>
        <p className="t-body t-muted t-num">{flightMetaTrip(search.depart, search.ret, search, search.cabin)}</p>
      </header>

      <div className="l-split">
        <div className="f-offer__main">
          {!desktop && banner}
          <section className="f-sec" aria-labelledby="f-flights-title">
            <h2 className="t-display t-h2 f-sec__title" id="f-flights-title">Your flights</h2>
            <Timeline slices={offer.slices} cabin={search.cabin} baggage={`${fareName} fare: ${[fam.rows?.personal, fam.rows?.cabin, fam.rows?.checked].filter(Boolean).map((x) => parts(x).map(partText).join(', ')).join('; ') || fam.included.join(', ')}`} />
          </section>

          <section className="f-sec" aria-labelledby="f-fares-title">
            <h2 className="t-display t-h2 f-sec__title" id="f-fares-title">Choose your fare</h2>
            <p className="t-body t-muted f-sec__intro">Every fare is on the same flights. They differ in bags, seats and what happens if your plans change.</p>
            <div className="f-fam">
              {desktop ? (
                <table className="f-fam__table">
                  <caption className="sr-only">{airline} fare families, compared</caption>
                  <thead>
                    <tr>
                      <td />
                      {fams.map((f, i) => (
                        <th scope="col" key={f.name} className={`f-fam__col${tiers[i] === fare ? ' is-on' : ''}`}>
                          <span className="f-fam__name">{f.name}</span>
                          {/* every header keeps the Selected line's height, so all the names sit on one baseline */}
                          {tiers[i] === fare
                            ? <span className="f-fam__sel"><Icon name="tick" size="sm" />Selected</span>
                            : <span className="f-fam__sel -space" aria-hidden="true"><Icon name="tick" size="sm" />Selected</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Price</th>
                      {fams.map((f, i) => { const t = offerTotals(offer, tiers[i]).total; return (
                        <td key={f.name} className={tiers[i] === fare ? 'is-on' : ''}><span className="f-fam__price t-num"><b>{money(t)} total</b><span>{money(perTraveler(t, search))} per traveler</span></span></td>
                      ); })}
                    </tr>
                    {rows.map((r) => (
                      <tr key={r.key}>
                        <th scope="row">{r.label}</th>
                        {fams.map((f, i) => <td key={f.name} className={tiers[i] === fare ? 'is-on' : ''}><Cell cell={cellOf(f, r.key)} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td />
                      {fams.map((f, i) => (
                        <td key={f.name} className={tiers[i] === fare ? 'is-on' : ''}>
                          <Button variant={tiers[i] === fare ? 'primary' : 'ghost'} onClick={() => chooseFare(tiers[i])} aria-pressed={tiers[i] === fare}>{tiers[i] === fare ? 'Chosen' : `Choose ${f.name}`}</Button>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <ul className="f-fam__cards" aria-label={`${airline} fare families`}>
                  {fams.map((f, i) => { const t = offerTotals(offer, tiers[i]).total; const on = tiers[i] === fare; return (
                    <li key={f.name}>
                      <section className={`f-famcard${on ? ' is-on' : ''}`} aria-label={`${f.name} fare`}>
                        <div>
                          <span className="f-fam__name">{f.name}</span>
                          {on && <span className="f-fam__sel"><Icon name="tick" size="sm" />Selected</span>}
                        </div>
                        <span className="f-fam__price t-num"><b>{money(t)} total</b><span>{money(perTraveler(t, search))} per traveler</span></span>
                        <dl className="f-famcard__rows">
                          {rows.map((r) => <div key={r.key}><dt>{r.label}</dt><dd><Cell cell={cellOf(f, r.key)} /></dd></div>)}
                        </dl>
                        <Button block variant={on ? 'primary' : 'ghost'} onClick={() => chooseFare(tiers[i])} aria-pressed={on}>{on ? 'Chosen' : `Choose ${f.name}`}</Button>
                      </section>
                    </li>
                  ); })}
                </ul>
              )}
            </div>
            <div className="f-conds">
              <h3 className="t-title f-conds__title">Fare conditions, {fareName}</h3>
              <Accordion key={fare} items={conditions(fam)} />
              <p className="t-small t-muted f-conds__note">The airline sets these rules. We show them exactly as the airline sends them.</p>
            </div>
          </section>
        </div>

        <aside className="l-split__aside f-offer__aside" ref={asideRef}>
          {desktop && banner}
          <TripSummary place={search.to}
            lines={[`${routeTitle(search.from, search.to)}, ${search.ret ? 'return' : 'one way'}`, dayRange(search.depart, search.ret), `${paxLine(search)}, ${fareName} fare`]}
            total={shownTotal} unit={shownPer} onBreakdown={() => setBd(true)}
            expiry={<ExpiryLine expiresAt={offer.expiresAt} confirmed={confirmed} onExpire={onExpire} />}
            action={<Button block large onClick={onContinue} disabled={blocked} aria-busy={busy || undefined}>{busy ? 'Checking the price with the airline' : 'Continue to passengers'}</Button>}
          />
        </aside>
      </div>

      {!desktop && (
        <div className={`f-bar${summaryInView ? ' is-off' : ''}`} inert={summaryInView || undefined}>
          <PriceBar total={`${money(shownTotal)} total`} sub={`${fareName} fare`} note={`${shownPer}, taxes and fees included`} onTotal={() => setBd(true)}
            totalLabel={`${money(shownTotal)} total for ${travelersWord(n)}. See price breakdown`}
            action={<Button onClick={onContinue} disabled={blocked || busy} aria-busy={busy || undefined}>Continue</Button>} />
        </div>
      )}
      <p className="sr-only" aria-live="polite">{busy ? 'Checking the price with the airline' : ''}</p>
      <Breakdown open={bd} onClose={() => setBd(false)} data={breakdown} />
      <ExpiredDialog open={expired} onRefresh={onRefresh} backHref={back} busy={refreshing} />
    </div>
  );
}

/* the price breakdown (round3-spec.md B2): per traveler type when the supplier splits the fare,
   otherwise the party's fare and its taxes (PriceTable.flightRows), with the hold time.
   adjust: a price change for the whole party */
function typeBreakdown(o: Offer, fare: FareId, adjust: number, unit: string): BreakdownRows {
  const { rows, total } = flightRows(o, fare, adjust);
  return {
    rows: rows.map((r): [string, number] => [r.note ? `${r.label}, ${r.note}` : r.label, r.amount]),
    total, unit, line: `Price held until ${clockOf(o.expiresAt)}. We check it again with the airline before you pay.`
  };
}
