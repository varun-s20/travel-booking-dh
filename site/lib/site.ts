/* =====================================================================
   travel-booking (working name Overwing, a placeholder): site facts
   Everything here is a placeholder approved at checkpoint 2b and named
   in the footer's demo notice. Replace it all at once when the client
   sends a name, contacts and a domain (content/copy.md, client questions 1 and 3).
   ===================================================================== */
export const SITE = {
  name: 'Overwing',
  wordmark: 'overwing',
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

/* The hero view (revision 2026-11-11, item 16, and the Chief Officer's condition): a harbour town on the coast at first
   light. The cabin windows, the searching window, the pre-footer window and the footer all show it. */
export const HERO_VIEW = 'kiama-harbour-first-light';
