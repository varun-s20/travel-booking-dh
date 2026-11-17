/* =====================================================================
   Landfall (working name, a placeholder): Recommended for you
   Round 3, A5. Runs on this browser only (lib/recent.ts, "lf.recent").
   First visit (nothing in the current mode): one Rail of 8 RailCards from
   the first-visit list in lib/mock/home.ts (warm water cities for a
   winter trip, leaving out the banner cities and the first 4 deal cards).
   Returning visitor: "Pick up where you left off" (up to 4 compact search
   cards with "Search again") and "Because you looked at <city>" (8 cards:
   flights, 4 cities nearest in region and price, then 4 to the same city
   on other dates; hotels, 8 in that city by score then price, without the
   one viewed). "Clear recent searches" empties the store and the default
   comes back. On --c-shade with band joins.
   ===================================================================== */
'use client';
import { useEffect, useState } from 'react';
import Photo, { hasPhoto } from '@/components/ui/Photo';
import LandfallLine from '@/components/ui/LandfallLine';
import { Rail } from '@/components/ui/Rail';
import { ModeSwap, useMode } from '@/components/home/Mode';
import { FlightDealCard, HotelDealCard } from '@/components/home/Deals';
import { clearRecent, isFlightKind, readRecent, RECENT_EVENT, type Recent } from '@/lib/recent';
import { dayLabel, flightHref, shortRange, usd, type FlightCard, type HomeData, type HotelCard } from '@/lib/mock/home';

function useRecent(): Recent[] | null {
  const [list, setList] = useState<Recent[] | null>(null);
  useEffect(() => {
    const read = () => setList(readRecent());
    read();
    window.addEventListener(RECENT_EVENT, read);
    window.addEventListener('storage', read);
    return () => { window.removeEventListener(RECENT_EVENT, read); window.removeEventListener('storage', read); };
  }, []);
  return list;
}

function queryOf(p: Record<string, string>) { return new URLSearchParams(p).toString(); }

function SearchCardSmall({ e, data }: { e: Recent; data: HomeData }) {
  const flights = isFlightKind(e.kind);
  const p = e.params;
  const city = flights ? data.cities.find((c) => c.code === p.to) : data.cities.find((c) => c.slug === p.place);
  const photo = city?.photos[0];
  const href = flights ? `/flights?${queryOf(p)}` : e.kind === 'hotel-view' && p.hotel ? `/hotels/${p.hotel}?${queryOf(Object.fromEntries(Object.entries(p).filter(([k]) => k !== 'hotel' && k !== 'place')))}` : `/hotels?${queryOf(p)}`;
  const dates = flights ? (p.depart ? (p.return ? `${dayLabel(p.depart)} to ${dayLabel(p.return)}` : dayLabel(p.depart)) : 'Any dates')
    : (p.checkin && p.checkout ? shortRange(p.checkin, p.checkout) : 'Any dates');
  const who = flights ? (() => { const n = (+p.adults || 1) + (+p.children || 0) + (+p.infants || 0); return n === 1 ? '1 traveler' : `${n} travelers`; })()
    : `${(+p.adults || 2) + (+p.children || 0)} guests, ${+p.rooms || 1} room${(+p.rooms || 1) > 1 ? 's' : ''}`;
  return (
    <a className="m-again" href={href}>
      <span className="m-again__photo">{photo && hasPhoto(photo.name) ? <Photo name={photo.name} sizes="56px" alt="" box={false} /> : <span className="m-again__code t-code">{flights ? p.to : (city?.code ?? '')}</span>}</span>
      <span className="m-again__body">
        <span className="m-again__title">{e.label}</span>
        <span className="m-again__meta t-num">{dates}, {who}</span>
        {flights && <LandfallLine size="card" from={p.from} to={p.to} />}
        {e.price ? <span className="m-again__price t-num">From {usd(e.price)} when you looked</span> : null}
        <span className="m-again__go">Search again</span>
      </span>
    </a>
  );
}

