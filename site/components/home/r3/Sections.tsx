'use client';
/* =====================================================================
   Round 3 home sections (Developer A, spec A3 to A12). Every section has
   a flight and a hotel version in the same slot (spec A1); the switch
   drops the blinds over its photos, swaps the content and lifts them.
   Lines come from the spec and from content/mock-catalogue.md sections 5
   and 6, word for word. Every link is a real search or a real page.
   ===================================================================== */
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Save } from '@/components/ui/Save';
import { Score } from '@/components/ui/Score';
import { toast } from '@/lib/client';
import { clearHistory, type History, type SearchEntry } from '@/lib/history';
import { REGIONS6, type HomeData, type Region6, type CityCard, type StayDeal } from '@/lib/mock/home';
import {
  addDays, dayRangeLong, defaultTrip, flightHref, hotelHref, recommendRows, routeItem, shortRange, stayItem, staysHref,
  cityPhotoPlan, firstVisitRouteSlugs, photoPicker, weekendStays, trendingRoutes, trendingStayCities, usd, type Mode
} from '@/lib/recommend';
import { AirlineMark, Blind, Rail, RouteCard, StayCard, Tabs, kicker } from './Cards';

const regionSlug = (r: string) => r.toLowerCase().replace(/ /g, '-');
type P = { data: HomeData; mode: Mode };

