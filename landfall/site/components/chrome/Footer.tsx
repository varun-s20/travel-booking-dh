/* =====================================================================
   Landfall (working name, a placeholder): pre-footer band and footer
   Pre-footer (Varun V10): a dark band rising over the page with rounded
   top corners, a centred Newsreader H2 and one bright pill, "Start a
   search", that goes back to the search in the current mode: on home it
   scrolls to the hero card and opens the first empty field (To in
   Flights, Destination in Hotels); on inner pages with a compact bar it
   opens it; elsewhere it goes to the home search. Hidden on the booking
   steps (NO_BAND).
   Footer, round 3 (round3-spec.md A12): V10 stays (phone and email large
   at the top, Back to top, never a centred list, no giant wordmark), with
   competitor depth under it: popular flights and hotels (two groups of
   12), five link columns, the trust row, the price disclosure and the
   demo notice, copyright and credit. Every link goes to a real page or a
   real search. At 390 the link groups are disclosures (Your trips and
   Help open). Popular links: searches with no dates (the results pages
   fill them in), to the cities the site lists. Signed-in state: lib/session.ts.
   ===================================================================== */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { prefersReducedMotion, requestSearch, toast, useMedia } from '@/lib/client';
import { SITE } from '@/lib/site';
import { signOut as endSession, useSession } from '@/lib/session';
import { getSearch, setSearch } from '@/components/search/store';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import Logo from '@/components/chrome/Logo';
import { AIRPORTS, CITIES } from '@/lib/data/places';
import { DEFAULT_ORIGIN } from '@/lib/site';

/* pages that end on the footer without the band (groups add theirs here, and list it in progress.md) */
const NO_BAND = ['/checkout', '/confirmation', '/emails', '/login', '/register', '/forgot-password', '/reset-password'];
const NO_BAND_PARTS = ['/passengers', '/guests'];

/* the footer's popular links: flights from the default origin and stays in the listed cities */
const FOOT_ROUTES = ['LIS', 'JFK', 'FCO', 'HND', 'CPT', 'MEX', 'BCN', 'ATH', 'CDG', 'AMS', 'DXB', 'SIN'];
const FOOT_STAYS = ['lisbon', 'new-york', 'rome', 'tokyo', 'cape-town', 'mexico-city', 'paris', 'barcelona', 'amsterdam', 'singapore', 'sydney', 'marrakech'];
const LINKS = {
  flights: FOOT_ROUTES.flatMap((code) => { const a = AIRPORTS.find((x) => x.code === code); return a ? [{ text: `${DEFAULT_ORIGIN.city} to ${a.city}`, href: `/flights?from=${DEFAULT_ORIGIN.code}&to=${code}` }] : []; }),
  hotels: FOOT_STAYS.flatMap((slug) => { const c = CITIES.find((x) => x.id === slug && !x.testOnly); return c ? [{ text: c.name, href: `/hotels?place=${slug}` }] : []; })
};

type L = { text: string; href: string; onClick?: () => void };

