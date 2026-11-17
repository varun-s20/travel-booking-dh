/* =====================================================================
   Faye's inclusion cards (spec 2b, Room and fare inclusions): flat
   tinted cards, radius 16, padding 32, a 14px filled disc with a tick
   for what is included, a plus on the second tint for paid extras, and
   not-included rows in muted text with no icon. No hover.
   `condensed` is the three-row version on room cards.
   ===================================================================== */
import { Icon } from '@/components/Icon';

/* warn: a condition to read first on room cards (copy.md order: Non-refundable; Breakfast included; Pay now by card) */
type Props = { included: string[]; fee?: string[]; notIncluded?: string[]; warn?: string[]; condensed?: boolean; headingLevel?: 3 | 4 };

export function Inclusions({ included, fee = [], notIncluded = [], warn = [], condensed, headingLevel = 3 }: Props) {
  const H = headingLevel === 3 ? 'h3' : 'h4';
  if (condensed) {
    return (
      <ul className="m-incl__list -condensed">
        {warn.map((r) => <li className="m-incl__row -warn" key={r}><span className="a-disc -warn" aria-hidden="true"><Icon name="minus" /></span>{r}</li>)}
        {included.map((r) => <li className="m-incl__row" key={r}><span className="a-disc" aria-hidden="true"><Icon name="tick" /></span>{r}</li>)}
        {notIncluded.map((r) => <li className="m-incl__row -no" key={r}>{r}</li>)}
      </ul>
    );
  }
  return (
    <div className="m-incl">
      <div className="m-incl__card">
        <H className="m-incl__title">Included</H>
        <ul className="m-incl__list">
          {included.map((r) => <li className="m-incl__row" key={r}><span className="a-disc" aria-hidden="true"><Icon name="tick" /></span>{r}</li>)}
          {notIncluded.map((r) => <li className="m-incl__row -no" key={r}>{r}</li>)}
        </ul>
      </div>
      {fee.length > 0 && (
        <div className="m-incl__card -extra">
          <H className="m-incl__title">For a fee</H>
          <ul className="m-incl__list">
            {fee.map((r) => <li className="m-incl__row" key={r}><span className="a-disc -plus" aria-hidden="true"><Icon name="plus" /></span>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