function FirstVisit({ mode, data }: { mode: 'flights' | 'hotels'; data: HomeData }) {
  const head = (
    <>
      <h2 className="t-display t-h2" id={`reco-title-${mode}`}>Recommended for you</h2>
      <p className="o-sec__sub t-small">{mode === 'flights' ? 'Picked for November departures from London. Search once and this row follows your trips.' : 'Picked for stays by the water this winter. Search once and this row follows your trips.'}</p>
    </>
  );
  return (
    <>
      <Rail head={head} label="Recommended for you">
        {mode === 'flights' ? data.recoFlights.map((d) => <FlightDealCard key={d.code + d.depart} d={d} />) : data.recoHotels.map((h) => <HotelDealCard key={h.id} h={h} />)}
      </Rail>
    </>
  );
}

function Returning({ mode, data, list, onClear }: { mode: 'flights' | 'hotels'; data: HomeData; list: Recent[]; onClear: () => void }) {
  const flights = mode === 'flights';
  const searches = list.filter((e) => (flights ? e.kind === 'flight-search' : e.kind === 'hotel-search' || e.kind === 'hotel-view')).slice(0, 4);
  const last = list[0];
  let because: React.ReactNode = null;
  let place = '';
  if (flights) {
    const city = data.cities.find((c) => c.code === last.params.to);
    if (city) {
      place = city.name;
      const near = data.cities.filter((c) => c.code !== city.code && c.flies && c.photos.length)
        .sort((a, b) => (a.region === city.region ? 0 : 1) - (b.region === city.region ? 0 : 1) || Math.abs(a.fare - city.fare) - Math.abs(b.fare - city.fare)).slice(0, 4);
      const mk = (c: typeof city, dep: string, ret: string, i = 0): FlightCard => ({ code: c.code, city: c.name, photo: c.photos[Math.min(i, c.photos.length - 1)], depart: dep, ret, fare: c.fare, saving: c.saving, minutes: c.minutes, stops: c.stops, owner: c.owner, region: c.region, weekend: c.minutes <= 240, href: flightHref(c.code, dep, ret) });
      const d = data.dates;
      const cards = [...near.map((c) => mk(c, d.depart, d.ret)), ...(city.photos.length ? [[d.depart, d.ret], [d.alt1, d.alt1r], [d.alt2, d.alt2r], [d.wkFri, d.wkSun]].map(([a, b], i) => mk(city, a, b, i)) : [])];
      because = cards.map((c) => <FlightDealCard key={c.code + c.depart} d={c} />);
    }
  } else {
    const slug = last.params.place || data.hotels.find((h) => h.id === last.params.hotel)?.city;
    const city = data.cities.find((c) => c.slug === slug);
    if (city) {
      place = city.name;
      const cards: HotelCard[] = data.hotels.filter((h) => h.city === city.slug && h.id !== last.params.hotel && h.photo)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.nightly - b.nightly).slice(0, 8);
      because = cards.length ? cards.map((h) => <HotelDealCard key={h.id} h={h} />) : null;
    }
  }
  return (
    <>
      <div className="o-reco__head">
        <h2 className="t-display t-h2" id={`reco-title-${mode}`}>Recommended for you</h2>
        <button type="button" className="a-textbtn o-reco__clear" onClick={onClear}>Clear recent searches</button>
      </div>
      {searches.length > 0 && (
        <Rail head={<h3 className="t-h3">Pick up where you left off</h3>} label="Pick up where you left off" className="-again">
          {searches.map((e) => <SearchCardSmall key={e.at} e={e} data={data} />)}
        </Rail>
      )}
      {because && (
        <Rail head={<h3 className="t-h3">Because you looked at {place}</h3>} label={`Because you looked at ${place}`}>
          {because}
        </Rail>
      )}
    </>
  );
}

export default function Recommended({ data }: { data: HomeData }) {
  const mode = useMode();
  const list = useRecent();
  const [leaving, setLeaving] = useState(false);
  const pane = (m: 'flights' | 'hotels') => {
    const mine = (list || []).filter((e) => (m === 'flights' ? isFlightKind(e.kind) : !isFlightKind(e.kind)));
    return mine.length ? <Returning mode={m} data={data} list={mine} onClear={() => { setLeaving(true); window.setTimeout(() => { clearRecent(); setLeaving(false); }, 200); }} /> : <FirstVisit mode={m} data={data} />;
  };
  return (
    <section className={`o-sec o-reco${leaving ? ' is-leaving' : ''}`} id="recommended" aria-labelledby={`reco-title-${mode}`}>
      <div className="l-container">
        <ModeSwap flights={pane('flights')} hotels={pane('hotels')} />
      </div>
    </section>
  );
}
