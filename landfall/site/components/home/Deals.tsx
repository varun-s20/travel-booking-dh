/* =====================================================================
   Landfall (working name, a placeholder): deal banners and deal cards
   Round 3, A3 and A4. Banners: the place is the banner. Two in a row at
   1440 (816 + 408, 360 tall, radius 24), each a full-bleed water photo of
   the deal city under the hero's caption scrim; the whole banner is one
   link to the real search. Deal cards: a Rail of RailCards under a filter
   row of chips that filters in place. Prices: total first, taxes and fees
   included; savings only against the catalogue's usual price for the same dates.
   Lines: content/mock-catalogue.md section 5, word for word.
   Data: lib/mock/home.ts. Copy: round3-spec.md A3 and A4.
   ===================================================================== */
'use client';
import { useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import LandfallLine from '@/components/ui/LandfallLine';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { Rail, RailCard } from '@/components/ui/Rail';
import { ModeSwap, useMode } from '@/components/home/Mode';
import { dayLabel, hm, shortRange, stopsText, usd, type FlightCard, type HomeData, type HotelCard } from '@/lib/mock/home';

/* ---------- banners: content/mock-catalogue.md section 5, deal banner lines 1, 2, 6 and 10 ---------- */
function Banner({ big, photo, alt, city, line, children, cta, href, ghost }: {
  big?: boolean; photo: string; alt: string; city: string; line: string; children?: React.ReactNode; cta: string; href: string; ghost?: boolean;
}) {
  return (
    <a className={`m-banner${big ? ' -big' : ''}`} href={href}>
      <span className="m-banner__media"><Photo name={photo} sizes={big ? '(min-width: 1025px) 816px, 100vw' : '(min-width: 1025px) 408px, 100vw'} alt={alt} box={false} /></span>
      <span className="m-banner__scrim" aria-hidden="true" />
      <span className="m-banner__body">
        <span className="m-banner__city">{city}</span>
        <span className="m-banner__line">{line}</span>
        {children}
        <span className={`a-button m-banner__cta${ghost ? ' -ghost -onphoto' : ''}`}>{cta}<Icon name="arrow" /></span>
      </span>
    </a>
  );
}

export function DealBanners({ data }: { data: HomeData }) {
  const { large, small } = data.flightBanners;
  const { lisbon, tokyo } = data.hotelBanners;
  const smallLine = small.minutes > 360
    ? `${small.city} from ${usd(small.fare)} return, ${usd(small.saving)} below the typical fare for a flight of ${hm(small.minutes)}`
    : `Return flights to ${small.city} from ${usd(small.fare)}, ${usd(small.saving)} below the typical fare from London`;
  const fine = 'One adult, economy, taxes and fees included';
  return (
    <section className="o-banners" aria-label="Deals this week">
      <div className="l-container">
        <ModeSwap
          flights={
            <div className="o-banners__row">
              <Banner big photo={large.photo.name} alt={large.photo.alt} city={large.city} line={`Return flights to ${large.city} from ${usd(large.fare)}, ${usd(large.saving)} below the typical fare from London`} cta="See flights" href={large.href}>
                <LandfallLine dark size="card" from="LHR" to={large.code} label={`${hm(large.minutes)}, ${stopsText(large.stops)}`} className="m-banner__lline" />
                <span className="m-banner__fine t-num">{dayLabel(large.depart)} to {dayLabel(large.ret)}. {fine}</span>
              </Banner>
              <Banner photo={small.photo.name} alt={small.photo.alt} city={small.city} line={smallLine} cta="See flights" href={small.href} ghost>
                <span className="m-banner__fine t-num">{fine}</span>
              </Banner>
            </div>
          }
          hotels={
            <div className="o-banners__row">
              {lisbon && (
                <Banner big photo="hotels/cl-rooftops" alt="The view across the Alfama rooftops to the river in Lisbon" city="Lisbon"
                  line={`Lisbon stays from ${usd(lisbon.price)} a night this weekend, ${usd(lisbon.saving)} below the usual rate`} cta="See stays"
                  href={`/hotels?place=lisbon&checkin=${lisbon.checkin}&checkout=${lisbon.checkout}&adults=2&children=0&rooms=1`}>
                  <LandfallLine dark size="card" label={`2 nights, ${shortRange(lisbon.checkin, lisbon.checkout)}`} className="m-banner__lline" />
                  <span className="m-banner__fine t-num">Per room per night for 2 adults, taxes and fees included</span>
                </Banner>
              )}
              {tokyo && (
                <Banner photo="destinations/tokyo-bridge-night" alt="A lit arched bridge over a Tokyo river at night, office towers behind it" city="Tokyo"
                  line={`Breakfast included at ${tokyo.count} Tokyo hotels, from ${usd(tokyo.price)} a night for ${shortRange(tokyo.checkin, tokyo.checkout)}`} cta="See stays" ghost
                  href={`/hotels?place=tokyo&checkin=${tokyo.checkin}&checkout=${tokyo.checkout}&adults=2&children=0&rooms=1`}>
                  <span className="m-banner__fine t-num">Per room per night, taxes and fees included</span>
                </Banner>
              )}
            </div>
          }
        />
      </div>
    </section>
  );
}

/* ---------- deal cards ---------- */
export function FlightDealCard({ d, dateLine }: { d: FlightCard; dateLine?: string }) {
  return (
    <RailCard href={d.href} photo={d.photo.name} alt="" label={`London to ${d.city}, ${dayLabel(d.depart)} to ${dayLabel(d.ret)}, ${d.owner}. Return from ${usd(d.fare)} per traveler, taxes and fees included.${d.saving ? ` ${usd(d.saving)} below the typical fare for this route.` : ''}`}>
      <span className="m-railcard__title">London to {d.city}</span>
      <span className="m-railcard__meta t-num">{dateLine || `${shortRange(d.depart, d.ret)}, ${d.owner}`}</span>
      <LandfallLine size="card" label={`${hm(d.minutes)}, ${stopsText(d.stops)}`} />
      <span className="m-railcard__rule" />
      <span className="m-railcard__price"><span className="m-railcard__unit">Return from</span><span className="m-railcard__total t-num">{usd(d.fare)}</span><span className="m-railcard__unit">per traveler</span></span>
      {d.saving > 0 && <span className="m-railcard__reason">{usd(d.saving)} below the typical fare for this route</span>}
    </RailCard>
  );
}

export function HotelDealCard({ h }: { h: HotelCard }) {
  const deal = h.deal;
  return (
    <RailCard href={h.href} photo={h.photo?.name} alt="" label={`${h.name}, ${h.area}, ${h.cityName}. ${usd(h.nightly)} a night${deal ? `, usually ${usd(deal.usualNightly)}. ${deal.reason}` : ''}. ${h.nights} nights for 2 adults, ${usd(h.total)} total, taxes and fees included.`}>
      {deal && <span className="m-railcard__tag">{deal.tag}</span>}
      <span className="m-railcard__title">{h.name}</span>
      <span className="m-railcard__meta">{h.area}, {h.cityName}</span>
      {h.score ? <ScoreBadge score={h.score} count={h.reviews ?? undefined} /> : null}
      <span className="m-railcard__meta t-num">{h.nights} nights, {shortRange(h.checkin, h.checkout)}, 2 adults</span>
      <span className="m-railcard__rule" />
      <span className="m-railcard__price"><span className="m-railcard__total t-num">{usd(h.total)} total</span><span className="m-railcard__unit">taxes and fees included</span></span>
      <span className="m-railcard__small t-num">{usd(h.nightly)} a night{deal ? `, usually ${usd(deal.usualNightly)}` : ''}</span>
      {deal && <span className="m-railcard__reason">{deal.reason}</span>}
      {h.free && <span className="m-railcard__free">Free cancellation</span>}
    </RailCard>
  );
}

function Chips({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function key(e: React.KeyboardEvent, i: number) {
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : -2;
    if (n === -2) return;
    e.preventDefault();
    const j = (n + options.length) % options.length;
    refs.current[j]?.focus();
  }
  return (
    <div className="m-chiprow" role="toolbar" aria-label={label}>
      {options.map((o, i) => (
        <button key={o} ref={(el) => { refs.current[i] = el; }} type="button" className="a-chip" aria-pressed={value === o} tabIndex={value === o ? 0 : -1}
          onClick={() => onChange(o)} onKeyDown={(e) => key(e, i)}>{o}</button>
      ))}
    </div>
  );
}

const F_CHIPS = ['All', 'Europe', 'Americas', 'Asia and Pacific', 'Africa and Middle East', 'Short flights'];
const H_CHIPS = ['All', 'Under $150 a night', 'Weekend rate', 'Breakfast included', 'Scored 8.5 or more'];

function DealRail({ mode, data }: { mode: 'flights' | 'hotels'; data: HomeData }) {
  const [f, setF] = useState('All');
  const list = useMemo(() => {
    if (mode === 'flights') return data.flightDeals.filter((d) => f === 'All' || (f === 'Short flights' ? d.weekend : d.region === f));
    return data.hotelDeals.filter((h) => f === 'All' || (f === 'Under $150 a night' ? h.nightly < 150 : f === 'Weekend rate' ? h.deal?.kind === 'weekend' : f === 'Breakfast included' ? h.breakfast : (h.score ?? 0) >= 8.5));
  }, [f, mode, data]);
  const flights = mode === 'flights';
  const head = (
    <>
      <h2 className="t-display t-h2" id={`deals-title-${mode}`}>Lower prices for your dates</h2>
      <p className="o-sec__sub t-small">Rates and fares below the usual price for the same dates, plus stays you can cancel for free. Prices are checked again before you pay.</p>
      <Chips options={flights ? F_CHIPS : H_CHIPS} value={f} onChange={setF} label={flights ? 'Filter fare deals' : 'Filter stay deals'} />
    </>
  );
  return (
    <>
      <Rail head={head} label={flights ? 'Fare deals' : 'Stay deals'} key={f} className="is-filtered">
        {flights ? (list as FlightCard[]).map((d) => <FlightDealCard key={d.code} d={d} />) : (list as HotelCard[]).map((h) => <HotelDealCard key={h.id} h={h} />)}
      </Rail>
      {list.length === 0 && (
        <p className="o-deals__empty">No deals here this week. <button type="button" className="a-textbtn" onClick={() => setF('All')}>Show all deals</button></p>
      )}
    </>
  );
}

export function DealCards({ data }: { data: HomeData }) {
  const mode = useMode();
  return (
    <section className="o-sec o-deals" id="deals" aria-labelledby={`deals-title-${mode}`}>
      <div className="l-container">
        <ModeSwap flights={<DealRail mode="flights" data={data} />} hotels={<DealRail mode="hotels" data={data} />} />
      </div>
    </section>
  );
}
