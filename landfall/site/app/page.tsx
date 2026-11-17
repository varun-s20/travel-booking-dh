/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): Home
   Round 3 (round3-spec.md, Part A). Flights is "/", Hotels "/?mode=hotels";
   the page renders the mode from searchParams so a shared link paints on
   the first frame, and the switch then runs in place on the client
   (components/home/Mode.tsx). Sections in order: hero with the search
   card, the pinned compact search, destinations, deal banners, deal
   cards, Recommended for you, trending, browse, how booking works and
   trust, popular searches, FAQs; the pre-footer band and the footer come
   from the layout. Data for both modes: lib/mock/home.ts.
   ===================================================================== */
import type { Metadata } from 'next';
import Hero, { HERO_SIZES } from '@/components/home/Hero';
import Destinations from '@/components/home/Destinations';
import { HomeMode } from '@/components/home/Mode';
import { DealBanners, DealCards } from '@/components/home/Deals';
import Recommended from '@/components/home/Recommended';
import { Browse, Popular, Trending } from '@/components/home/Explore';
import { Faqs, HowBooking } from '@/components/home/HowBooking';
import CompactSearch from '@/components/search/CompactSearch';
import { photoSrcSet } from '@/components/ui/Photo';
import { DESTINATIONS } from '@/lib/data/destinations';
import { homeData } from '@/lib/mock/home';

export const metadata: Metadata = {
  title: { absolute: 'Landfall | Flights and hotels, priced in full' },
  description: 'Search flights and hotels, compare every option by its full total with taxes and fees included, and pay by card through Stripe.'
};

type Search = Record<string, string | string[] | undefined>;

export default async function Home({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const mode = (Array.isArray(sp.mode) ? sp.mode[0] : sp.mode) === 'hotels' ? 'hotels' : 'flights';
  const data = homeData();
  const rateOf = (code: string) => data.cities.find((c) => c.code === code);
  const heroStays: Record<string, number | null> = { LIS: rateOf('LIS')?.rate ?? null, CPT: rateOf('CPT')?.rate ?? null, JFK: rateOf('JFK')?.rate ?? null };
  const destStays = Object.fromEntries(DESTINATIONS.map((d) => [d.code, { slug: rateOf(d.code)?.slug ?? '', from: rateOf(d.code)?.rate ?? null }]));
  return (
    <HomeMode initial={mode}>
      {/* the LCP image: the first hero photo, preloaded at the size the hero asks for */}
      <link rel="preload" as="image" imageSrcSet={photoSrcSet('hero/lisbon-alfama-river')} imageSizes={HERO_SIZES} fetchPriority="high" />
      <Hero stays={heroStays} />
      <CompactSearch mode="home" />
      <Destinations stays={destStays} />
      <DealBanners data={data} />
      <DealCards data={data} />
      <Recommended data={data} />
      <Trending data={data} />
      <Browse data={data} />
      <HowBooking />
      <Popular data={data} />
      <Faqs />
    </HomeMode>
  );
}
