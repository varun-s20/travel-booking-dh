'use client';
/* =====================================================================
   Hotel detail, round 3 (spec B7; Kasa's grid, Booking.com and
   Expedia's depth, Overwing's window and pills):
   - the 5-up photo grid opening the gallery by category;
   - a section nav that sticks under the compact search once the grid
     scrolls away, with the lowest total and Reserve on desktop;
   - overview: about with Read more, highlights in one divided row,
     8 popular amenities and the full list grouped as the catalogue
     groups them; a side card with the score, check-in and the price;
   - availability (#rooms): one row group per room, one row per rate
     plan, a sticky summary with the chosen total and Reserve; phones
     get room cards with stacked plan options and a bottom bar;
   - reviews (#reviews, hotels with reviews only): the large score,
     category bars, trip filters, sort, review cards;
   - location with what's nearby, house rules, questions from the
     hotel's own data, similar stays in the same city.
   Copy: content/copy.md and content/mock-catalogue.md (demo data).
   ===================================================================== */
import { Save } from '@/components/ui/Save';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Dialog } from '@/components/ui/Dialog';
import { Notice } from '@/components/ui/Notice';
import { BottomBar } from '@/components/booking/Summary';
import { Glyph } from '@/components/booking/Glyphs';
import { PhotoCarousel } from '@/components/hotels/PhotoCarousel';
import { StayMap } from '@/components/hotels/StayMap';
import { HotelScore } from '@/components/hotels/HotelScore';
import { AMENITY_ICON, type Hotel, type PhotoCat, type RatePlanId, type StaySearch } from '@/lib/mock/hotels';
import { requestSearch } from '@/lib/client';
import { recordView } from '@/lib/history';
import { dayMonth, dayRange, dayShort, dollars, plural } from '@/lib/format';
import { guestsLine } from '@/lib/text';

export type PlanOffer = { id: RatePlanId; name: string; nightly: number; total: number; refundable: boolean; breakfast: boolean; saving?: number; lower?: string };
export type RoomOffer = {
  id: string; name: string; spec: string; beds: string; size?: string; sleeps: number; view?: string; amenities: string[]; photos: string[];
  available: boolean; roomsLeft: number; plans: PlanOffer[];
};
export type SimilarStay = { id: string; name: string; kicker: string; area: string; distanceKm: number; score: number; word: string; reviews: number; photo: string; total: number; nightly: number };

type Props = { hotel: Hotel; city: string; search: StaySearch; query: string; nights: number; rooms: RoomOffer[]; cancelUntil: string; similar: SimilarStay[] };

const CATS: PhotoCat[] = ['Rooms', 'Inside', 'Outside'];

/* The catalogue's master amenity list, grouped as the amenities dialog shows them (content/mock-catalogue.md, section 3) */
const AMENITY_GROUPS: [string, string[]][] = [
  ['Internet and work', ['Free wifi', 'Work desk', 'Coworking space', 'Meeting rooms']],
  ['Food and drink', ['Breakfast available', 'Restaurant', 'Bar', 'Rooftop bar', 'Room service', 'Shared kitchen', 'Kitchen', 'Coffee machine', 'Kettle', 'Minibar']],
  ['Wellness', ['Gym', 'Spa', 'Sauna', 'Hot tub', 'Public bath', 'Indoor pool', 'Outdoor pool', 'Plunge pool', 'Massage treatments']],
  ['Outdoors', ['Roof terrace', 'Terrace', 'Garden', 'Courtyard', 'Balcony', 'Beach access']],
  ['In the room', ['Air conditioning', 'Heating', 'Hairdryer', 'Safe in room', 'Flat-screen TV', 'Blackout curtains', 'Soundproofed rooms', 'Bathtub', 'Rain shower', 'Bathrobes and slippers', 'Iron and ironing board', 'Washing machine']],
  ['Services', ['24-hour front desk', 'Concierge', 'Luggage storage', 'Daily housekeeping', 'Laundry', 'Self check-in', 'Express check-in and check-out', 'Tour desk', 'Bicycle rental', 'Airport shuttle (paid)']],
  ['Building and access', ['Elevator', 'Step-free entrance', 'Accessible rooms', 'Non-smoking rooms']],
  ['Family and pets', ['Cots available', 'Family rooms', "Kids' club", 'Pets allowed']],
  ['Parking', ['Parking on site (paid)', 'Free parking', 'Electric vehicle charging']]
];

