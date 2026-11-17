/* =====================================================================
   Landfall (working name, a placeholder): sticky bottom price bar (390)
   Total and one action, fixed to the bottom below 1025 (hidden above).
   It adds body.has-pricebar so the page gets matching bottom padding and
   toasts sit above it, so it never covers form errors (spec 6). onTotal
   opens the breakdown sheet.
   ===================================================================== */
'use client';
import { useEffect, type ReactNode } from 'react';

/* totalLabel (group F addition): the total button's accessible name when the default doesn't fit (checkout: "Show the booking summary") */
/* note (group F addition): a second muted line under sub, for the unit price and "taxes and fees included" */
export default function PriceBar({ total, sub, note, onTotal, action, label = 'Price', totalLabel }: { total: string; sub?: string; note?: string; onTotal?: () => void; action: ReactNode; label?: string; totalLabel?: string }) {
  useEffect(() => {
    document.body.classList.add('has-pricebar');
    return () => document.body.classList.remove('has-pricebar');
  }, []);
  const inner = <><b>{total}</b>{sub && <span>{sub}</span>}{note && <span>{note}</span>}</>;
  return (
    <div className="m-pricebar" role="region" aria-label={label}>
      {onTotal
        ? <button type="button" className="m-pricebar__total" onClick={onTotal} aria-label={totalLabel || `${total}${sub ? `, ${sub}` : ''}, see price breakdown`}>{inner}</button>
        : <p className="m-pricebar__total">{inner}</p>}
      {action}
    </div>
  );
}
