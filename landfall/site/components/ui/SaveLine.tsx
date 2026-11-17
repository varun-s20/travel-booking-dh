/* =====================================================================
   Landfall (working name, a placeholder): the savings line
   Round 3 shared component (round3-spec.md, shared components 3).
   14/500 in --c-save with a small down arrow drawn in the sprite's
   language (1.25 line, square caps, mitre joins). "Usual" means one thing
   everywhere: the usual price for the same route or hotel over the last
   30 days, and only where the catalogue gives one; components never
   compute it. Never a struck-through price unless the catalogue gives a
   real earlier price for the same offer.
   - onPhoto: shallows instead of green (green fails contrast on photos)
   ===================================================================== */

type Props = { saving: number; kind: 'route' | 'rate'; onPhoto?: boolean; className?: string };

export function saveText(saving: number, kind: 'route' | 'rate'): string {
  const amount = `$${Math.round(saving).toLocaleString('en-US')}`;
  return kind === 'route' ? `${amount} below this route's usual fare` : `${amount} below its usual rate`;
}

export default function SaveLine({ saving, kind, onPhoto, className }: Props) {
  if (!(saving > 0)) return null;
  return (
    <span className={['a-save', onPhoto ? '-photo' : '', className || ''].filter(Boolean).join(' ')}>
      <svg className="a-svg" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 4v11.5M5.5 11 10 15.5 14.5 11" /></svg>
      <span className="t-num">{saveText(saving, kind)}</span>
    </span>
  );
}
