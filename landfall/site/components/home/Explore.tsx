/* =====================================================================
   Landfall (working name, a placeholder): trending, browse, popular
   Round 3, A6, A7 and A9.
   - Trending: Landfall's route board, not another photo grid. Two columns
     of 6 rows at 1440; each route's landfall line grows with its flight
     time, scaled to the longest route on the board (the concept made
     visible). Rows are links to the search for next weekend.
   - Browse: text tabs with the landfall line (By region, By city, and in
     Hotels mode By property type), roving tabindex and arrow keys.
   - Popular searches: 24 accordion cards in 3 columns, one open per
     column, each with priced or named links to real searches.
   Data: lib/mock/home.ts. Copy: round3-spec.md A6, A7, A9.
   ===================================================================== */
'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import Photo, { hasPhoto } from '@/components/ui/Photo';
import LandfallLine from '@/components/ui/LandfallLine';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { Rail, RailCard } from '@/components/ui/Rail';
import { ModeSwap, useMode } from '@/components/home/Mode';
import { setSearch } from '@/components/search/store';
import { readRecent } from '@/lib/recent';
import { flightHref, hm, hotelsHref, REGIONS4, stopsText, usd, type HomeData } from '@/lib/mock/home';

/* ---------- Trending ---------- */
function TrendFlights({ data }: { data: HomeData }) {
  const [more, setMore] = useState(false);
  const max = Math.max(...data.trendRoutes.map((r) => r.minutes));
  return (
    <>
      <h2 className="t-display t-h2" id="trend-title-flights">Routes people are booking</h2>
      <p className="o-sec__sub t-small">Who flies each route from London, and the lowest return fare for one adult this week</p>
      <ol className={`m-board${more ? ' is-open' : ''}`}>
        {data.trendRoutes.map((r) => (
          <li key={r.code}>
            <a className="m-board__row" href={r.href} aria-label={`London to ${r.city}, ${stopsText(r.stops)}, ${hm(r.minutes)}, ${r.airlines} airlines, return from ${usd(r.fare)}`}>
              <span className="m-board__tile">{r.photo && hasPhoto(r.photo.name) ? <Photo name={r.photo.name} sizes="48px" alt="" box={false} /> : <span className="t-code">{r.code}</span>}</span>
              <span className="m-board__name"><span className="m-board__title">London to {r.city}</span><span className="m-board__meta t-num">{stopsText(r.stops).replace(/^n/, 'N')}, {hm(r.minutes)}, {r.airlines} airlines</span></span>
              <span className="m-board__line"><LandfallLine grow={r.minutes / max} /></span>
              <span className="m-board__price"><span className="m-board__amount t-num">{usd(r.fare)}</span><span className="m-board__unit">return</span></span>
            </a>
          </li>
        ))}
      </ol>
      <button type="button" className="a-button -ghost m-board__more" onClick={() => setMore(true)} hidden={more}>Show 6 more</button>
    </>
  );
}

function TrendStays({ data }: { data: HomeData }) {
  const [city, setCity] = useState('All');
  const [more, setMore] = useState(false);
  const rows = data.trendStays.filter((h) => city === 'All' || h.city === city);
  const max = Math.max(...data.trendStays.map((h) => h.nights));
  return (
    <>
      <h2 className="t-display t-h2" id="trend-title-hotels">Stays people are booking</h2>
      <p className="o-sec__sub t-small">The most reviewed places to stay this month, with the price for 4 nights</p>
      <div className="m-chiprow" role="toolbar" aria-label="Filter stays by city">
        {[{ slug: 'All', name: 'All' }, ...data.topStayCities].map((c) => (
          <button key={c.slug} type="button" className="a-chip" aria-pressed={city === c.slug} onClick={() => setCity(c.slug)}>{c.name}</button>
        ))}
      </div>
      <ol className={`m-board${more ? ' is-open' : ''}`}>
        {rows.map((h) => (
          <li key={h.id}>
            <a className="m-board__row" href={h.href}>
              <span className="m-board__tile">{h.photo ? <Photo name={h.photo.name} sizes="48px" alt="" box={false} grade={false} /> : null}</span>
              <span className="m-board__name"><span className="m-board__title">{h.name}</span><span className="m-board__meta">{h.area}, {h.cityName}</span>{h.score ? <span className="m-board__phonescore"><ScoreBadge score={h.score} count={h.reviews ?? undefined} compact /></span> : null}</span>
              <span className="m-board__line -score">{h.score ? <ScoreBadge score={h.score} count={h.reviews ?? undefined} /> : <LandfallLine grow={h.nights / max} label={`${h.nights} nights`} />}</span>
              <span className="m-board__price"><span className="m-board__amount t-num">{usd(h.nightly)} a night</span><span className="m-board__unit t-num">{usd(h.total)} for {h.nights} nights</span></span>
            </a>
          </li>
        ))}
      </ol>
      {rows.length > 6 && <button type="button" className="a-button -ghost m-board__more" onClick={() => setMore(true)} hidden={more}>Show {rows.length - 6} more</button>}
    </>
  );
}

