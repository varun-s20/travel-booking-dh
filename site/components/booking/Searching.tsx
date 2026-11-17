/* =====================================================================
   The searching state (spec 2b, Overwing): one cabin window with the
   hero view drifting slowly behind it, the site's one endless animation,
   only while a search runs (static under reduced motion); a 20px status
   line, then three skeleton rows in tint with Hipcamp's shimmer.
   ===================================================================== */
import { HERO_VIEW } from '@/lib/site';
import { Photo } from '@/components/Photo';

export function Searching({ line, slow, rows = 3 }: { line: string; slow?: string; rows?: number }) {
  return (
    <div className="m-searching">
      <div className="m-searching__window" aria-hidden="true">
        <Photo name={HERO_VIEW} alt="" sizes="(min-width: 1025px) 700px, 530px" className="m-searching__view" />
      </div>
      <p className="m-searching__line">{line}</p>
      <p className="m-searching__slow">{slow || ''}</p>
      <ul className="m-searching__rows" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => <li className="m-skeleton" key={i} />)}
      </ul>
    </div>
  );
}
