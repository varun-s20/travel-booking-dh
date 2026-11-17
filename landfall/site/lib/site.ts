/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): site facts
   The phone and email are the placeholders approved for the project
   (content/copy.md), shared with Overwing because they are not design.
   "Landfall" is the concept's working name, used the way Overwing uses
   its own; landfall/content/copy.md may rename it. Replace everything
   here at once when the client sends a name, contacts and a domain.
   ===================================================================== */
export const SITE = {
  name: 'Landfall',
  phone: '+1 (555) 010-0199',
  phoneHref: 'tel:+15550100199',
  email: 'hello@example.com',
  /* SITE_URL REQUIRED: canonical and Open Graph URLs wait for the client's domain */
  url: process.env.SITE_URL || ''
} as const;

/* One place for every route, so links never drift from the pages */
export const ROUTES = {
  home: '/',
  flights: '/flights',
  hotels: '/hotels',
  checkout: '/checkout',
  confirmation: '/confirmation',
  bookings: '/bookings',
  account: '/account',
  login: '/login',
  register: '/register',
  forgot: '/forgot-password',
  reset: '/reset-password',
  about: '/about',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy'
} as const;

/* Destination prices start from here until the client names its market (copy.md, mock data defaults) */
export const DEFAULT_ORIGIN = { code: 'LHR', city: 'London' } as const;