function Group({ title, links, phone, open: startOpen, cols2 }: { title: string; links: L[]; phone: boolean; open?: boolean; cols2?: boolean }) {
  const [open, setOpen] = useState(!!startOpen);
  const id = `foot-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const list = (
    <ul className={`o-footer__list${cols2 ? ' -two' : ''}`} id={id} hidden={phone && !open}>
      {links.map((l) => <li key={l.text}><Link prefetch={false} className="o-footer__link" href={l.href} onClick={l.onClick}>{l.text}</Link></li>)}
    </ul>
  );
  return (
    <div className={`o-footer__group${cols2 ? ' -wide' : ''}`}>
      {phone ? (
        <h2 className="o-footer__head -btn">
          <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{title}<Icon name={open ? 'minus' : 'plus'} /></button>
        </h2>
      ) : <h2 className="o-footer__head">{title}</h2>}
      {list}
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession().user;
  const phone = useMedia('(max-width: 640px)');
  const band = !NO_BAND.some((p) => pathname.startsWith(p)) && !NO_BAND_PARTS.some((p) => pathname.includes(p));

  function startSearch() {
    if (document.querySelector('[data-hero-card]')) {
      const s = getSearch();
      if (s.tab === 'hotels') requestSearch('hotels', s.dest ? 'dates' : 'dest');
      else requestSearch('flights', s.from ? (s.to ? 'dates' : 'to') : 'from');
      return;
    }
    if (document.querySelector('[data-compact="page"]')) { requestSearch(undefined, 'from'); return; }
    router.push('/#search');
  }
  async function signOut() { await endSession(); toast("You've signed out"); router.push('/'); }

  const book: L[] = [
    { text: 'Flights', href: '/', onClick: () => setSearch({ tab: 'flights' }) },
    { text: 'Hotels', href: '/?mode=hotels', onClick: () => setSearch({ tab: 'hotels' }) },
    { text: 'Deals this week', href: '/#deals' },
    { text: 'Trending routes', href: '/#trending' },
    { text: 'Browse by property type', href: '/?mode=hotels#browse-types' }
  ];
  const trips: L[] = [
    { text: 'My bookings', href: '/bookings' },
    { text: 'Profile', href: '/account' },
    ...(user ? [] : [{ text: 'Sign in', href: '/login' }, { text: 'Create an account', href: '/register' }]),
    { text: 'Reset your password', href: '/forgot-password' }
  ];
  const help: L[] = [
    { text: 'Contact us', href: '/contact' },
    { text: 'How booking works', href: '/#how-booking-works' },
    { text: 'Flight questions', href: '/#faqs', onClick: () => setSearch({ tab: 'flights' }) },
    { text: 'Hotel questions', href: '/?mode=hotels#faqs', onClick: () => setSearch({ tab: 'hotels' }) },
    { text: 'Changes and cancellations', href: '/#faq-change' },
    { text: 'Payments', href: '/#faq-cards' }
  ];
  const company: L[] = [
    { text: 'About Landfall', href: '/about' }
  ];
  const legal: L[] = [
    { text: 'Terms and conditions', href: '/terms' },
    { text: 'Privacy policy', href: '/privacy' },
    { text: 'Price display', href: '/terms#prices' },
    { text: 'Cookies', href: '/privacy#cookies' }
  ];

  return (
    <div className="o-end">
      {/* one dark surface for the band and the footer, so no seam shows between them; the photo fades in under the footer */}
      <div className="o-end__photo" aria-hidden="true">
        <Photo name="hero/lisbon-alfama-river" sizes="(max-width: 960px) 960px, 100vw" alt="" box={false} />
      </div>
      {band && (
        <section className="o-prefooter" aria-labelledby="prefooter-title">
          <div className="l-container">
            <h2 className="o-prefooter__title t-display t-h2" id="prefooter-title">Where will you land next?</h2>
            <button type="button" className="a-button -bright o-prefooter__cta" onClick={startSearch}>Start a search<Icon name="arrow" /></button>
          </div>
        </section>
      )}
      <footer className="o-footer">
        <div className="l-container o-footer__in">
          <Logo className="o-footer__logo" />
          <div className="o-footer__contact">
            <a className="o-footer__phone" href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>{SITE.phone}</a>
            <a className="o-footer__email" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <button type="button" className="o-footer__top" onClick={() => { window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); document.querySelector<HTMLElement>('.a-logo')?.focus({ preventScroll: true }); }}>Back to top<Icon name="arrow" /></button>
          </div>
          <nav className="o-footer__popular" aria-label="Popular flights and hotels">
            <Group title="Popular flights" links={LINKS.flights} phone={phone} cols2 />
            <Group title="Hotels in" links={LINKS.hotels} phone={phone} cols2 />
          </nav>
          <nav className="o-footer__cols" aria-label="More pages">
            <Group title="Book" links={book} phone={phone} />
            <Group title="Your trips" links={trips} phone={phone} open />
            <Group title="Help" links={help} phone={phone} open />
            <Group title="Company" links={company} phone={phone} />
            <Group title="Legal" links={legal} phone={phone} />
          </nav>
          {user && <p className="o-footer__signout"><button type="button" className="o-footer__link" onClick={signOut}>Sign out</button></p>}
          <div className="o-footer__trust">
            {/* CLIENT COPY REQUIRED: legal entity name */}
            {/* CLIENT COPY REQUIRED: registered address */}
            {/* CLIENT COPY REQUIRED: company registration number */}
            <div className="o-footer__pay">
              <span>Card payments by Stripe</span>
              <span className="o-footer__cards">
                {/* card marks in their own colours (European Sleeper's trust row); placeholders until the client names its brands */}
                <svg viewBox="0 0 46 30" role="img" aria-label="Visa"><rect width="46" height="30" rx="4" fill="#fff" /><text x="23" y="19.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="12" fill="#1A1F71">VISA</text></svg>
                <svg viewBox="0 0 46 30" role="img" aria-label="Mastercard"><rect width="46" height="30" rx="4" fill="#fff" /><circle cx="19" cy="15" r="8" fill="#EB001B" /><circle cx="27" cy="15" r="8" fill="#F79E1B" /><path d="M23 8.1a8 8 0 0 1 0 13.8 8 8 0 0 1 0-13.8z" fill="#FF5F00" /></svg>
              </span>
            </div>
          </div>
          <div className="o-footer__notice">
            <p>Prices include taxes and fees and are for all travelers or the whole stay unless a line says per traveler or per night. Savings lines compare a price with the usual price for the same route or hotel over the last 30 days.</p>
          </div>
          <div className="o-footer__legal">
            <p>© 2026 Landfall</p>
            <p>Created with love by Digital Heroes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
