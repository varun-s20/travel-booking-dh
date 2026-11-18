/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): root layout
   Order (conventions.md, adapted to Next): tokens, then global CSS, then
   the page group stylesheets, all imported once here; the sprite; the
   app wrapper (data-app: lib/client.ts makes it inert while a dialog
   rendered into <body> is open) holding the skip link, header, main and
   footer; the toast listener outside it.
   - data-palette on <html> from NEXT_PUBLIC_PALETTE (navy on 3003,
     harbour on 3004); theme-color follows it.
   - a one-line head script sets the js class that gates every hidden
     start state, so nothing hides without JS.
   - noindex for the whole demo while it runs on placeholders.
   Shared file: groups F and H change it only for small additions,
   listed in landfall/build/progress.md.
   ===================================================================== */
import type { Metadata, Viewport } from 'next';
import './styles/tokens.css';
import './styles/global.css';
import './styles/parts.css';
import './styles/home.css';
import './styles/flights.css';
import './styles/hotels.css';
import './styles/booking.css';
import { albert, newsreader } from './fonts';
import { PALETTE } from '@/lib/palette';
import { SITE } from '@/lib/site';
import Sprite from '@/components/chrome/Sprite';
import Header from '@/components/chrome/Header';
import Footer from '@/components/chrome/Footer';
import Toaster from '@/components/chrome/Toaster';

/* meta theme-color per palette: --c-theme in app/styles/tokens.css (keep the two in step) */
const THEME_COLOR = { navy: '#16225A', harbour: '#173B4F' } as const;

export const metadata: Metadata = {
  ...(SITE.url ? { metadataBase: new URL(SITE.url) } : {}),
  title: { default: 'Landfall | Flights and hotels, priced in full', template: `%s | ${SITE.name}` },
  description: 'Search flights and hotels, compare every option by its full total with taxes and fees included, and pay by card through Stripe.',
  robots: { index: false, follow: false },
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_US' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: THEME_COLOR[PALETTE]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette={PALETTE} className={`${newsreader.variable} ${albert.variable}`} suppressHydrationWarning>
      <head>
        {/* also removes what Netlify adds to <head> on *.netlify.app addresses: a line break and an HTML
            comment ("This site is hosted on Netlify..."). React finds nodes it didn't render and re-renders
            the whole page in the browser (error #418). Runs before React starts and removes only
            Netlify's comment and blank text, which React never renders in <head>. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');for(var n=document.head.firstChild,x;n;n=x){x=n.nextSibling;if((n.nodeType===8&&/Netlify/.test(n.data))||(n.nodeType===3&&!n.data.trim()))n.remove()}" }} />
      </head>
      <body>
        <Sprite />
        <div data-app>
          <a className="a-skip" href="#main">Skip to content</a>
          <Header />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
