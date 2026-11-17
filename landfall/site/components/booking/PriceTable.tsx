/* =====================================================================
   Landfall (working name, a placeholder): the price as line items
   Round 3, Developer B (round3-spec.md B4 and B8). A small table: the
   fare per traveler type (or the room times the nights), taxes and fees,
   and the total (28/600) under the landfall line. Amounts in cents; the
   rows always add up to the total they show.
   ===================================================================== */
import { fareFor, offerTotals, type FareId, type Offer } from '@/lib/travel/flights';
import { dollars, money, plural } from '@/lib/format';
import { paxLine } from '@/lib/text';

export type PriceRow = { label: string; amount: number; note?: string };

/* The fare split by traveler type when the supplier gives one (the simulated catalogue does);
   otherwise one fare line for the whole party (Duffel prices the party as one total). The rows
   always add up to the total. `adjust` is an accepted price change for the whole party. */
export function flightRows(o: Offer, fare: FareId, adjust = 0): { rows: PriceRow[]; total: number } {
  const p = o.passengers;
  const f = fareFor(o, fare);
  const a = offerTotals(o, fare, adjust);
  const rows: PriceRow[] = [];
  const t = f.perType;
  const adult = t?.adult, child = t?.child ?? t?.adult;
  const infants = adult !== undefined && child !== undefined ? a.base - adult * p.adults - child * p.children : -1;
  /* only when the split adds up exactly to the fare (a markup or a price change breaks it) */
  const split = adult !== undefined && child !== undefined && !adjust && (p.infants ? infants > 0 : infants === 0);
  if (split) {
    if (p.adults) rows.push({ label: `Adult fare, ${p.adults} x ${money(adult)}`, amount: adult * p.adults });
    if (p.children) rows.push({ label: `Child fare, ${p.children} x ${money(child)}`, amount: child * p.children });
    if (p.infants) rows.push({ label: `Infant fare, ${p.infants} x ${money(Math.round(infants / p.infants))}`, amount: infants, note: 'on an adult’s lap' });
  } else {
    rows.push({ label: `Fare, ${paxLine(p)}`, amount: a.base });
  }
  rows.push({ label: 'Taxes and fees', amount: a.tax });
  return { rows, total: a.total };
}

/* A stay is priced the way the hotel page shows it: the nightly rate with
   taxes and fees included, times the nights. The taxes are never taken out
   of the nightly figure; when shown, they sit under the total as "of which".
   stayLabel's `nightly` is per room: "2 rooms x $186 per night x 4 nights". */
export const nightlyWord = (cents: number) => (cents % 100 === 0 ? dollars(cents) : money(cents));
export function stayLabel(nights: number, nightly: number, rooms = 1, name = 'Room'): string {
  return `${rooms > 1 ? `${rooms} rooms x ` : `${name}, `}${nightlyWord(nightly)} per night x ${plural(nights, 'night', 'nights')}`;
}

export default function PriceTable({ rows, total, caption = 'Price details', note, taxes }: { rows: PriceRow[]; total: number; caption?: string; note?: string; taxes?: number }) {
  return (
    <table className="bk-ptable">
      <caption className="bk-ptable__cap">{caption}</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row">{r.label}{r.note && <span className="t-small t-muted">, {r.note}</span>}</th>
            <td className="t-num">{money(r.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total<span className="t-small t-muted bk-ptable__inc">taxes and fees included</span></th>
          <td className="t-num bk-ptable__total">{money(total)}</td>
        </tr>
        {taxes !== undefined && <tr className="bk-ptable__of"><th scope="row" className="t-small t-muted">of which taxes and fees</th><td className="t-small t-muted t-num">{money(taxes)}</td></tr>}
        {note && <tr><td colSpan={2} className="t-small t-muted bk-ptable__note">{note}</td></tr>}
      </tfoot>
    </table>
  );
}
