/* =====================================================================
   Landfall (working name, a placeholder): popular destinations
   European Sleeper's price-led cards: navy, radius 24, the photo 8:5
   flush at the top with its own radius, the city in Newsreader, the fare
   in bright teal, an arrow bottom right; 3 columns at 1440, 2 from 641,
   80px rows at 390. The whole card is one link that fills To and opens
   Dates in the hero search (without JS it goes to the results page).
   Round 3 (A2): the section follows the mode. Hotels mode: "Hotels where
   the city meets the water", per-night rates, links run hotel searches
   (with JS they fill Destination and open Dates). The layout stays.
   Copy: landfall/content/copy.md, Popular destinations; round3-spec.md A2.
   ===================================================================== */
'use client';
import { DESTINATIONS, destinationHref } from '@/lib/data/destinations';
import { DEFAULT_ORIGIN } from '@/lib/site';
import { requestSearch } from '@/lib/client';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import SplitText from '@/components/ui/SplitText';
import { airportByCode, cityById, getSearch, setSearch, type Tab } from '@/components/search/store';
import { ModeSwap, useMode } from '@/components/home/Mode';

type Props = { stays: Record<string, { slug: string; from: number | null }> };

export default function Destinations({ stays }: Props) {
  const mode = useMode();
  function pick(e: React.MouseEvent, code: string) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const to = airportByCode(code);
    if (!to) return;
    e.preventDefault();
    const cur = getSearch();
    setSearch({ tab: 'flights', to, from: cur.from && cur.from.city === to.city ? null : cur.from });
    requestSearch('flights', getSearch().from ? 'dates' : 'from', `${to.city} added. Now choose your dates.`);
  }
  function pickStay(e: React.MouseEvent, slug: string) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const dest = cityById(slug);
    if (!dest) return;
    e.preventDefault();
    setSearch({ tab: 'hotels', dest });
    requestSearch('hotels', 'dates', `${dest.name} added. Now choose your dates.`);
  }

  const grid = (mode: Tab) => (
    <ul className="o-dest__grid">
      {DESTINATIONS.map((d) => {
        const st = stays[d.code];
        const hotel = mode === 'hotels';
        const line = hotel ? (st?.from ? `Hotels from $${st.from} a night` : `Hotels in ${d.city}`) : `Return from ${d.from}`;
        const href = hotel ? `/hotels?place=${st?.slug ?? ''}` : destinationHref(d);
        const name = hotel ? `${d.city}, ${line.toLowerCase()}. Search hotels in ${d.city}.` : `${d.city}, return flights from ${d.from}. Search flights to ${d.city}.`;
        return (
          <li key={d.code}>
            <a className="m-dest" href={href} onClick={(e) => (hotel ? pickStay(e, st?.slug ?? '') : pick(e, d.code))} aria-label={name}>
              <span className="m-dest__media">
                <Photo name={d.image} sizes="(min-width: 1025px) 400px, (min-width: 641px) 50vw, 100px" alt="" box={false} />
              </span>
              <span>
                <span className="m-dest__city">{d.city}</span>
                <span className="m-dest__fare t-num">{line}</span>
              </span>
              <span className="m-dest__arrow" aria-hidden="true"><Icon name="arrow" size="lg" /></span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="o-dest" id="destinations" aria-labelledby={`dest-title-${mode}`}>
      <div className="l-container">
        <ModeSwap
          flights={<>
            <SplitText as="h2" className="o-dest__title t-display t-h2" id="dest-title-flights">{`Return fares from ${DEFAULT_ORIGIN.city}`}</SplitText>
            <p className="o-dest__note t-small">The lowest return fare we&apos;ve found for one adult, taxes and fees included. Fares change often.</p>
            {grid('flights')}
          </>}
          hotels={<>
            <SplitText as="h2" className="o-dest__title t-display t-h2" id="dest-title-hotels">Hotels where the city meets the water</SplitText>
            <p className="o-dest__note t-small">The lowest nightly rate we found for two adults, taxes and fees included. Rates change often.</p>
            {grid('hotels')}
          </>}
        />
      </div>
    </section>
  );
}
