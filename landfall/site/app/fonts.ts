/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): fonts
   Self-hosted with next/font/local (spec 3): Newsreader (Production Type)
   and Albert Sans, both SIL OFL 1.1, latin subsets as variable woff2,
   licence files beside them in app/fonts/. Weight ranges are the files'
   own axes, so the browser never fakes a weight (global.css also sets
   font-synthesis: none). Exposed as --font-newsreader and --font-albert,
   mapped into --f-display and --f-ui at the top of global.css.
   Add latin-ext files here if the market needs them (spec 7).
   ===================================================================== */
import localFont from 'next/font/local';

export const newsreader = localFont({
  src: [{ path: './fonts/newsreader-latin-var.woff2', weight: '300 600', style: 'normal' }],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
  preload: true
});

export const albert = localFont({
  src: [{ path: './fonts/albert-sans-latin-var.woff2', weight: '300 700', style: 'normal' }],
  variable: '--font-albert',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true
});
