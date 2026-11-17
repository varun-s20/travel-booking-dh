/* =====================================================================
   travel-booking (working name Overwing, a placeholder): Footer
   Varun V10: phone and email first, Back to top, then the link columns
   (round 3 spec A14: six columns and 42 links, the competitors' depth;
   accordions at 390), the facts row (the demo notice came out on
   Varun's 16:28 ruling), copyright and the credit. Ink over the hero view at 12%.
   No social pills and no "since" fact: the client has given neither.
   ===================================================================== */
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { BackToTop } from '@/components/chrome/BackToTop';
import { FooterCols } from '@/components/chrome/FooterCols';
import { SITE, HERO_VIEW } from '@/lib/site';

export function Footer() {
  return (
    <footer className="o-footer is-dark">
      {/* cover on a footer taller than it is wide on phones: about 1400px drawn at 390, 1200 at 768, the full width from 1025 */}
      <Photo name={HERO_VIEW} alt="" sizes="(max-width: 640px) 380vw, (max-width: 1024px) 160vw, 100vw" className="o-footer__photo" />
      <div className="b-wrap">
        <div className="o-footer__top">
          <div className="o-footer__contact">
            <a className="o-footer__phone" href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>{SITE.phone}</a>
            <a className="o-footer__email" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <BackToTop />
        </div>

        {/* round 3 (spec A14): six columns, 42 links, every one a real page or a real search */}
        <FooterCols />

        <ul className="o-footer__facts">
          <li><Icon name="card" />Prices in USD</li>
          <li><Icon name="help" />English</li>
          <li><Icon name="lock" />Payments by Stripe</li>
        </ul>

        <div className="o-footer__strip">
          <p>© 2026 Overwing</p>
          <p>Created with love by Digital Heroes</p>
        </div>
      </div>
    </footer>
  );
}
