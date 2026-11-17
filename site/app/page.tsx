/* =====================================================================
   travel-booking (working name Overwing, a placeholder): Home
   Sections in order: hero with the search and the cabin wall, entry
   cards (spec 2b, kept), then round 3 Part A (design/round3-spec.md,
   A3 to A13), all swapping with the Flights / Hotels mode. The footer
   comes from the layout.
   Copy word for word from content/copy.md, Home.
   ===================================================================== */
import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Search } from '@/components/search/Search';
import { CabinWall } from '@/components/home/CabinWall';
import { EntryCards } from '@/components/home/EntryCards';
import { HeroLead } from '@/components/home/r3/HeroLead';
import { HomeModes } from '@/components/home/r3/HomeModes';
import { homeData } from '@/lib/mock/home';

type Props = { searchParams: Promise<{ mode?: string | string[] }> };
const modeOf = async (p: Props) => ((await p.searchParams).mode === 'hotels' ? 'hotels' : 'flights') as 'flights' | 'hotels';

/* round 3 (spec A1): one route, the mode is a prop read from ?mode=, so a shared link renders the right page first */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const mode = await modeOf(props);
  return {
    title: { absolute: mode === 'hotels' ? 'Overwing | Book hotels' : 'Overwing | Book flights' },
    description: 'Search flights and hotels, compare them by price, time and stops, and see the full total, taxes and fees included, before you pay with Stripe.'
  };
}

export default async function Home(props: Props) {
  const mode = await modeOf(props);
  const data = homeData();
  /* no separate preload for the view: the first window's image is in the HTML, eager, with fetchpriority high,
     so the browser finds it at once; a preload link stayed in the head after client navigation and warned
     on the 404 (critic round 1) */
  return (
    <div className="t-home" data-mode={mode}>
      {/* ===== Hero: headline, the search, the facts, and the cabin wall ===== */}
      <section className="o-homeHero" aria-labelledby="home-hero-title">
        <div className="o-homeHero__inner b-wrap">
          <h1 className="o-homeHero__title a-display" id="home-hero-title">Fly there, stay there</h1>
          <HeroLead initialMode={mode} />
          <Search initial={{ mode }} />
          {/* facts from the scope only (PRD: Stripe checkout, totals with taxes and fees, confirmation email).
              Revision 2026-11-11, item 15 (client: "clear pricing"): "Taxes and fees included" replaces "Documents in your
              account"; proposed wording, for the Copywriter to confirm */}
          <ul className="o-homeHero__facts" aria-label="Booking with us">
            <li className="a-fact"><Icon name="lock" />Payments by Stripe</li>
            <li className="a-fact"><Icon name="tick" />Taxes and fees included</li>
            <li className="a-fact"><Icon name="mail" />Confirmation by email</li>
          </ul>
        </div>
        <CabinWall />
      </section>

      <EntryCards initialMode={mode} />
      {/* round 3, Part A: everything below the entry cards swaps with the mode (components/home/r3) */}
      <HomeModes data={data} initialMode={mode} />
    </div>
  );
}
