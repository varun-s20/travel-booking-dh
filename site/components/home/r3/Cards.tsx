'use client';
/* =====================================================================
   Round 3 home (Developer A): the cards and the rail every new home
   section uses (spec 0.4 m-railCard, A4, A6). A card is one link to a
   real search or a real hotel page. Prices: the total leads, the line
   under it says what it covers (spec 0.2). Hotel photos stay ungraded
   (they stand in for Duffel's); city photos wear the palette grade.
   ===================================================================== */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Score } from '@/components/ui/Score';
import { Save } from '@/components/ui/Save';
import { dayRangeLong, flightHref, hotelHref, nightsBetween, usd, type RouteItem, type StayItem } from '@/lib/recommend';

/* the blind that drops over a photo while the product switches (spec A1); --i staggers it left to right */
export function Blind({ i = 0 }: { i?: number }) {
  return <span className="a-blind" aria-hidden="true" style={{ '--i': i % 4 } as CSSProperties} />;
}

/* the 32px window-shaped disc with the airline's code: our own mark, never a logo (spec 0.5) */
export function AirlineMark({ code, name }: { code: string; name: string }) {
  return <span className="a-alMark" title={name} aria-hidden="true">{code}</span>;
}

const CARD_SIZES = '(min-width: 1441px) 21vw, (min-width: 1025px) 286px, (min-width: 641px) 30vw, 72vw';

export const kicker = (stars: number, type: string) => `${stars}-star ${type.toLowerCase()}`;

export function RouteCard({ item, i, photo }: { item: RouteItem; i: number; photo?: string }) {
  const { city, deal } = item;
  const first = city.airlines[0];
  return (
    <Link className="m-hcard" href={flightHref(city.iata, item.depart, item.ret)}
      aria-label={`London to ${city.name}, ${dayRangeLong(item.depart, item.ret)}. ${usd(item.price)} return for 1 adult, taxes and fees included.${deal ? ` ${usd(deal.saving)} below the typical fare.` : ''}`}>
      <span className="m-hcard__media">
        <Photo name={photo ?? city.photo2} alt="" sizes={CARD_SIZES} className="m-hcard__img" />
        <Blind i={i} />
        {first && <AirlineMark code={first.code} name={first.name} />}
      </span>
      <span className="m-hcard__body r3-text">
        <span className="m-hcard__title">London to {city.name}</span>
        <span className="m-hcard__meta">{dayRangeLong(item.depart, item.ret)}, 1 adult, Economy</span>
        <span className="m-hcard__line"><Icon name="clock" />{city.nonstop ? `Nonstop, ${city.flightTime}` : `1 stop, from ${city.flightTime}`}</span>
        <span className="m-hcard__foot">
          {deal && <Save>{usd(deal.saving)} below the typical fare</Save>}
          <span className="m-hcard__price">{usd(item.price)}</span>
          <span className="m-hcard__note">return for 1 adult, taxes and fees included</span>
        </span>
      </span>
    </Link>
  );
}

export function StayCard({ item, i, save, photo }: { item: StayItem; i: number; save?: string; photo?: { photo: string; alt: string } }) {
  const { hotel } = item;
  const ph = photo ?? { photo: hotel.photo, alt: hotel.alt };
  const nights = nightsBetween(item.checkin, item.checkout);
  const total = item.nightly * nights;
  return (
    <Link className="m-hcard -stay" href={hotelHref(hotel.id, item.checkin, item.checkout, item.adults)}
      aria-label={`${hotel.name}, ${kicker(hotel.stars, hotel.type)} in ${hotel.area}, ${hotel.cityName}. Rated ${hotel.score.toFixed(1)}. ${usd(total)} for ${nights} ${nights === 1 ? 'night' : 'nights'}, ${item.adults} adults, taxes and fees included.`}>
      <span className="m-hcard__media">
        <Photo name={ph.photo} alt="" sizes={CARD_SIZES} className="m-hcard__img" graded={false} />
        <Blind i={i} />
        {save && <Save className="m-hcard__tag">{save}</Save>}
      </span>
      <span className="m-hcard__body r3-text">
        <span className="m-hcard__kicker">{kicker(hotel.stars, hotel.type)}</span>
        <span className="m-hcard__title -clamp">{hotel.name}</span>
        <span className="m-hcard__meta">{hotel.area}, {hotel.cityName}, {hotel.distanceKm.toFixed(1)} km from the center</span>
        <Score score={hotel.score} word={hotel.scoreWord} count={hotel.reviewCount} size="s" />
        <span className="m-hcard__foot">
          <span className="m-hcard__price">{usd(total)}</span>
          <span className="m-hcard__note">{nights} {nights === 1 ? 'night' : 'nights'}, {item.adults} adults, taxes and fees included</span>
          <span className="m-hcard__dates">{dayRangeLong(item.checkin, item.checkout)}</span>
        </span>
      </span>
    </Link>
  );
}

/* a horizontal rail: scroll snap, prev and next above it from 1025px, arrow keys move one card (spec 0.4) */
export function Rail({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.scrollWidth <= el.clientWidth + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);
  const step = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector('li');
    const w = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <div className={`m-rail ${className}`.trim()}>
      <div className="m-rail__nav" hidden={fits}>
        <button className="m-rail__btn" type="button" aria-label={`Previous, ${label}`} onClick={() => step(-1)}><Icon name="chev-left" /></button>
        <button className="m-rail__btn" type="button" aria-label={`Next, ${label}`} onClick={() => step(1)}><Icon name="chev-right" /></button>
      </div>
      <ul className="m-rail__list" ref={ref} tabIndex={0} aria-label={label}
        onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } }}>
        {children}
      </ul>
    </div>
  );
}

/* m-tabs: pills that filter in place (aria-pressed, as the existing region pills) */
export function Tabs<T extends string>({ items, value, onChange, label, dark = false, labelOf }: { items: readonly T[]; value: T; onChange: (v: T) => void; label: string; dark?: boolean; labelOf?: (v: T) => string }) {
  return (
    <div className={`m-tabs${dark ? ' -dark' : ''}`} role="group" aria-label={label}>
      {items.map((it) => (
        <button key={it} className="m-tabs__tab" type="button" aria-pressed={it === value} onClick={() => onChange(it)}>{labelOf ? labelOf(it) : it}</button>
      ))}
    </div>
  );
}