/* ===== A3. Pick up where you left off (only with history) ===== */
function shiftPast(s: SearchEntry, today: string): { a: string; b: string; moved: boolean } | null {
  const a0 = s.mode === 'flights' ? s.depart : s.checkin;
  const b0 = s.mode === 'flights' ? (s.return ?? s.depart) : s.checkout;
  if (!a0 || !b0) return null;
  if (a0 >= today) return { a: a0, b: b0, moved: false };
  let a = a0, b = b0;
  while (a < today) { a = addDays(a, 7); b = addDays(b, 7); }
  return { a, b, moved: true };
}
export function RecentSearches({ data, mode, history }: P & { history: History | null }) {
  const list = (history?.searches ?? []).filter((s) => s.mode === mode).slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="o-r3 o-recent b-wrap r3-swap" aria-labelledby="recent-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="recent-title">Pick up where you left off</h2>
        <button className="a-link o-recent__clear" type="button" onClick={() => { clearHistory(); toast('Recent searches cleared'); }}>Clear recent searches</button>
      </div>
      <ul className="o-recent__list">
        {list.map((s, i) => {
          const dates = shiftPast(s, data.today);
          const city = data.cities.find((c) => (s.mode === 'flights' ? c.iata === s.to : c.slug === s.place));
          if (!dates || !city) return null;
          const people = s.mode === 'flights' ? `${s.adults} ${s.adults === 1 ? 'adult' : 'adults'}${s.children ? `, ${s.children} ${s.children === 1 ? 'child' : 'children'}` : ''}` : `${s.adults} ${s.adults === 1 ? 'adult' : 'adults'}${s.children ? `, ${s.children} ${s.children === 1 ? 'child' : 'children'}` : ''}`;
          const href = s.mode === 'flights'
            ? flightHref(city.iata, dates.a, s.return ? dates.b : null, s.adults, s.cabin ?? 'economy')
            : staysHref(city.slug, dates.a, dates.b, s.adults, s.rooms ?? 1);
          return (
            <li key={`${s.mode}-${s.to ?? s.place}`}>
              <Link className="m-recent" href={href}>
                <span className="m-recent__win"><Photo name={city.photo} alt="" sizes="56px" className="m-recent__img" /><Blind i={i} /></span>
                <span className="m-recent__text r3-text">
                  <span className="m-recent__title">{s.mode === 'flights' ? `London to ${city.name}` : city.name}</span>
                  <span className="m-recent__meta">{shortRange(dates.a, dates.b)}, {people}{s.mode === 'flights' ? `, ${s.cabin === 'premium' ? 'Premium economy' : s.cabin === 'business' ? 'Business' : s.cabin === 'first' ? 'First' : 'Economy'}` : `, ${s.rooms ?? 1} ${(s.rooms ?? 1) === 1 ? 'room' : 'rooms'}`}</span>
                  <span className="m-recent__price">{s.mode === 'flights' ? `Return from ${usd(city.returnFrom)} for 1 adult` : `From ${usd(city.fromNightly ?? 0)} a night`}</span>
                  {dates.moved && <span className="m-recent__moved">Dates moved to {shortRange(dates.a, dates.b)}</span>}
                </span>
                <Icon name="chev-right" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="o-r3__fine r3-text">Based on your recent searches on this device.</p>
    </section>
  );
}

/* ===== A4. Recommended for you ===== */
export function Recommended({ data, mode, history }: P & { history: History | null }) {
  const rows = useMemo(() => recommendRows(data, history, mode), [data, history, mode]);
  const [pick, setPick] = useState(0);
  useEffect(() => setPick(0), [mode, rows.length]);
  const row = rows[Math.min(pick, rows.length - 1)];
  if (!row) return null;
  const titles = rows.map((r) => r.title);
  const seeAll = row.routes ? flightHref(row.routes[0].city.iata, row.routes[0].depart, row.routes[0].ret) : row.stays ? staysHref(row.stays[0].hotel.city, row.stays[0].checkin, row.stays[0].checkout) : '/';
  return (
    <section className="o-r3 o-rec b-wrap r3-swap" aria-labelledby="rec-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="rec-title">Recommended for you</h2>
      </div>
      <Tabs items={titles} value={row.title} onChange={(t) => setPick(titles.indexOf(t))} label="Recommendations" />
      <p className="o-r3__sub r3-text">{row.reason}</p>
      <Rail label={row.title} key={`${mode}-${row.id}`}>
        {(() => { const plan = cityPhotoPlan(data, sixOf(data), bannerSlugs(data)); return row.routes?.map((it, i) => <li key={it.city.slug}><RouteCard item={it} i={i} photo={plan.rec.get(it.city.slug)?.photo} /></li>); })()}
        {(() => { const pick = photoPicker(data); return row.stays?.map((it, i) => <li key={it.hotel.id}><StayCard item={it} i={i} photo={pick(it.hotel)} /></li>); })()}
      </Rail>
      <p className="o-r3__fine r3-text">
        {row.stays ? 'Totals for 2 adults, taxes and fees included.' : 'Return fares for one adult in Economy from London Heathrow, taxes and fees included.'}
        {' '}<Link className="o-r3__seeAll" href={seeAll}>See all</Link>
      </p>
    </section>
  );
}

/* ===== A5. Deal banner (navy wall) ===== */
/* the two biggest savings not already in the 8 deal cards, trending windows first left out (critic: the banner
   repeated deal cards 1 and 2) */
function bannerSlugs(data: HomeData): string[] {
  const rest = data.fareDeals.slice(8);
  const six = sixOf(data), rec = firstVisitRouteSlugs(data);
  const free = (slug: string) => !six.includes(slug) && !rec.includes(slug);
  const pool = [...rest.filter((f) => free(f.slug)), ...rest.filter((f) => !free(f.slug))];
  return (pool.length >= 2 ? pool : data.fareDeals).slice(0, 2).map((f) => f.slug);
}
type BannerItem = { key: string; name: string; photo: string; price: string; save: string; href: string; graded: boolean; label: string };
function bannerItems(data: HomeData, mode: Mode): BannerItem[] {
  if (mode === 'flights') {
    const plan = cityPhotoPlan(data, sixOf(data), bannerSlugs(data));
    return bannerSlugs(data).map((slug) => data.fareDeals.find((f) => f.slug === slug)!).map((f) => {
      const c = data.cities.find((x) => x.slug === f.slug)!;
      return { key: f.slug, name: c.name, photo: plan.banner.get(c.slug)?.photo ?? c.photo, graded: true, price: `Return from ${usd(f.price)}`, save: `${usd(f.saving)} below the typical fare`, href: flightHref(c.iata, f.depart, f.ret),
        label: `Return flights to ${c.name} from ${usd(f.price)}, ${usd(f.saving)} below the typical fare from London. See flights.` };
    });
  }
  const spool = data.stayDeals.slice(8);
  return (spool.length >= 2 ? spool : data.stayDeals).slice(0, 2).map((s) => {
    const h = data.hotels.find((x) => x.id === s.hotelId)!;
    const c = data.cities.find((x) => x.slug === h.city)!;
    return { key: s.hotelId, name: c.name, photo: c.photo, graded: true, price: `from ${usd(s.price)} a night`, save: `${usd(s.saving)} below the usual rate`, href: hotelHref(h.id, s.checkin, s.checkout),
      label: `${h.name}, ${c.name}: rooms from ${usd(s.price)} a night, ${usd(s.saving)} below the usual rate. See rooms.` };
  });
}
export function DealBanner({ data, mode }: P) {
  const items = bannerItems(data, mode);
  if (items.length < 2) return null;
  const f = mode === 'flights';
  return (
    <section className="o-r3 o-dealBand r3-swap" aria-labelledby="banner-title">
      <div className="o-dealBand__panel is-dark">
        <div className="o-dealBand__copy r3-text">
          <h2 className="a-h2" id="banner-title">{f ? 'Lower fares this week' : 'Lower rates this week'}</h2>
          <p className="o-dealBand__line">{f
            ? 'Fares on these routes are under their usual price for the dates shown. Prices change, and we check them again before you pay.'
            : 'These stays cost less than usual for the dates shown. We check the rate again before you pay.'}</p>
          <a className="a-button -light" href="#deals"><span className="a-button__label">{f ? 'See all fare deals' : 'See all stay deals'}</span><Icon name="arrow" className="a-button__icon" /></a>
        </div>
        <ul className="o-dealBand__wins">
          {items.map((it, i) => (
            <li key={it.key}>
              <Link className="m-bwin" href={it.href} aria-label={it.label}>
                <span className="m-bwin__frame"><Photo name={it.photo} alt="" sizes="(min-width: 1025px) 200px, 140px" className="m-bwin__img" graded={it.graded} /><Blind i={i} /></span>
                <span className="m-bwin__tag r3-text">
                  <span className="m-bwin__city">{it.name}</span>
                  <span className="m-bwin__price">{it.price}</span>
                  <span className="m-bwin__save"><Icon name="trend-down" />{it.save}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ===== A6. Deal cards (#deals) ===== */
const STAY_TAG = (s: StayDeal) => (s.kind === 'weekend' ? 'Weekend rate' : s.kind === 'weeknight' ? 'Weeknight rate' : s.kind === 'long' ? 'Long-stay rate' : `${s.month} rate`);
/* dates and "a night" never split across lines (critic: orphan "Nov / 13 to 15", lone "a night") */
const nb = (t: string) => t.replace(/ /g, ' ');
const STAY_REASON = (s: StayDeal) => (s.kind === 'weekend' ? `Lower rate for Friday and Saturday nights, ${nb(shortRange(s.checkin, s.checkout))}`
  : s.kind === 'weeknight' ? `Lower rate on Sunday to Thursday nights until ${nb(shortRange(s.endDate!, s.endDate!).replace(/ to \d+$/, ''))}`
  : s.kind === 'long' ? 'Lower rate when you stay 4 nights or more' : `Lower rate on every night in ${s.month}`);

export function DealCards({ data, mode }: P) {
  const [region, setRegion] = useState<'All' | Region6>('All');
  const [more, setMore] = useState(false);
  useEffect(() => { setRegion('All'); setMore(false); }, [mode]);
  const cityOf = (slug: string) => data.cities.find((c) => c.slug === slug)!;
  const f = mode === 'flights';
  const fare = data.fareDeals.filter((d) => region === 'All' || cityOf(d.slug).region === region);
  const stay = data.stayDeals.filter((d) => { const h = data.hotels.find((x) => x.id === d.hotelId)!; return region === 'All' || cityOf(h.city).region === region; });
  const regions = REGIONS6.filter((r) => (f ? data.fareDeals.some((d) => cityOf(d.slug).region === r) : data.stayDeals.some((d) => cityOf(data.hotels.find((x) => x.id === d.hotelId)!.city).region === r)));
  const count = f ? fare.length : stay.length;
  if (!data.fareDeals.length && f) return null;
  return (
    <section className={`o-r3 o-deals b-wrap r3-swap${more ? ' is-more' : ''}`} id="deals" aria-labelledby="deals-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="deals-title">{f ? 'Fare deals from London' : 'Stay deals'}</h2>
      </div>
      <Tabs items={['All', ...regions] as ('All' | Region6)[]} value={region} onChange={(r) => { setRegion(r); setMore(false); }} label={f ? 'Fare deals by region' : 'Stay deals by region'} />
      <ul className="o-deals__grid">
        {f && fare.slice(0, 8).map((d, i) => {
          const c = cityOf(d.slug);
          const nonstop = d.nonstop;
          return (
            <li key={d.slug}>
              <Link className="m-hcard -deal" href={flightHref(c.iata, d.depart, d.ret)} aria-label={`London to ${c.name}, ${dayRangeLong(d.depart, d.ret)}, ${d.airline}. Return from ${usd(d.price)}. ${usd(d.saving)} below the typical fare for this route. See flights.`}>
                <span className="m-hcard__media"><Photo name={cityPhotoPlan(data, sixOf(data), bannerSlugs(data)).deal.get(c.slug)?.photo ?? c.photo2} alt="" sizes="(min-width: 1025px) 286px, (min-width: 641px) 30vw, 100vw" className="m-hcard__img" /><Blind i={i} /><Save className="m-hcard__tag">{usd(d.saving)} below the typical fare</Save></span>
                <span className="m-hcard__body r3-text">
                  <span className="m-hcard__kicker">{nonstop ? 'Nonstop' : '1 stop'}</span>
                  <span className="m-hcard__title">London to {c.name}</span>
                  <span className="m-hcard__meta">{dayRangeLong(d.depart, d.ret)}</span>
                  <span className="m-hcard__line"><Icon name="plane" />{d.airline}, {nonstop ? `${c.flightTime} each way` : `1 stop, from ${c.flightTime}`}</span>
                  <span className="m-hcard__foot">
                    <span className="m-hcard__price"><small>Return from</small> {usd(d.price)}</span>
                    <span className="m-hcard__note">for 1 adult in Economy, taxes and fees included</span>
                    <span className="m-hcard__typical">Typical fare {usd(d.usual)}</span>
                  </span>
                  <span className="m-hcard__cta">See flights<Icon name="arrow" /></span>
                </span>
              </Link>
            </li>
          );
        })}
        {!f && (() => { const pick = photoPicker(data); return stay.slice(0, 8).map((d, i) => {
          const h = data.hotels.find((x) => x.id === d.hotelId)!;
          const ph = pick(h);
          return (
            <li key={d.hotelId}>
              <Link className="m-hcard -deal -stay" href={hotelHref(h.id, d.checkin, d.checkout)} aria-label={`${h.name}, ${h.area}, ${h.cityName}. ${usd(d.price)} a night, usually ${usd(d.usual)}. ${STAY_REASON(d)}.`}>
                <span className="m-hcard__media"><Photo name={ph.photo} alt="" sizes="(min-width: 1025px) 286px, (min-width: 641px) 30vw, 100vw" className="m-hcard__img" graded={false} /><Blind i={i} /><Save className="m-hcard__tag">{usd(d.saving)} below the usual rate</Save></span>
                <span className="m-hcard__body r3-text">
                  <span className="m-hcard__kicker">{STAY_TAG(d).replace(/ rate$/, '')}, {h.stars}-star {h.type.toLowerCase()}</span>
                  <span className="m-hcard__title -clamp">{h.name}</span>
                  <span className="m-hcard__meta">{h.area}, {h.cityName}</span>
                  <Score score={h.score} word={h.scoreWord} count={h.reviewCount} size="s" />
                  <span className="m-hcard__foot">
                    <span className="m-hcard__price">{usd(d.price)} <small>a night, usually {usd(d.usual)}</small></span>
                    <span className="m-hcard__note">{STAY_REASON(d)}</span>
                  </span>
                  <span className="m-hcard__cta">See rooms<Icon name="arrow" /></span>
                </span>
              </Link>
            </li>
          );
        }); })()}
      </ul>
      {count > 4 && !more && <button className="a-button -soft o-deals__more" type="button" onClick={() => setMore(true)}><span className="a-button__label">Show more deals</span></button>}
      <p className="o-r3__fine r3-text">{f ? 'Typical fare: the usual price for the same trip.' : 'Typical rate: the usual price for the same stay.'}</p>
    </section>
  );
}

/* ===== A7. Trending ===== */
const SIX = ['lisbon', 'rome', 'new-york', 'mexico-city', 'tokyo', 'cape-town'];
/* the six trending windows: the biggest savings among cities the first-visit Recommended row does not show, so a city
   photo is not used three times on the page (critic, round 3, second pass); the old fixed six if fewer qualify */
function sixOf(data: HomeData): string[] {
  const rec = new Set(firstVisitRouteSlugs(data));
  const pick = trendingRoutes(data).filter((c) => !rec.has(c.slug)).slice(0, 6).map((c) => c.slug);
  return pick.length === 6 ? pick : SIX;
}
export function Trending({ data, mode }: P) {
  const trip = defaultTrip(data.today);
  if (mode === 'flights') {
    const sixSlugs = sixOf(data);
    const six = sixSlugs.map((s) => data.cities.find((c) => c.slug === s)).filter((c): c is CityCard => !!c);
    const list = trendingRoutes(data).filter((c) => !sixSlugs.includes(c.slug)).slice(0, 12);
    return (
      <section className="o-r3 o-trend b-wrap r3-swap" aria-labelledby="trend-title">
        <div className="o-r3__head r3-text">
          <h2 className="a-h2" id="trend-title">Trending routes from London</h2>
          <p className="o-r3__sub">From London Heathrow, return, 1 adult, Economy</p>
        </div>
        <div className="o-trend__split">
          <ul className="o-trend__wins">
            {six.map((c, i) => (
              <li key={c.slug}>
                <Link className="m-dest" href={flightHref(c.iata, trip.depart, trip.ret)} aria-label={`${c.name}, return flights from ${usd(c.returnFrom)} for 1 adult. Search flights to ${c.name}.`}>
                  <span className="m-dest__window"><Photo name={c.photo} alt={c.alt} sizes="(min-width: 1025px) 236px, (min-width: 641px) 30vw, 240px" className="m-dest__img" /><Blind i={i} /></span>
                  <span className="m-dest__name r3-text">{c.name}</span>
                  <span className="m-dest__price r3-text">Return from {usd(c.returnFrom)}</span>
                  <span className="m-dest__note r3-text">1 adult</span>
                </Link>
              </li>
            ))}
          </ul>
          <ol className="o-trend__list" aria-label="More trending routes, most trending first">
            {list.map((c, i) => (
              <li key={c.slug}>
                <Link className="m-trow" href={flightHref(c.iata, trip.depart, trip.ret)}>
                  <span className="m-trow__win"><Photo name={c.photo} alt="" sizes="40px" className="m-trow__img" /><Blind i={i} /></span>
                  <span className="m-trow__text r3-text">
                    <span className="m-trow__title">London to {c.name}</span>
                    <span className="m-trow__meta">{c.nonstop ? `Nonstop, ${c.flightTime}` : `1 stop, from ${c.flightTime}`}, {c.airlines.length} {c.airlines.length === 1 ? 'airline' : 'airlines'}</span>
                  </span>
                  <span className="m-trow__price r3-text">{usd(c.returnFrom)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <p className="o-r3__fine r3-text">Lowest return fare we’ve found for one adult from London, taxes and fees included. Fares change often and are confirmed before you pay.</p>
      </section>
    );
  }
  const five = trendingStayCities(data).slice(0, 5);
  return (
    <section className="o-r3 o-trend -stays b-wrap r3-swap" aria-labelledby="trend-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="trend-title">Trending cities to stay in</h2>
        <p className="o-r3__sub">{dayRangeLong(data.weekend.checkin, data.weekend.checkout)}, 2 adults, 1 room</p>
      </div>
      <ul className="o-trend__cities">
        {five.map((c, i) => (
          <li key={c.slug}>
            <Link className="m-city" href={staysHref(c.slug, data.weekend.checkin, data.weekend.checkout)} aria-label={`${c.name}: ${c.hotelCount} stays, from ${usd(c.fromNightly ?? 0)} a night. Search stays in ${c.name}.`}>
              <span className="m-city__win"><Photo name={c.photo2} alt={c.alt2} sizes={i < 2 ? '(min-width: 1025px) 592px, 100vw' : '(min-width: 1025px) 389px, 100vw'} className="m-city__img" /><Blind i={i} /></span>
              <span className="m-city__name r3-text">{c.name}</span>
              <span className="m-city__meta r3-text">{c.hotelCount} stays, from {usd(c.fromNightly ?? 0)} a night</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ===== A8. Browse (navy wall) ===== */
export function Browse({ data, mode }: P) {
  /* default tab: the region with the fewest cities already shown above at card size (deal cards, trending windows,
     first-visit Recommended), so the same city photo does not come round again (critic, round 3, second pass) */
  const [region, setRegion] = useState<Region6>(() => {
    const plan = cityPhotoPlan(data, sixOf(data), bannerSlugs(data));
    const cost = (r: Region6) => plan.regionCost(data.cities.filter((c) => c.region === r).map((c) => c.slug));
    return [...REGIONS6].sort((a, b) => cost(a) - cost(b) || REGIONS6.indexOf(a) - REGIONS6.indexOf(b))[0];
  });
  const trip = defaultTrip(data.today);
  const lastPlace = 'lisbon';
  if (mode === 'flights') {
    const cities = data.cities.filter((c) => c.region === region);
    return (
      <section className="o-r3 o-browse r3-swap" aria-labelledby="browse-title">
        <div className="o-browse__panel is-dark">
          <div className="o-r3__head r3-text">
            <h2 className="a-h2" id="browse-title">Explore by region</h2>
            <a className="o-browse__all" href="#city-grid">All {data.cities.length} cities</a>
          </div>
          <Tabs items={REGIONS6} value={region} onChange={(v) => setRegion(v as typeof region)} label="Regions" dark />
          <ul className="o-browse__wins">
            {cities.map((c, i) => (
              <li key={c.slug}>
                <Link className="m-dest -dark" href={flightHref(c.iata, trip.depart, trip.ret)} aria-label={`${c.name}, ${c.country}. Return from ${usd(c.returnFrom)}, ${c.nonstop ? 'nonstop' : '1 stop'}, ${c.flightTime}.`}>
                  <span className="m-dest__window"><Photo name={cityPhotoPlan(data, sixOf(data), bannerSlugs(data)).region.get(c.slug)?.photo ?? c.photo2} alt={cityPhotoPlan(data, sixOf(data), bannerSlugs(data)).region.get(c.slug)?.alt ?? c.alt2} sizes="(min-width: 1025px) 236px, (min-width: 641px) 22vw, 45vw" className="m-dest__img" /><Blind i={i} /></span>
                  <span className="m-dest__name r3-text">{c.name}</span>
                  <span className="m-dest__blurb r3-text">{c.blurb}</span>
                  <span className="m-dest__price r3-text">Return from {usd(c.returnFrom)}</span>
                  <span className="m-dest__note r3-text">{c.nonstop ? `Nonstop, ${c.flightTime}` : `1 stop, from ${c.flightTime}`}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  const hotelCities = data.cities.filter((c) => c.hasHotels);
  return (
    <section className="o-r3 o-browse -types r3-swap" aria-labelledby="browse-title">
      <div className="o-browse__panel is-dark">
        <div className="o-r3__head r3-text">
          <h2 className="a-h2" id="browse-title">Browse by property type</h2>
        </div>
        <ul className="o-browse__types">
          {data.types.map((t, i) => (
            <li key={t.type}>
              <Link className="m-type" href={staysHref(lastPlace, data.weekend.checkin, data.weekend.checkout, 2, 1, t.type.toLowerCase().replace(/ /g, '-'))} aria-label={`${t.label}: ${t.count} stays, from ${usd(t.fromNightly)} a night. Search ${t.label.toLowerCase()} in Lisbon.`}>
                <span className="m-type__win"><Photo name={t.photo} alt={t.alt} sizes="(min-width: 1025px) 176px, 30vw" className="m-type__img" /><Blind i={i} /></span>
                <span className="m-type__label r3-text">{t.label}</span>
                <span className="m-type__meta r3-text">{t.count} stays, from {usd(t.fromNightly)} a night</span>
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="o-browse__sub r3-text">Stay in a city</h3>
        <ul className="o-browse__pills">
          {hotelCities.map((c) => (
            <li key={c.slug}><Link className="m-cpill" href={staysHref(c.slug, data.weekend.checkin, data.weekend.checkout)}>{c.name}<span>from {usd(c.fromNightly ?? 0)} a night</span></Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ===== A9. Cheapest months to fly (#when) / Stays for this weekend (#weekend) ===== */
/* arrow keys, Home and End move between the month bars (critic, round 3 second pass); Tab still enters and leaves */
function barKeys(e: KeyboardEvent<HTMLOListElement>) {
  const links = [...e.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
  const i = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (i < 0) return;
  const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1 : null;
  if (next === null) return;
  e.preventDefault();
  links[Math.max(0, Math.min(links.length - 1, next))].focus();
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function Timing({ data, mode, history }: P & { history: History | null }) {
  const routes = Object.keys(data.months).filter((k) => data.months[k].length);
  const last = history?.searches.find((s) => s.mode === 'flights' && s.to && data.months[s.to!]);
  const [route, setRoute] = useState<string>('LIS');
  useEffect(() => { if (last?.to) setRoute(last.to); }, [last?.to]);
  if (mode === 'hotels') {
    const w = data.weekend;
    const list = weekendStays(data, history);
    return (
      <section className="o-r3 o-week b-wrap r3-swap" id="weekend" aria-labelledby="week-title">
        <div className="o-r3__head r3-text">
          <h2 className="a-h2" id="week-title">Stays for this weekend</h2>
          <p className="o-r3__sub">{dayRangeLong(w.checkin, w.checkout)}, 2 adults</p>
        </div>
        <Rail label="Stays for this weekend">
          {(() => { const pick = photoPicker(data); return list.map((h, i) => <li key={h.id}><StayCard item={stayItem(h, w.checkin, w.checkout)} i={i} photo={pick(h)} /></li>); })()}
        </Rail>
        <p className="o-r3__fine r3-text">Totals for 2 nights and 2 adults, taxes and fees included.</p>
      </section>
    );
  }
  const months = data.months[route] ?? data.months[routes[0]] ?? [];
  const city = data.cities.find((c) => c.iata === route);
  if (!months.length || !city) return null;
  const max = Math.max(...months.map((m) => m.avg)), min = Math.min(...months.map((m) => m.avg));
  /* the three months with the lowest average fare are marked (ties broken by date) */
  const cheapest = [...months].sort((a, b) => a.avg - b.avg || a.month.localeCompare(b.month)).slice(0, 3).map((m) => m.month);
  const lowest = [...months].sort((a, b) => a.total - b.total || a.depart.localeCompare(b.depart))[0];
  const heightOf = (t: number) => (max === min ? 60 : Math.round(30 + ((t - min) / (max - min)) * 70));
  return (
    <section className="o-r3 o-when b-wrap r3-swap" id="when" aria-labelledby="when-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="when-title">Cheapest months to fly</h2>
        <label className="o-when__pick">
          <span>Route</span>
          <select value={route} onChange={(e) => setRoute(e.target.value)}>
            {routes.map((k) => { const c = data.cities.find((x) => x.iata === k); return c ? <option key={k} value={k}>London to {c.name}</option> : null; })}
          </select>
          <Icon name="chev-down" />
        </label>
      </div>
      <p className="o-r3__sub r3-text">London to {city.name}, the average lowest return in each month for 1 adult in Economy, 7 nights, taxes and fees included. Cheapest date found: {dayRangeLong(lowest.depart, addDays(lowest.depart, 7))}, {usd(lowest.total)}.</p>
      <ol className="o-when__bars" aria-label={`Average lowest return by month, London to ${city.name}`} onKeyDown={barKeys}>
        {months.map((m, i) => {
          const mi = Number(m.month.slice(5)) - 1;
          const low = cheapest.includes(m.month);
          const hasDate = lowest && m.month === lowest.depart.slice(0, 7);
          return (
            <li key={m.month} className={[low && 'is-low', hasDate && 'is-date'].filter(Boolean).join(' ') || undefined}>
              <Link className="m-bar" href={flightHref(city.iata, m.depart, addDays(m.depart, 7))} aria-label={`${MONTH_FULL[mi]} ${m.month.slice(0, 4)}: average ${usd(m.avg)}, lowest ${usd(m.total)}${low ? ', one of the cheapest months' : ''}${hasDate ? ', has the cheapest date' : ''}. Search its cheapest dates.`}>
                <span className="m-bar__price" aria-hidden="true">{usd(m.avg)}</span>
                <span className="m-bar__fill" style={{ height: `${heightOf(m.avg)}%`, ['--i' as string]: i % 4 }} />
                <span className="m-bar__month" aria-hidden="true">{MON[mi]}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="sr-only"><table>
        <caption>Average lowest return fare by month, London to {city.name}</caption>
        <thead><tr><th scope="col">Month</th><th scope="col">Average lowest return</th><th scope="col">Lowest return</th></tr></thead>
        <tbody>{months.map((m) => <tr key={m.month}><td>{MONTH_FULL[Number(m.month.slice(5)) - 1]} {m.month.slice(0, 4)}</td><td>{usd(m.avg)}</td><td>{usd(m.total)}</td></tr>)}</tbody>
      </table></div>
      <p className="o-r3__fine r3-text">The three cheapest months on average are filled; the dot marks the month with the cheapest date. Choose a month to search its cheapest dates.</p>
    </section>
  );
}

/* ===== A10a. How booking works (a line with four stops, no numbers) ===== */
const STEPS = {
  flights: [
    { icon: 'search', title: 'Search and compare', text: 'Every fare shows the total for all travelers, taxes and fees included.' },
    { icon: 'plane', title: 'Pick your fare', text: 'Light, Classic or Flex. Each one lists the bags, seat and changes it includes.' },
    { icon: 'people', title: 'Add travelers', text: 'Names as they appear on the passport. Save them to your account for next time.' },
    { icon: 'lock', title: 'Pay with Stripe', text: 'We check the fare again before you pay. Your e-ticket and reference arrive by email.' }
  ],
  hotels: [
    { icon: 'search', title: 'Search and compare', text: 'Each stay shows the total for your dates, with the price a night beside it.' },
    { icon: 'bed', title: 'Choose a room and rate', text: 'Rates list the meals, the cancellation terms and how many rooms are left.' },
    { icon: 'people', title: 'Add guest details', text: 'The lead guest’s name goes to the hotel with your check-in time.' },
    { icon: 'lock', title: 'Pay with Stripe', text: 'We check the rate again before you pay. Your reference arrives by email.' }
  ]
};
export function HowItWorks({ mode }: { mode: Mode }) {
  return (
    <section className="o-r3 o-how b-wrap r3-swap" aria-labelledby="how-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="how-title">{mode === 'flights' ? 'Booking a flight' : 'Booking a hotel'}</h2>
      </div>
      <ol className="o-how__track r3-text">
        {STEPS[mode].map((s) => (
          <li key={s.title} className="o-how__stop">
            <span className="o-how__dot"><Icon name={s.icon} /></span>
            <span className="o-how__title">{s.title}</span>
            <span className="o-how__text">{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ===== A11. Questions before you book (#faq) ===== */
const FAQS = {
  flights: [
    ['Is the price I see the price I pay?', 'Yes. Every fare shows the total for all travelers with taxes and fees included. We check it with the airline again just before you pay, and if it has changed we show you the new total before you confirm.'],
    ['Why did a fare change after I picked it?', 'Airlines hold a fare for a short time, usually about 30 minutes. If the hold runs out, we fetch the fare again and show you the new price.'],
    ['Which bags are included?', 'Each fare lists them: a personal item, a cabin bag and checked bags where included. Compare Light, Classic and Flex on the fare step.'],
    ['Can I change or cancel a flight?', 'It depends on the fare. Flex fares usually allow changes, Light fares usually do not. The fare’s own rules are on the fare step and in your booking.'],
    ['Where is my e-ticket?', 'In the confirmation email and on the booking’s page in your account, under Documents.'],
    ['Do I need an account to book?', 'No. You can book as a guest. With an account, your bookings and saved travelers are in one place.'],
    ['Which cards can I pay with?', 'Payments run through Stripe, which accepts the major credit and debit cards.'],
    ['How do I enter names?', 'Exactly as they appear on each traveler’s passport, including middle names.']
  ],
  hotels: [
    ['Is the price shown the total for my stay?', 'Yes. The large number is the total for your dates and guests, taxes and fees included. The price a night sits under it.'],
    ['What does free cancellation mean here?', 'You can cancel without charge until the date shown on the rate. After that date the rate’s cancellation terms apply.'],
    ['Is breakfast included?', 'Only where the rate says so. Each rate lists its meals.'],
    ['When can I check in?', 'Each hotel lists its check-in and check-out times under House rules.'],
    ['Can I book more than one room?', 'Yes. Set the rooms and guests in the search, and the rates show the total for all rooms.'],
    ['Will the hotel have my booking?', 'Yes. The lead guest’s name and your reference go to the hotel when you pay.'],
    ['Can I pay at the hotel?', 'Not on this site. You pay the full total by card through Stripe when you book.'],
    ['Where do I find my booking?', 'In the confirmation email and on the Bookings page of your account.']
  ]
};
export function Faqs({ mode }: { mode: Mode }) {
  const list = FAQS[mode];
  const cols = [list.slice(0, 4), list.slice(4)];
  return (
    <section className="o-r3 o-faq b-wrap r3-swap" id="faq" aria-labelledby="faq-title">
      <div className="o-r3__head r3-text">
        <h2 className="a-h2" id="faq-title">Questions before you book</h2>
        <Link className="o-faq__help" href="/contact">Help and contact</Link>
      </div>
      <div className="o-faq__cols r3-text">
        {cols.map((col, ci) => (
          <div key={ci} className="o-faq__col">
            {col.map(([q, a]) => (
              <details key={q} className="m-acc">
                <summary className="m-acc__q"><span>{q}</span><Icon name="chev-down" /></summary>
                <p className="m-acc__a">{a}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== A12. Flights and stays by city (#city-grid, #city-<region>) ===== */
export function CityGrid({ data, mode }: P) {
  const [region, setRegion] = useState<'All' | Region6>('All');
  const [all, setAll] = useState(false);
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace('#city-', '');
      const r = REGIONS6.find((x) => regionSlug(x) === h);
      if (r) { setRegion(r); requestAnimationFrame(() => document.getElementById('city-grid')?.scrollIntoView({ block: 'start' })); }
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  const f = mode === 'flights';
  const trip = defaultTrip(data.today);
  const w = data.weekend;
  const regions = REGIONS6.filter((r) => f || data.cities.some((c) => c.hasHotels && c.region === r));
  const list = data.cities.filter((c) => (f || c.hasHotels) && (region === 'All' || c.region === region));
  const choose = (r: 'All' | Region6) => {
    setRegion(r);
    history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}${r === 'All' ? '' : `#city-${regionSlug(r)}`}`);
  };
  return (
    <section className={`o-r3 o-cities r3-swap${all ? ' is-all' : ''}`} id="city-grid" aria-labelledby="cities-title">
      {REGIONS6.map((r) => <span key={r} id={`city-${regionSlug(r)}`} className="o-cities__anchor" aria-hidden="true" />)}
      <div className="b-wrap">
        <div className="o-r3__head r3-text">
          <h2 className="a-h2" id="cities-title">{f ? 'Flights from London by city' : 'Hotels by city'}</h2>
          <p className="o-r3__sub">{f ? `${data.cities.length} cities, every airline on each route` : `${list.length} cities, every stay with its score and lowest rate`}</p>
        </div>
        <Tabs items={['All', ...regions] as ('All' | Region6)[]} value={region} onChange={choose} label="Regions" />
        <ul className="o-cities__grid">
          {list.map((c, i) => (
            <li key={c.slug}>
              <details className="m-cityrow">
                <summary className="m-cityrow__sum">
                  <span className="m-cityrow__win"><Photo name={c.photo} alt="" sizes="40px" className="m-cityrow__img" /><Blind i={i} /></span>
                  <span className="m-cityrow__text r3-text"><span className="m-cityrow__name">{c.name}</span><span className="m-cityrow__country">{c.country}</span></span>
                  <span className="m-cityrow__from r3-text">from {usd(f ? c.returnFrom : (c.fromNightly ?? 0))}{f ? '' : <small> a night</small>}</span>
                  <Icon name="chev-down" />
                </summary>
                <ul className="m-cityrow__list">
                  {f ? c.airlines.map((a) => (
                    <li key={a.code}>
                      <Link className="m-cityrow__link" href={flightHref(c.iata, trip.depart, trip.ret, 1, 'economy', a.code)}>
                        <AirlineMark code={a.code} name={a.name} />
                        <span className="m-cityrow__al">{a.name}<small>{a.via ? `1 stop via ${a.via}` : 'Nonstop'}</small></span>
                        <Icon name="chev-right" />
                      </Link>
                    </li>
                  )) : data.hotels.filter((h) => h.city === c.slug).sort((a, b) => b.score - a.score).map((h) => (
                    <li key={h.id}>
                      <Link className="m-cityrow__link" href={hotelHref(h.id, w.checkin, w.checkout)}>
                        <span className="m-cityrow__score" aria-label={`Rated ${h.score.toFixed(1)}`}>{h.score.toFixed(1)}</span>
                        <span className="m-cityrow__al">{h.name}<small>{kicker(h.stars, h.type)}, from {usd(h.nightly)} a night</small></span>
                        <Icon name="chev-right" />
                      </Link>
                    </li>
                  ))}
                  <li><Link className="m-cityrow__all" href={f ? flightHref(c.iata, trip.depart, trip.ret) : staysHref(c.slug, w.checkin, w.checkout)}>{f ? `All flights to ${c.name}` : `All ${c.hotelCount} stays in ${c.name}`}</Link></li>
                </ul>
              </details>
            </li>
          ))}
        </ul>
        {list.length > 8 && !all && <button className="a-button -soft o-cities__more" type="button" onClick={() => setAll(true)}><span className="a-button__label">Show all {list.length} cities</span></button>}
        <p className="o-r3__fine r3-text">{f ? 'Lowest return for one adult in Economy from London Heathrow; each airline opens its own search.' : 'Lowest rate a night for the room, taxes and fees included.'}</p>
      </div>
    </section>
  );
}
