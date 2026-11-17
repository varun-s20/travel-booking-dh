/* =====================================================================
   Landfall (working name, a placeholder): the price block
   Kasa's price rule, everywhere a price shows (spec 4, copy.md swap 5):
   the total first and underlined, the unit price second, "taxes and fees
   included" always. With onBreakdown the total is a button that opens
   the breakdown dialog. was: only when the API sends a previous price.
   left: only from API quantities ("Only 2 left"), in warn colour.
   Amounts are cents; lib/format.ts money() writes them.
   ===================================================================== */
'use client';
import { money } from '@/lib/format';

type Props = {
  total: number; unit?: string; size?: 'sm' | 'md' | 'lg'; onDark?: boolean;
  onBreakdown?: () => void; breakdownLabel?: string; was?: number; left?: string; note?: string; className?: string; totalWord?: string;
};

export default function Price({ total, unit, size = 'md', onDark, onBreakdown, breakdownLabel, was, left, note = 'taxes and fees included', className, totalWord = 'total' }: Props) {
  const cls = ['m-price', size !== 'md' ? `-${size}` : '', onDark ? '-onDark' : '', className || ''].filter(Boolean).join(' ');
  const text = `${money(total)} ${totalWord}`;
  return (
    <div className={cls}>
      <div className="m-price__line">
        {onBreakdown
          ? <button type="button" className="m-price__total" onClick={onBreakdown} aria-label={breakdownLabel || `${text}, see price breakdown`}>{text}</button>
          : <span className="m-price__total">{text}</span>}
        {was !== undefined && <span className="m-price__was"><span className="sr-only">was </span>{money(was)}</span>}
      </div>
      {unit && <span className="m-price__unit">{unit}</span>}
      <span className="m-price__note">{note}</span>
      {left && <span className="m-price__left">{left}</span>}
    </div>
  );
}