export function Trending({ data }: { data: HomeData }) {
  const mode = useMode();
  return (
    <section className="o-sec o-trend" id="trending" aria-labelledby={`trend-title-${mode}`}>
      <div className="l-container">
        <ModeSwap flights={<TrendFlights data={data} />} hotels={<TrendStays data={data} />} />
      </div>
    </section>
  );
}

/* ---------- Browse ---------- */
type BTab = 'region' | 'city' | 'types';

function BrowsePane({ mode, data, initial }: { mode: 'flights' | 'hotels'; data: HomeData; initial?: BTab }) {
  const tabs: { id: BTab; label: string }[] = [{ id: 'region', label: 'By region' }, { id: 'city', label: 'By city' }, ...(mode === 'hotels' ? [{ id: 'types' as BTab, label: 'By property type' }] : [])];
  const [tab, setTab] = useState<BTab>(initial && tabs.some((t) => t.id === initial) ? initial : 'region');
  const [region, setRegion] = useState<string>(REGIONS4[0]);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [recentPlace, setRecentPlace] = useState('');
  useEffect(() => { if (initial && tabs.some((t) => t.id === initial)) setTab(initial); }, [initial]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const r = readRecent().find((e) => e.params.place); if (r) setRecentPlace(r.params.place); }, []);
  const id = (t: BTab) => `browse-${mode}-${t}`;
  function key(e: React.KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[j].id);
    refs.current[j]?.focus();
  }
  const d = data.dates;
  const cities = data.cities.filter((c) => c.flies || c.hotels);
  return (
    <>
      <h2 className="t-display t-h2" id={`browse-title-${mode}`}>{mode === 'flights' ? 'Find your way in' : 'Find a place to stay'}</h2>
      <div className="a-texttabs o-browse__tabs" role="tablist" aria-label={mode === 'flights' ? 'Browse flights' : 'Browse stays'}>
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" className="a-texttab" id={`${id(t.id)}-tab`} aria-controls={id(t.id)} aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)} onKeyDown={(e) => key(e, i)}>{t.label}</button>
        ))}
      </div>
      {tab === 'region' && (
        <div className="o-browse__panel" role="tabpanel" id={id('region')} aria-labelledby={`${id('region')}-tab`} tabIndex={0}>
          <div className="m-chiprow" role="toolbar" aria-label="Regions">
            {REGIONS4.map((r) => <button key={r} type="button" className="a-chip" aria-pressed={region === r} onClick={() => setRegion(r)}>{r}</button>)}
          </div>
          <ul className="m-tiles">
            {cities.filter((c) => c.region === region).slice(0, 6).map((c) => (
              <li key={c.code} className="m-tile">
                {c.photos[0] && hasPhoto(c.photos[0].name) && <span className="m-tile__photo"><Photo name={c.photos[0].name} sizes="112px" alt="" box={false} /></span>}
                <span className="m-tile__body">
                <span className="m-tile__city">{c.name}</span>
                <span className="m-tile__meta">{c.country}, {hm(c.minutes)} from London</span>
                <span className="m-tile__links">
                  {c.flies && <a className="a-link t-num" href={flightHref(c.code, d.depart, d.ret)}>Flights from {usd(c.fare)}</a>}
                  {c.hotels && c.rate && <a className="a-link t-num" href={hotelsHref(c.slug, d.checkin, d.checkout)}>Hotels from {usd(c.rate)} a night</a>}
                </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'city' && (
        <div className="o-browse__panel" role="tabpanel" id={id('city')} aria-labelledby={`${id('city')}-tab`} tabIndex={0}>
          <ul className="m-citylist">
            {[...cities].filter((c) => (mode === 'flights' ? c.flies : c.hotels)).sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
              <li key={c.code}>
                <a href={mode === 'flights' ? flightHref(c.code, d.depart, d.ret) : hotelsHref(c.slug, d.checkin, d.checkout)}>
                  <span className="m-citylist__name">{c.name}</span>
                  <span className="m-citylist__price t-num">{mode === 'flights' ? `Return from ${usd(c.fare)}` : `From ${usd(c.rate ?? 0)} a night`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'types' && (
        <div className="o-browse__panel" role="tabpanel" id={id('types')} aria-labelledby={`${id('types')}-tab`}>
          <Rail label="Property types" className="-types">
            {data.types.map((t) => (
              <RailCard key={t.type} href={recentPlace ? `/hotels?place=${recentPlace}&type=${encodeURIComponent(t.type)}` : `/hotels?type=${encodeURIComponent(t.type)}`} photo={t.photo!.name} alt="" ratio="4/5" sizes="(min-width: 1025px) 296px, 62vw">
                <span className="m-railcard__title">{t.plural}</span>
                <span className="m-railcard__meta t-num">{t.count} {t.count === 1 ? 'stay' : 'stays'}{t.from ? `, from ${usd(t.from)} a night` : ''}</span>
              </RailCard>
            ))}
          </Rail>
        </div>
      )}
    </>
  );
}

export function Browse({ data }: { data: HomeData }) {
  const mode = useMode();
  const [initial, setInitial] = useState<BTab | undefined>(undefined);
  useEffect(() => {
    const on = () => {
      if (location.hash !== '#browse-types') return;
      setSearch({ tab: 'hotels' });
      setInitial('types');
      window.setTimeout(() => document.getElementById('browse')?.scrollIntoView({ block: 'start' }), 60);
    };
    on();
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return (
    <section className="o-sec o-browse" id="browse" aria-labelledby={`browse-title-${mode}`}>
      <span id="browse-types" className="o-anchor" aria-hidden="true" />
      <div className="l-container">
        <ModeSwap flights={<BrowsePane mode="flights" data={data} />} hotels={<BrowsePane mode="hotels" data={data} initial={initial} />} />
      </div>
    </section>
  );
}

/* ---------- Popular searches ---------- */
function PopularPane({ mode, data }: { mode: 'flights' | 'hotels'; data: HomeData }) {
  const cards = data.popular.filter((c) => (mode === 'flights' ? true : c.hotels && c.stays.length));
  const per = Math.ceil(cards.length / 3);
  const cols = [cards.slice(0, per), cards.slice(per, per * 2), cards.slice(per * 2)];
  const [open, setOpen] = useState<(string | null)[]>([null, null, null]);
  const [all, setAll] = useState(false);
  const d = data.dates;
  return (
    <>
      <h2 className="t-display t-h2" id={`popular-title-${mode}`}>Popular searches</h2>
      <p className="o-sec__sub t-small">{mode === 'flights' ? `Flights in ${cards.length} cities, with the lowest prices we found this week` : `Hotels in ${cards.length} cities, with the lowest prices we found this week`}</p>
      <div className={`m-popular${all ? ' is-all' : ''}`}>
        {cols.map((col, ci) => (
          <ul key={ci} className="m-popular__col">
            {col.map((c) => {
              const isOpen = open[ci] === c.code;
              const pid = `pop-${mode}-${c.code}`;
              const rows = mode === 'flights'
                ? [...c.routes, { text: `All flights to ${c.city}, return from ${usd(c.fare)}`, href: flightHref(c.code, d.depart, d.ret) }]
                : [...c.stays, { text: `All hotels in ${c.city}${c.rate ? `, from ${usd(c.rate)} a night` : ''}`, href: hotelsHref(c.slug, d.checkin, d.checkout) }];
              return (
                <li key={c.code} className={`m-pop${isOpen ? ' is-open' : ''}`}>
                  <h3 className="m-pop__h">
                    <button type="button" className="m-pop__btn" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen((o) => o.map((v, i) => (i === ci ? (isOpen ? null : c.code) : v)))}>
                      <span className="m-pop__city">{c.city}</span><span className="m-pop__country">{c.country}</span>
                      <Icon name={isOpen ? 'minus' : 'plus'} />
                    </button>
                  </h3>
                  <div className="m-pop__panel" id={pid} hidden={!isOpen}>
                    <ul>{rows.map((r) => <li key={r.text}><a href={r.href} className="t-num">{r.text}</a></li>)}</ul>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
      {cols[1].length > 0 && <button type="button" className="a-button -ghost m-popular__all" onClick={() => { setAll(true); window.setTimeout(() => document.getElementById(`pop-${mode}-${cols[1][0]?.code}`)?.previousElementSibling?.querySelector('button')?.focus(), 30); }} hidden={all}>Show all {cards.length} cities</button>}
    </>
  );
}

export function Popular({ data }: { data: HomeData }) {
  const mode = useMode();
  return (
    <section className="o-sec o-popular" id="popular" aria-labelledby={`popular-title-${mode}`}>
      <div className="l-container">
        <ModeSwap flights={<PopularPane mode="flights" data={data} />} hotels={<PopularPane mode="hotels" data={data} />} />
      </div>
    </section>
  );
}
