/* =====================================================================
   travel-booking (working name Overwing, a placeholder): root layout
   Loads the CSS layers once, in cascade order (tokens, base, ui, chrome,
   search, home, results, hotels, booking, account, pages, motion), sets the
   palette version on <html>,
   and wraps every page in the shared chrome: sprite, skip link,
   header, main, footer. The one-line head script adds the `js` class
   that gates every hidden start state (conventions.md).
   The whole demo is noindex while the demo notice stands (copy.md note 10).
   ===================================================================== */
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { preload } from 'react-dom';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/chrome.css';
import './styles/search.css';
import './styles/home.css';
import './styles/r3-ui.css';
import './styles/r3-home.css';
import './styles/results.css';
import './styles/hotels.css';
import './styles/booking.css';
import './styles/account.css';
import './styles/pages.css';
import './styles/motion.css';
import { Sprite } from '@/components/chrome/Sprite';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { InputModality } from '@/components/chrome/InputModality';
import { Toaster } from '@/components/chrome/Toaster';
import { PALETTE, THEME_COLOR } from '@/lib/palette';
import { SITE } from '@/lib/site';

/* Geist (Vercel, SIL OFL), the UI layer, self-hosted: one variable file, 100 to 900 */
const geist = localFont({
  src: './fonts/geist/Geist-Variable.woff2',
  weight: '100 900',
  variable: '--font-geist-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  ...(SITE.url ? { metadataBase: new URL(SITE.url) } : {}),
  title: { default: 'Overwing | Book flights and hotels', template: '%s | Overwing' },
  description: 'Search flights and hotels, compare them by price, time and stops, and see the full total, taxes and fees included, before you pay with Stripe.',
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: `/icons/overwing-icon-${PALETTE}.svg`, type: 'image/svg+xml' }],
    apple: `/icons/overwing-touch-${PALETTE}-180.png`
  },
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_US' },
  twitter: { card: 'summary_large_image' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: THEME_COLOR[PALETTE]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* Calibre Bold sets the first headline: preloaded on its own (base.css explains why Calibre is not next/font) */
  preload('/fonts/calibre/Calibre-Bold.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="en" data-palette={PALETTE} className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Sprite />
        <div className="b-app" data-app>
          <a className="a-skip" href="#main">Skip to content</a>
          <Header />
          <main id="main" className="b-main" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <InputModality />
        <Toaster />
      </body>
    </html>
  );
}
