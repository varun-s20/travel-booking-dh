/* travel-booking (Landfall, working name, a placeholder): Next.js config.
   The palette version is chosen at build time by NEXT_PUBLIC_PALETTE
   (tools/run.mjs sets it); each palette builds into its own folder so
   navy and harbour never overwrite each other.
   Security headers for every page and route: a Content Security Policy
   that allows only this site plus Stripe (its script and the card fields'
   frames), no framing of the site, no MIME sniffing, a strict referrer
   policy and no camera, microphone or location. */
import type { NextConfig } from 'next';

const palette = process.env.NEXT_PUBLIC_PALETTE === 'harbour' ? 'harbour' : 'navy';
const dev = process.env.NODE_ENV !== 'production';

/* which supplier the browser should expect: shows Duffel's test hotels in the city list in test mode */
const token = process.env.DUFFEL_ACCESS_TOKEN || '';
const supply = process.env.SUPPLY_MODE === 'simulated' || !token ? 'simulated' : token.startsWith('duffel_test_') ? 'duffel-test' : 'duffel-live';

const csp = [
  "default-src 'self'",
  /* 'unsafe-inline': Next's inline bootstrap scripts and the theme script in app/layout.tsx; eval only in development */
  `script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.js.stripe.com${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  /* supplier photos (hotels, airline logos) come from many hosts, always over https */
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://api.stripe.com https://*.stripe.com${dev ? ' ws: http://localhost:*' : ''}`,
  "frame-src 'self' https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(dev ? [] : ['upgrade-insecure-requests'])
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  ...(dev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }])
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || `.next-${palette}`,
  reactStrictMode: true,
  poweredByHeader: false,
  /* keeps the dev badge out of review screenshots */
  devIndicators: false,
  /* next dev would otherwise write an AGENTS.md into the site folder; nothing about tooling ships with the client's code */
  agentRules: false,
  env: { NEXT_PUBLIC_SUPPLY: supply },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};

export default nextConfig;
