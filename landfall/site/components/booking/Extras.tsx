/* =====================================================================
   Landfall (working name, a placeholder): what comes after a booking
   Round 3, Developer B (round3-spec.md B5). For a flight booking, "Your
   stay in <city>": a Rail of four hotels in the destination for the
   booked dates, each linking to the hotel page with those dates. For a
   stay booking, "Your flight to <city>": a link to the flight search
   from London for the stay dates.
   Backend (2026-11-15): the hotels come from GET /api/hotels/search (the
   best-rated first, then the cheapest); on any error, or none, the rail
   is left out. The flight suggestion is a link only: pricing it would be
   a supplier search on every confirmation page.
   ===================================================================== */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cityOf, searchQuery, type FlightSearch, type Pax } from '@/lib/travel/flights';
import { leadsFor, nightsOf, stayQuery, type StayCard, type StaySearch } from '@/lib/travel/hotels';
import { api } from '@/lib/api';
import { addIsoDays, dayRange, money, plural } from '@/lib/format';
import { destinationPhoto } from '@/lib/data/destinations';
import { DEFAULT_ORIGIN } from '@/lib/site';
import { Rail, RailCard } from '@/components/ui/Rail';
import ScoreBadge, { scoreName } from '@/components/ui/ScoreBadge';
import Icon from '@/components/ui/Icon';

export function StayRail({ cityId, cityName, checkin, checkout, pax }: { cityId: string; cityName: string; checkin: string; checkout: string | null; pax: Pax }) {
  const search: StaySearch = { place: cityId, checkin, checkout: checkout || addIsoDays(checkin, 4), adults: Math.max(1, pax.adults), children: pax.children, rooms: 1 };
  const q = stayQuery(search);
  const [picks, setPicks] = useState<StayCard[]>([]);
  useEffect(() => {
    const ctl = new AbortController();
    api<{ results: StayCard[] }>(`/api/hotels/search?${q}`, { signal: ctl.signal }).then((r) => {
      if (ctl.signal.aborted) return;
      const list = (r.data?.results ?? []).sort((a, b) => (b.hotel.score ?? 0) - (a.hotel.score ?? 0) || a.total - b.total).slice(0, 4);
      setPicks(list);
    });
    return () => ctl.abort();
  }, [q]);
  if (picks.length === 0) return null;
  const leads = leadsFor(picks.map((p) => p.hotel));
  const nights = plural(nightsOf(search), 'night', 'nights');
  return (
    <section className="f-cf__sec bk-after" aria-labelledby="cf-stayrail">
      <Rail label={`Hotels in ${cityName}`} head={<h2 className="t-display t-h2 f-cf__h2" id="cf-stayrail">Your stay in {cityName}</h2>}>
        {picks.map((p, i) => (
          <RailCard key={p.hotel.id} href={`/hotels/${p.hotel.id}?${q}`} photo={p.hotel.photos[leads[i]]?.name} alt=""
            label={`${p.hotel.name}, ${p.hotel.area}${p.hotel.score ? `, ${scoreName(p.hotel.score, p.hotel.reviews)}` : ''}, ${money(p.total)} for ${nights}`}>
            <span className="bk-rc__name">{p.hotel.name}</span>
            <span className="t-small t-muted">{p.hotel.area}</span>
            {p.hotel.score ? <ScoreBadge score={p.hotel.score} count={p.hotel.reviews} /> : null}
            <span className="bk-rc__price"><b className="t-num">{money(p.total)}</b><span className="t-small t-muted t-num">{nights}, taxes and fees included</span></span>
          </RailCard>
        ))}
      </Rail>
      <p className="t-small t-muted bk-after__note t-num">{dayRange(search.checkin, search.checkout)}, the dates of your flights.</p>
    </section>
  );
}

export function FlightFares({ cityName, checkin, checkout, adults, children }: { cityName: string; checkin: string; checkout: string; adults: number; children: number }) {
  const code = destinationPhoto(cityName)?.code;
  if (!code || code === DEFAULT_ORIGIN.code) return null;
  const search: FlightSearch = { from: DEFAULT_ORIGIN.code, to: code, depart: checkin, ret: checkout, adults: Math.max(1, adults), children, infants: 0, cabin: 'economy' };
  const href = `/flights?${searchQuery(search)}`;
  const who = plural(search.adults + search.children, 'traveler', 'travelers');
  return (
    <section className="f-cf__sec bk-after" aria-labelledby="cf-flightfares">
      <h2 className="t-display t-h2 f-cf__h2" id="cf-flightfares">Your flight to {cityName}</h2>
      <p className="t-body t-muted t-num">Return flights from {DEFAULT_ORIGIN.city} for {dayRange(checkin, checkout)}, {who}.</p>
      <ul className="bk-fares">
        <li>
          <Link prefetch={false} className="m-card -link bk-fare" href={href} aria-label={`Search flights from ${DEFAULT_ORIGIN.city} to ${cityOf(code)}, ${dayRange(checkin, checkout)}, ${who}`}>
            <span className="bk-fare__air">{DEFAULT_ORIGIN.city} to {cityName}</span>
            <span className="bk-fare__leg t-num">{DEFAULT_ORIGIN.code}<span className="a-landfall bk-fare__line" aria-hidden="true" />{code}</span>
            <span className="t-small t-muted t-num">{dayRange(checkin, checkout)}</span>
            <span className="bk-fare__price"><span className="t-small t-muted">See flights and prices, taxes and fees included</span></span>
            <Icon name="arrow" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
