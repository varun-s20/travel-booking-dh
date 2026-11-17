'use client';
/* =====================================================================
   Footer link columns (round 3 spec A14): six columns, 42 links, every
   one a different real page or real search (critic: the spec's "Your
   booking documents" and "Contact us" repeated /bookings and /contact,
   so they became Flights by city and Hotels by city). Route and city links carry dates
   (today + 21, a week for flights, 3 nights for stays) filled in after
   hydration; the server renders them without dates and the results
   pages fill the same defaults. At 390 each column is an accordion,
   Support open. "Log in" becomes "Log out" once logged in.
   ===================================================================== */
import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { FooterAuthLink } from '@/components/chrome/FooterLinks';
import { useMedia } from '@/lib/client';
import { ROUTES } from '@/lib/site';

type L = { label: string; href: string; auth?: boolean };
const FLIGHTS: [string, string][] = [['Lisbon', 'LIS'], ['Barcelona', 'BCN'], ['Paris', 'CDG'], ['New York', 'JFK'], ['Dubai', 'DXB'], ['Tokyo', 'HND'], ['Cape Town', 'CPT']];
const HOTELS: [string, string][] = [['Lisbon', 'lisbon'], ['Rome', 'rome'], ['Paris', 'paris'], ['Amsterdam', 'amsterdam'], ['New York', 'new-york'], ['Tokyo', 'tokyo'], ['Marrakech', 'marrakech']];
const REGIONS: [string, string][] = [['Southern Europe', 'southern-europe'], ['Northern and Western Europe', 'northern-and-western-europe'], ['North America', 'north-america'], ['Latin America', 'latin-america'], ['Asia and Pacific', 'asia-and-pacific'], ['Africa and Middle East', 'africa-and-middle-east']];

function isoIn(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* five columns at 1440, the last two holding two groups each, so the columns come out near equal in height
   (critic, round 3, second pass: one 12-link column beside 4-link ones looked ragged) */
type G = { head: string; links: L[]; col?: number };
function columns(dated: boolean): G[] {
  const dep = dated ? `&depart=${isoIn(21)}&return=${isoIn(28)}` : '';
  const stay = dated ? `&checkin=${isoIn(21)}&checkout=${isoIn(24)}` : '';
  return [
    { head: 'Flights', links: [{ label: 'Search flights', href: '/?mode=flights' }, ...FLIGHTS.map(([n, c]) => ({ label: `London to ${n}`, href: `${ROUTES.flights}?from=LHR&to=${c}${dep}&adults=1&children=0&infants=0&cabin=economy` }))] },
    { head: 'Hotels', links: [{ label: 'Find a hotel', href: '/?mode=hotels' }, ...HOTELS.map(([n, s]) => ({ label: `Hotels in ${n}`, href: `${ROUTES.hotels}?place=${s}${stay}&adults=2&children=0&rooms=1` }))] },
    { head: 'Regions', links: [
      ...REGIONS.map(([n, s]) => ({ label: n, href: `/?mode=flights#city-${s}` })),
      { label: 'Flights by city', href: '/?mode=flights#city-grid' }, { label: 'Hotels by city', href: '/?mode=hotels#city-grid' }
    ] },
    { head: 'Deals and dates', col: 3, links: [
      { label: 'Fare deals', href: '/?mode=flights#deals' }, { label: 'Stay deals', href: '/?mode=hotels#deals' },
      { label: 'Cheapest months to fly', href: '/?mode=flights#when' }, { label: 'Stays for this weekend', href: '/?mode=hotels#weekend' }
    ] },
    { head: 'Your trips', col: 3, links: [{ label: 'Bookings', href: ROUTES.bookings }, { label: 'Account', href: ROUTES.account }, { label: 'Log in', href: ROUTES.login, auth: true }, { label: 'Create an account', href: ROUTES.register }, { label: 'Forgot password', href: ROUTES.forgot }] },
    { head: 'Support', col: 4, links: [
      { label: 'Help and contact', href: ROUTES.contact }, { label: 'Questions about flights', href: '/?mode=flights#faq' }, { label: 'Questions about hotels', href: '/?mode=hotels#faq' },
      { label: 'Payments and pricing', href: `${ROUTES.terms}#payments` }, { label: 'Changes and cancellations', href: `${ROUTES.terms}#changes` }
    ] },
    { head: 'Company', col: 4, links: [{ label: 'About us', href: ROUTES.about }, { label: 'Terms and conditions', href: ROUTES.terms }, { label: 'Privacy policy', href: ROUTES.privacy }, { label: 'Cookies', href: `${ROUTES.privacy}#cookies` }] }
  ];
}

export function FooterCols() {
  const [dated, setDated] = useState(false);
  useEffect(() => setDated(true), []);
  const phone = useMedia('(max-width: 640px)');
  const cols = columns(dated);
  const list = (links: L[]) => (
    <ul className="o-footer__list">
      {links.map((l) => <li key={l.label}>{l.auth ? <FooterAuthLink /> : <Link className="o-footer__link" href={l.href}>{l.label}</Link>}</li>)}
    </ul>
  );
  return (
    <nav className="o-footer__cols" aria-label="More pages">
      {cols.map((c) => phone ? (
        <details key={c.head} className="o-footer__acc" open={c.head === 'Support' || undefined}>
          <summary className="o-footer__sum"><h2 className="o-footer__head">{c.head}</h2><Icon name="chev-down" /></summary>
          {list(c.links)}
        </details>
      ) : null)}
      {!phone && [0, 1, 2, 3, 4].map((ci) => (
        <div key={ci} className="o-footer__col">
          {cols.filter((c, i) => (c.col ?? i) === ci).map((c) => (
            <div key={c.head} className="o-footer__group">
              <h2 className="o-footer__head">{c.head}</h2>
              {list(c.links)}
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