/* sprite icons first (components/chrome/Sprite.tsx), then the round 3 glyphs (components/booking/Glyphs.tsx) */
const GLYPH_FOR: Record<string, string> = {
  'Outdoor pool': 'pool', 'Indoor pool': 'pool', 'Plunge pool': 'pool', 'Beach access': 'pool', Spa: 'spa', Sauna: 'spa', 'Hot tub': 'spa', 'Massage treatments': 'spa',
  'Parking on site (paid)': 'parking', 'Free parking': 'parking', 'Electric vehicle charging': 'power', 'Pets allowed': 'pet', 'Airport shuttle (paid)': 'shuttle',
  'Shared kitchen': 'kitchen', Kitchen: 'kitchen', 'Self check-in': 'key', 'Express check-in and check-out': 'key', Restaurant: 'meal', 'Room service': 'meal',
  'Cots available': 'child', 'Family rooms': 'child', "Kids' club": 'child', 'Soundproofed rooms': 'quiet', 'Blackout curtains': 'eye', 'Step-free entrance': 'door',
  'Accessible rooms': 'door', Concierge: 'building', 'Tour desk': 'globe', 'Meeting rooms': 'building', 'Coworking space': 'building', 'Work desk': 'building'
};
const SPRITE_EXTRA: Record<string, string> = { Heating: 'sun', Terrace: 'sun', Balcony: 'sun', Kettle: 'cup', 'Coffee machine': 'cup', Minibar: 'glass', Bathtub: 'bath', 'Rain shower': 'bath', 'Bathrobes and slippers': 'bath', 'Flat-screen TV': 'eye', 'Iron and ironing board': 'wash', 'Bicycle rental': 'leaf' };
export function AmenityIcon({ name, size }: { name: string; size?: 's' | 'l' }) {
  const g = GLYPH_FOR[name];
  if (g) return <Glyph name={g} size={size} />;
  return <Icon name={AMENITY_ICON[name] || SPRITE_EXTRA[name] || 'tick'} size={size} />;
}
const RULE_GLYPH: Record<string, string> = { Children: 'child', Pets: 'pet', Payment: 'card', 'Quiet hours': 'quiet', Accessibility: 'door', Smoking: 'smoke', Parties: 'party' };

const NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'rooms', label: 'Rooms' }, { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' }, { id: 'rules', label: 'House rules' }, { id: 'questions', label: 'Questions' }
];
type ReviewSort = 'newest' | 'highest' | 'lowest';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthKey = (m: string) => { const [mon, y] = m.split(' '); return +y * 12 + MONTHS.indexOf(mon); };
const TRIP_LABEL: Record<string, string> = { Couple: 'Couples', Family: 'Families', Solo: 'Solo', Friends: 'Friends', Business: 'Business' };

