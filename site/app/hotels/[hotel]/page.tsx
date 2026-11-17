/* =====================================================================
   travel-booking (working name Overwing, a placeholder): hotel detail
   Round 3 (spec B7): the pinned compact search, back link, kicker, H1,
   address and score, then the gallery, the sticky section nav, overview,
   availability by room and rate plan, reviews, location, house rules,
   questions and similar stays (components/hotels/HotelDetail.tsx).
   Copy: content/copy.md and content/mock-catalogue.md (demo data).
   ===================================================================== */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Search } from '@/components/search/Search';
import { HotelDetail, type RoomOffer, type SimilarStay } from '@/components/hotels/HotelDetail';
import { HotelScore, topCategory, typeLine } from '@/components/hotels/HotelScore';
import { HOTELS, LOWER_RATE_NAME, cityById, freeCancelUntil, hotelById, nightsOf, parseStaySearch, roomAvailable, roomFits, stayQuery, stayTotals, type Hotel, type StaySearch } from '@/lib/mock/hotels';

type Props = { params: Promise<{ hotel: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const h = hotelById((await params).hotel);
  if (!h) return { title: 'Page not found' };
  const city = cityById(h.city)?.name;
  return { title: `${h.name}, ${city}`, description: `Rooms, prices and policies for ${h.name} in ${h.area}, ${city}. Choose a room and see the total for your dates.` };
}

function cheapest(h: Hotel, s: StaySearch): { total: number; nightly: number } | null {
  const list = h.rooms.filter((r) => roomAvailable(h, r, s)).flatMap((r) => r.plans.map((p) => stayTotals(r, s, p)));
  if (!list.length) return null;
  const best = list.sort((a, b) => a.total - b.total)[0];
  return { total: best.total, nightly: best.nightly };
}

export default async function HotelPage({ params, searchParams }: Props) {
  const h = hotelById((await params).hotel);
  if (!h) notFound();
  const parsed = parseStaySearch(await searchParams, h.city)!;
  const search = parsed.search;
  const query = stayQuery(search);
  const city = cityById(h.city)!.name;
  const rooms: RoomOffer[] = h.rooms.filter((r) => roomFits(r, search)).map((r) => ({
    id: r.id, name: r.name, spec: r.spec, beds: r.beds, size: r.size, sleeps: r.sleeps, view: r.view, amenities: r.amenities, photos: r.photos,
    available: roomAvailable(h, r, search), roomsLeft: r.roomsLeft,
    plans: r.plans.map((p) => { const t = stayTotals(r, search, p); return { id: p.id, name: p.name, nightly: t.nightly, total: t.total, refundable: p.refundable, breakfast: p.breakfast, saving: t.saving ?? 0, lower: t.lower ? LOWER_RATE_NAME[t.lower] : '' }; })
  }));
  /* similar stays: the same city and dates, showcase hotels first, then by score */
  const similar: SimilarStay[] = HOTELS.filter((x) => x.city === h.city && x.id !== h.id)
    .sort((a, b) => Number(b.showcase) - Number(a.showcase) || b.score - a.score)
    .flatMap((x) => { const c = cheapest(x, search); return c ? [{ id: x.id, name: x.name, kicker: typeLine(x), area: x.area, distanceKm: x.distanceKm, score: x.score, word: x.scoreWord, reviews: x.reviewCount, photo: x.photos[0].name, total: c.total, nightly: c.nightly }] : []; })
    .slice(0, 4);
  const top = topCategory(h);
  return (
    <div className="t-hotel">
      <div className="o-pinned">
        <Search key={query} variant="compact" initial={{ mode: 'hotels', hotels: search }} />
      </div>
      <div className="b-wrap">
        <div className="o-pageHead -detail o-hotelHead">
          <Link className="a-back" href={`/hotels?${query}`}><Icon name="chev-left" size="s" />Back to results</Link>
          <div className="o-hotelHead__row">
            <div className="o-hotelHead__main">
              <p className="o-hotelHead__kicker">{typeLine(h)}</p>
              <h1 className="a-h1">{h.name}</h1>
              <ul className="o-hotel__metaRow">
                <li><Icon name="pin" size="s" />{h.address}</li>
                <li>{h.distanceKm.toFixed(1)} km from the center</li>
                <li><a className="a-link" href="#location">Show on map</a></li>
              </ul>
            </div>
            <a className="o-hotelHead__score" href={h.reviews.length ? '#reviews' : '#location'}>
              <HotelScore score={h.score} word={h.scoreWord} reviews={h.reviewCount} extra={top ?? undefined} />
            </a>
          </div>
        </div>
        <HotelDetail hotel={h} city={city} search={search} query={query} nights={nightsOf(search)} rooms={rooms} cancelUntil={freeCancelUntil(search)} similar={similar} />
      </div>
    </div>
  );
}
