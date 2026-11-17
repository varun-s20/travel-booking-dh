'use client';
/* =====================================================================
   Popular destinations. Revision 2026-11-11, item 18 (client: "strong
   travel imagery"): the city photo fills a tall cabin-window shape, and
   under it, on the page, the city, the lowest return fare and what it
   covers (Monocle's mat is gone). The Hoxton's region pills filter the
   grid (aria-pressed; hover differs from selected). The whole card is
   one link to flight results for that city.
   Copy: content/copy.md, Popular destinations.
   ===================================================================== */
import { AppLink as Link } from '@/components/AppLink';
import { useState } from 'react';
import { Photo } from '@/components/Photo';
import { DESTINATIONS, REGIONS, destinationHref, type Region } from '@/lib/data/destinations';

/* the square photo is drawn as tall as the 236:318 window (object-fit cover): 385px tall at 1440 in four 286px columns
   (the root scales past it), a third of the column on tablets, the 240px card in the phone rail (323px tall) */
const SIZES = '(min-width: 1441px) 27vw, (min-width: 1025px) 386px, (min-width: 641px) calc(45vw - 40px), 324px';

export function Destinations() {
  const [region, setRegion] = useState<Region>('All');
  const shown = DESTINATIONS.filter((d) => region === 'All' || d.region === region);

  return (
    <section className="o-homeDest b-wrap" aria-labelledby="home-dest-title">
      <div className="o-homeDest__head">
        <h2 className="a-h2" id="home-dest-title">Cities worth the flight</h2>
        <div className="o-homeDest__pills" role="group" aria-labelledby="home-dest-title">
          {REGIONS.map((r) => (
            <button key={r} className="a-choice" type="button" aria-pressed={r === region} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <ul className="o-homeDest__grid">
          {shown.map((d) => (
            <li key={d.city}>
              <Link className="m-dest" href={destinationHref(d)} aria-label={`${d.city}, return flights from ${d.from} for 1 adult. Search flights to ${d.city}.`}>
                <span className="m-dest__window">
                  <Photo name={d.image} alt={d.alt} sizes={SIZES} className="m-dest__img" />
                </span>
                <span className="m-dest__name">{d.city}</span>
                <span className="m-dest__price">Return from {d.from}</span>
                {/* Chief Officer, 11 Nov: "taxes and fees included" was on every card; the note under the grid and the hero chip
                    keep it. "Return" already leads the price line, so this line names the traveler only (for the Copywriter) */}
                <span className="m-dest__note">1 adult</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="o-homeDest__empty">No cities here yet. Try another region.</p>
      )}

      <p className="o-homeDest__note a-small">Lowest return fare we’ve found for one adult from London, taxes and fees included. Fares change often and are confirmed before you pay.</p>
    </section>
  );
}