export function HotelDetail({ hotel: h, city, search, query, nights, rooms, cancelUntil, similar }: Props) {
  const [gallery, setGallery] = useState(false);
  const [about, setAbout] = useState(false);
  const [amen, setAmen] = useState(false);
  const [trip, setTrip] = useState<string | null>(null);
  const [rsort, setRsort] = useState<ReviewSort>('newest');
  const [current, setCurrent] = useState('overview');
  const [navTop, setNavTop] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  const grid = h.photos.slice(0, 5);
  const bookable = rooms.filter((r) => r.available);
  const allPlans = bookable.flatMap((r) => r.plans.map((p) => ({ room: r, plan: p })));
  const best = allPlans.length ? [...allPlans].sort((a, b) => a.plan.total - b.plan.total)[0] : null;
  const [chosen, setChosen] = useState<{ room: string; plan: RatePlanId } | null>(best ? { room: best.room.id, plan: best.plan.id } : null);
  const pick = chosen ? allPlans.find((x) => x.room.id === chosen.room && x.plan.id === chosen.plan) ?? best : best;
  const reserveHref = pick ? `/hotels/${h.id}/guests?room=${pick.room.id}&plan=${pick.plan.id}&${query}` : '#rooms';
  const until = dayMonth(cancelUntil);
  const hasReviews = h.reviews.length > 0;
  const nav = NAV.filter((n) => n.id !== 'reviews' || hasReviews);
  const longAbout = h.aboutParas.length > 1 || h.aboutParas[0].length > 260;

  /* in the open gallery, the arrow keys move from photo to photo */
  useEffect(() => {
    if (!gallery) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const items = [...document.querySelectorAll<HTMLElement>('.m-gallery__item')];
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = items[Math.min(items.length - 1, Math.max(0, i + (e.key === 'ArrowRight' ? 1 : -1)))] ?? items[0];
      e.preventDefault();
      next.focus();
      next.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [gallery]);

  /* the visit feeds "Recommended for you" on the homepage (spec 0.6) */
  useEffect(() => { recordView({ kind: 'hotel', id: h.id }); }, [h.id]);

  /* the section nav sticks right under the pinned compact search */
  useEffect(() => {
    const read = () => {
      const p = document.querySelector('.o-pinned') as HTMLElement | null;
      if (!p) return;
      const top = parseFloat(getComputedStyle(p).top) || 0;
      setNavTop(Math.round(top + p.offsetHeight));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  /* the current section, for the nav's selected pill */
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setCurrent(vis[0].target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReviews]);

  const trips = useMemo(() => [...new Set(h.reviews.map((r) => r.trip))], [h.reviews]);
  const reviews = useMemo(() => {
    const list = h.reviews.filter((r) => !trip || r.trip === trip);
    return [...list].sort((a, b) => rsort === 'newest' ? monthKey(b.month) - monthKey(a.month) : rsort === 'highest' ? b.score - a.score : a.score - b.score);
  }, [h.reviews, trip, rsort]);

  const popular = h.amenities.slice(0, 8);
  const groups = AMENITY_GROUPS.map(([g, list]) => [g, list.filter((a) => h.amenities.includes(a))] as [string, string[]]).filter(([, l]) => l.length);
  const ungrouped = h.amenities.filter((a) => !AMENITY_GROUPS.some(([, l]) => l.includes(a)));
  const anyFree = allPlans.some((x) => x.plan.refundable);
  const anyBreakfast = allPlans.some((x) => x.plan.breakfast);
  const everyBreakfast = allPlans.length > 0 && allPlans.every((x) => x.plan.breakfast);
  const rule = (t: string) => h.houseRules.find((r) => r.title === t)?.body;

  const questions: { q: string; a: string }[] = [
    { q: 'Is the price shown the total for my stay?', a: `Yes. The large number is the total for your dates and guests, taxes and fees included. The price a night sits under it. A local tourist tax, if ${city} charges one, is paid at the hotel.` },
    { q: 'When can I check in and check out?', a: `Check-in at ${h.name} is from ${h.checkIn}, and check-out is until ${h.checkOut}.` },
    anyFree
      ? { q: 'What does free cancellation mean here?', a: `You can cancel without charge until the date shown on the rate. For these dates that is 23:59 hotel time on ${dayShort(cancelUntil)}. After that date the rate’s cancellation terms apply.` }
      : { q: 'Can I cancel this booking?', a: 'Every rate here for these dates is non-refundable from the moment you book.' },
    { q: 'Is breakfast included?', a: everyBreakfast ? `Yes. Every rate at ${h.name} includes breakfast for everyone in the room.` : anyBreakfast ? 'Only where the rate says so. Each rate lists its meals.' : 'Not on these dates. Every rate here is room only.' },
    { q: 'Can I bring children or pets?', a: [rule('Children'), rule('Pets')].filter(Boolean).join(' ') || 'Ask the hotel before you book.' }
  ];

  const navLink = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    el.focus({ preventScroll: true });
  };

  const planLines = (p: PlanOffer) => (
    <span className="m-rate__terms">
      <span className={p.breakfast ? '-yes' : ''}><Glyph name="meal" size="s" />{p.breakfast ? 'Breakfast included' : 'Room only'}</span>
      <span className={p.refundable ? '-yes' : '-muted'}><Glyph name={p.refundable ? 'refund' : 'change'} size="s" />{p.refundable ? `Free cancellation until ${until}` : 'Non-refundable'}</span>
      <span><Icon name="card" size="s" />Pay now by card</span>
    </span>
  );

  return (
    <>
      {/* ---- photo grid: one button ---- */}
      <button className={`o-hotel__grid -n${Math.min(grid.length, 5)}`} type="button" aria-haspopup="dialog" aria-label={`Open the photo gallery, ${plural(h.photos.length, 'photo', 'photos')}`} onClick={() => setGallery(true)}>
        {grid.map((p, i) => (
          <span className="o-hotel__tile" key={p.name}>
            <Photo name={p.name} alt="" graded={false} priority={i === 0} className="o-hotel__img"
              sizes={i === 0 ? '(min-width: 1441px) 43vw, (min-width: 1025px) 616px, calc(100vw - 32px)' : '(min-width: 1441px) 22vw, (min-width: 1025px) 308px, 25vw'} />
          </span>
        ))}
        {h.photos.length > 5 && <span className="o-hotel__more" aria-hidden="true"><Icon name="list" size="s" />See all {h.photos.length} photos</span>}
      </button>

      {/* phones: a swipe carousel of every photo with a 1 / 9 counter (spec B7.1); the grid opens the gallery from 641 */}
      <div className="o-hotel__phoneGallery">
        <PhotoCarousel photos={h.photos.map((p) => p.name)} name={h.name} alts={h.photos.map((p) => `${h.name}, ${p.caption}`)} sizes="calc(100vw - 32px)" counter priority className="o-hotel__swipe" />
        {h.photos.length > 1 && <button className="a-choice o-hotel__allPhotos" type="button" aria-haspopup="dialog" onClick={() => setGallery(true)}><Icon name="list" size="s" />All {h.photos.length} photos</button>}
      </div>

      {/* ---- section nav ---- */}
      <nav className="o-hnav" aria-label="Sections of this page" ref={navRef} style={{ top: navTop }}>
        <ul className="o-hnav__list">
          {nav.map((n) => (
            <li key={n.id}><a className={`o-hnav__link${current === n.id ? ' is-current' : ''}`} href={`#${n.id}`} aria-current={current === n.id ? 'location' : undefined} onClick={navLink(n.id)}>{n.label}</a></li>
          ))}
        </ul>
        {best && (
          <div className="o-hnav__price">
            <span>From <strong>{dollars(best.plan.total)}</strong> total</span>
            <a className="a-button -small" href="#rooms" onClick={navLink('rooms')}><span className="a-button__label">See rooms</span></a>
          </div>
        )}
      </nav>

      {/* ---- overview ---- */}
      <section className="o-hotel__overview" id="overview" tabIndex={-1} aria-labelledby="about-title">
        <div className="o-hotel__ovMain">
          <h2 className="o-hotel__h3" id="about-title">About {h.name}</h2>
          <div className={`o-hotel__desc${longAbout ? ' -clamp3' : ''}`}>{h.aboutParas.map((p, i) => <p key={i}>{p}</p>)}</div>
          {longAbout && <button className="a-button -soft -small" type="button" aria-haspopup="dialog" onClick={() => setAbout(true)}><span className="a-button__label">Read more</span></button>}

          {h.highlights.length > 0 && (
            <>
              <h3 className="o-hotel__h4">Highlights</h3>
              <ul className="o-hotel__highlights">
                {h.highlights.map((x, i) => <li key={x}><Icon name={['star', 'pin', 'tick'][i % 3]} />{x}</li>)}
              </ul>
            </>
          )}

          <h3 className="o-hotel__h4">Popular amenities</h3>
          <ul className="o-hotel__amen -popular">
            {popular.map((a) => <li key={a}><AmenityIcon name={a} />{a}</li>)}
          </ul>
          {h.amenities.length > popular.length && <button className="a-button -soft -small" type="button" aria-haspopup="dialog" onClick={() => setAmen(true)}><span className="a-button__label">All {h.amenities.length} amenities</span></button>}
        </div>

        <aside className="o-hotel__ovSide" aria-label="At a glance">
          <HotelScore score={h.score} word={h.scoreWord} reviews={h.reviewCount} size="l" />
          {h.categoryScores && (
            <ul className="o-hotel__miniBars">
              {[...h.categoryScores].sort((a, b) => b.score - a.score).slice(0, 3).map((c) => <li key={c.label}><span>{c.label}</span><strong>{c.score.toFixed(1)}</strong></li>)}
            </ul>
          )}
          {hasReviews && (
            <figure className="o-hotel__quote">
              <blockquote><p>{h.reviews[0].title}</p></blockquote>
              <figcaption>{h.reviews[0].name}, {h.reviews[0].country}</figcaption>
            </figure>
          )}
          <dl className="o-hotel__times2">
            <div><dt><Glyph name="key" size="s" />Check-in</dt><dd>From {h.checkIn}</dd></div>
            <div><dt><Glyph name="door" size="s" />Check-out</dt><dd>Until {h.checkOut}</dd></div>
          </dl>
          {best && (
            <div className="o-hotel__sidePrice">
              <p><strong>{dollars(best.plan.total)}</strong><span>lowest total, {plural(nights, 'night', 'nights')}, {guestsLine(search)}</span><span>{dollars(best.plan.nightly)} a night, taxes and fees included</span></p>
              <a className="a-button -block" href="#rooms" onClick={navLink('rooms')}><span className="a-button__label">See rooms</span></a>
            </div>
          )}
        </aside>
      </section>

      {/* ---- availability ---- */}
      <section className="o-hotel__section o-hotel__rooms" id="rooms" tabIndex={-1} aria-labelledby="rooms-title">
        <div className="o-hotel__roomsHead">
          <div>
            <h2 className="a-h2" id="rooms-title">Availability</h2>
            <p className="o-hotel__sub">Prices are totals for {plural(nights, 'night', 'nights')} and {guestsLine(search)}, taxes and fees included.</p>
          </div>
          <div className="o-hotel__chips">
            <span className="a-fact"><Icon name="cal" />{dayRange(search.checkin, search.checkout)}</span>
            <span className="a-fact"><Icon name="people" />{guestsLine(search)}</span>
            <button className="a-choice" type="button" onClick={() => requestSearch('hotels', 'dates')}>Change</button>
          </div>
        </div>
        {bookable.length ? (
          <div className="o-avail">
            <div className="o-avail__table">
              <div className="o-avail__head" aria-hidden="true">
                <span>Room</span><span>Rate</span><span>Price for {plural(nights, 'night', 'nights')}</span><span><span className="sr-only">Choose</span></span>
              </div>
              {rooms.map((r) => (
                <div className={`o-avail__group${r.available ? '' : ' -sold'}`} key={r.id}>
                  <div className="o-avail__room">
                    <div className="m-roomCell">
                      <PhotoCarousel photos={r.photos} name={r.name} alts={r.photos.map((_, k) => (k === 0 ? `${r.name} at ${h.name}` : `${h.name}, photo ${k + 1} of ${r.photos.length}`))} sizes="(min-width: 1025px) 240px, (min-width: 641px) 40vw, calc(100vw - 32px)" className="m-roomCell__media" />
                      <h3 className="m-roomCell__title">{r.name}</h3>
                      <ul className="m-roomCell__facts">
                        <li><Icon name="bed" size="s" />{r.beds}</li>
                        {r.size && <li><Glyph name="ruler" size="s" />{r.size}</li>}
                        {r.view && <li><Glyph name="eye" size="s" />{r.view.replace(/^./, (c) => c.toUpperCase())}</li>}
                        <li><Icon name="people" size="s" />Sleeps {r.sleeps}</li>
                      </ul>
                      {r.amenities.length > 0 && <p className="m-roomCell__amen">{r.amenities.slice(0, 4).join(', ')}</p>}
                    </div>
                    <fieldset className="o-avail__rates"><legend className="sr-only">Rates for the {r.name}</legend>
                      {r.available ? r.plans.map((p) => {
                        const on = pick?.room.id === r.id && pick.plan.id === p.id;
                        return (
                          <label className={`m-rate${on ? ' is-on' : ''}`} key={p.id}>
                            <span className="m-rate__plan">
                              <input className="m-rate__radio" type="radio" name="rate" checked={on} onChange={() => setChosen({ room: r.id, plan: p.id })} aria-label={`${r.name}, ${p.name}, ${dollars(p.total)} total`} />
                              <strong className="m-rate__name">{p.name}</strong>
                              {planLines(p)}
                              {p.saving ? <Save className="m-rate__save">{p.lower}, {dollars(p.saving)} under the usual price</Save> : null}
                              {r.roomsLeft <= 3 && <span className="m-rate__left">{plural(r.roomsLeft, 'room', 'rooms')} left at this rate</span>}
                            </span>
                            <span className="m-rate__price"><strong>{dollars(p.total)}</strong><span>{dollars(p.nightly)} a night</span><span>taxes and fees included</span></span>
                            <span className="m-rate__pick" aria-hidden="true">{on ? <><Icon name="tick" size="s" />Selected</> : 'Select'}</span>
                          </label>
                        );
                      }) : (
                        <p className="m-rate__sold">No longer available for your dates{h.id === 'casa-lanterna' && r.id === 'terrace-suite' && nights > 5 ? <span>Available for stays of five nights or fewer.</span> : null}</p>
                      )}
                    </fieldset>
                  </div>
                </div>
              ))}
            </div>
            {pick && (
              <aside className="o-avail__side" aria-label="Your choice">
                <div className="o-avail__card">
                  <p className="o-avail__label">Your choice</p>
                  <p className="o-avail__name">{pick.room.name}</p>
                  <p className="o-avail__plan">{pick.plan.name}</p>
                  {planLines(pick.plan)}
                  <p className="o-avail__total"><strong>{dollars(pick.plan.total)}</strong><span>total for {plural(nights, 'night', 'nights')}, {guestsLine(search)}</span><span>{dollars(pick.plan.nightly)} a night, taxes and fees included</span></p>
                  <Link className="a-button -block" href={reserveHref}><span className="a-button__label">Reserve</span><Icon name="arrow" className="a-button__icon" /></Link>
                  <p className="o-avail__note">You won’t pay until the next step. We check the rate again before you pay.</p>
                </div>
              </aside>
            )}
          </div>
        ) : (
          <Notice title="No rooms left for these dates"
            actions={<>
              <button className="a-button" type="button" onClick={() => requestSearch('hotels', 'dates')}><span className="a-button__label">Change dates</span></button>
              <Link className="a-link" href={`/hotels?${query}`}>Back to results</Link>
            </>}>
            <p>{h.name} is full from {dayMonth(search.checkin)} to {search.checkin.slice(5, 7) === search.checkout.slice(5, 7) ? +search.checkout.slice(8) : dayMonth(search.checkout)}. Try other dates or look at other hotels in {city}.</p>
          </Notice>
        )}
      </section>

      {/* ---- reviews ---- */}
      {hasReviews && (
        <section className="o-hotel__section o-reviews" id="reviews" tabIndex={-1} aria-labelledby="rev-title">
          <h2 className="a-h2" id="rev-title">Guest reviews</h2>
          <div className="o-reviews__top">
            <div className="o-reviews__score">
              <HotelScore score={h.score} word={h.scoreWord} reviews={h.reviewCount} size="l" />
            </div>
            {h.categoryScores && (
              <ul className="o-reviews__bars" aria-label="Scores by category">
                {h.categoryScores.map((c) => (
                  <li key={c.label}>
                    <span className="o-reviews__cat">{c.label}</span>
                    <span className="o-reviews__track" aria-hidden="true"><span style={{ width: `${c.score * 10}%` }} /></span>
                    <strong className="o-reviews__val">{c.score.toFixed(1)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="o-reviews__tools">
            <div className="o-reviews__chips" role="group" aria-label="Show reviews from">
              <button className="a-choice" type="button" aria-pressed={!trip} onClick={() => setTrip(null)}>All</button>
              {trips.map((t) => <button className="a-choice" type="button" key={t} aria-pressed={trip === t} onClick={() => setTrip(trip === t ? null : t)}>{TRIP_LABEL[t] ?? t}</button>)}
            </div>
            <label className="m-sortPill">
              <span className="sr-only">Sort reviews</span>
              <span className="m-sortPill__text" aria-hidden="true"><Icon name="sort" size="s" />Sort: {rsort === 'newest' ? 'Newest' : rsort === 'highest' ? 'Highest score' : 'Lowest score'}<Icon name="chev-down" size="s" /></span>
              <select className="m-sortPill__select" value={rsort} onChange={(e) => setRsort(e.target.value as ReviewSort)}>
                <option value="newest">Newest</option><option value="highest">Highest score</option><option value="lowest">Lowest score</option>
              </select>
            </label>
          </div>
          <p className="sr-only" role="status">{plural(reviews.length, 'review', 'reviews')} shown</p>
          <ul className="o-reviews__list">
            {reviews.map((r) => (
              <li className="m-review" key={`${r.name}-${r.month}`}>
                <div className="m-review__who">
                  <span className="m-review__avatar" aria-hidden="true">{r.name.charAt(0)}</span>
                  <span><strong>{r.name}</strong><span>{r.country}</span></span>
                  <span className="m-review__score" aria-label={`Scored ${r.score} out of 10`}>{r.score}</span>
                </div>
                <p className="m-review__meta">{r.trip}, stayed {r.month}</p>
                <h3 className="m-review__title">{r.title}</h3>
                <p className="m-review__text">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- location ---- */}
      <section className="o-hotel__section" id="location" tabIndex={-1} aria-labelledby="loc-title">
        <h2 className="a-h2" id="loc-title">Location</h2>
        <p className="o-hotel__line">{h.address}. {h.distanceKm.toFixed(1)} km from the center{h.centerPoint ? ` (${h.centerPoint})` : ''}.</p>
        <StayMap center={[h.lat, h.lon]} zoom={15} span={[5, 2]} pins={[{ id: h.id, lat: h.lat, lon: h.lon, label: h.name, name: h.name }]} label={`Map of ${h.area}, ${city}, with ${h.name} marked`} className="-location" />
        {h.nearby.length > 0 && (
          <div className="o-nearby">
            <h3 className="o-hotel__h4">What’s nearby</h3>
            <ul className="o-nearby__list">
              {h.nearby.map((n) => (
                <li key={n.name}>
                  <span className="o-nearby__icon" aria-hidden="true">{n.mode === 'drive' ? <Glyph name="shuttle" size="s" /> : <Icon name="pin" size="s" />}</span>
                  <span className="o-nearby__name">{n.name}</span>
                  {n.minutes !== null && <span className="o-nearby__time">{n.minutes} min {n.mode}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ---- house rules ---- */}
      <section className="o-hotel__section" id="rules" tabIndex={-1} aria-labelledby="rules-title">
        <h2 className="a-h2" id="rules-title">House rules</h2>
        <dl className="o-rules">
          <div className="o-rules__row"><dt><Glyph name="key" />Check-in</dt><dd>From {h.checkIn}</dd></div>
          <div className="o-rules__row"><dt><Glyph name="door" />Check-out</dt><dd>Until {h.checkOut}</dd></div>
          <div className="o-rules__row"><dt><Glyph name="refund" />Cancellation</dt><dd>{anyFree ? `Free cancellation rates: free until 23:59 hotel time on ${dayShort(cancelUntil)}. ` : ''}Non-refundable rates can’t be refunded from the moment you book.</dd></div>
          {h.houseRules.map((r) => (
            <div className="o-rules__row" key={r.title}><dt>{RULE_GLYPH[r.title] === 'card' ? <Icon name="card" /> : <Glyph name={RULE_GLYPH[r.title] ?? 'building'} />}{r.title}</dt><dd>{r.body}</dd></div>
          ))}
        </dl>
      </section>

      {/* ---- questions ---- */}
      <section className="o-hotel__section" id="questions" tabIndex={-1} aria-labelledby="faq-title">
        <h2 className="a-h2" id="faq-title">Questions about {h.name}</h2>
        <div className="m-accordion o-hotel__faq">
          {questions.map((x) => (
            <details className="m-accordion__item" key={x.q}>
              <summary className="m-accordion__head">{x.q}<span className="m-accordion__icon" aria-hidden="true" /></summary>
              <p className="m-accordion__body">{x.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---- similar stays ---- */}
      {similar.length > 0 && (
        <section className="o-hotel__section" aria-labelledby="sim-title">
          <div className="o-hotel__simHead">
            <h2 className="a-h2" id="sim-title">Similar stays in {city}</h2>
            <Link className="a-link" href={`/hotels?${query}`}>All stays in {city}</Link>
          </div>
          <p className="o-hotel__sub">{dayRange(search.checkin, search.checkout)}, {guestsLine(search)}</p>
          <ul className="o-similar">
            {similar.map((x) => (
              <li className="m-simCard" key={x.id}>
                <span className="m-simCard__media"><Photo name={x.photo} alt="" graded={false} sizes="(min-width: 1025px) 286px, (min-width: 641px) 45vw, 72vw" className="m-simCard__img" /></span>
                <p className="m-simCard__kicker">{x.kicker}</p>
                <h3 className="m-simCard__title"><Link className="m-simCard__link" href={`/hotels/${x.id}?${query}`}>{x.name}</Link></h3>
                <p className="m-simCard__meta">{x.area}, {x.distanceKm.toFixed(1)} km from the center</p>
                <HotelScore score={x.score} word={x.word} reviews={x.reviews} size="s" />
                <p className="m-simCard__price"><strong>{dollars(x.total)}</strong><span>{plural(nights, 'night', 'nights')}, {guestsLine(search)}, taxes and fees included</span></p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pick && <BottomBar stacked watch=".o-avail__card .a-button" price={`${dollars(pick.plan.total)} total`} label={pick.room.name} action={<Link className="a-button -steady" href={reserveHref}><span className="a-button__label">Reserve</span></Link>} />}

      {/* ---- dialogs ---- */}
      <Dialog open={gallery} onClose={() => setGallery(false)} id="gallery" title={`${plural(h.photos.length, 'photo', 'photos')} of ${h.name}`} size="full" className="-gallery" closeLabel="Close gallery">
        <div className="m-gallery">
          {CATS.filter((c) => h.photos.some((p) => p.cat === c)).map((c) => (
            <section className="m-gallery__group" key={c} aria-labelledby={`gal-${c}`}>
              <h3 className="m-gallery__title" id={`gal-${c}`}>{c === 'Inside' ? 'Common areas' : c} <span className="m-gallery__count">{h.photos.filter((p) => p.cat === c).length}</span></h3>
              <ul className="m-gallery__grid">
                {h.photos.filter((p) => p.cat === c).map((p) => (
                  <li key={p.name} className="m-gallery__item" tabIndex={0}><Photo name={p.name} alt={`${h.name}, ${p.caption}`} graded={false} sizes="(min-width: 1025px) 560px, (min-width: 641px) 45vw, 100vw" className="m-gallery__img" /></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Dialog>
      <Dialog open={about} onClose={() => setAbout(false)} id="about" title={`About ${h.name}`}>{h.aboutParas.map((p, i) => <p key={i}>{p}</p>)}</Dialog>
      <Dialog open={amen} onClose={() => setAmen(false)} id="amen" title={`All ${h.amenities.length} amenities at ${h.name}`}>
        <div className="o-amenAll">
          {groups.map(([g, list]) => (
            <section key={g} className="o-amenAll__group" aria-label={g}>
              <h3 className="o-amenAll__title">{g}</h3>
              <ul className="o-hotel__amen -all">{list.map((a) => <li key={a}><AmenityIcon name={a} />{a}</li>)}</ul>
            </section>
          ))}
          {ungrouped.length > 0 && <ul className="o-hotel__amen -all">{ungrouped.map((a) => <li key={a}><AmenityIcon name={a} />{a}</li>)}</ul>}
        </div>
      </Dialog>
    </>
  );
}
