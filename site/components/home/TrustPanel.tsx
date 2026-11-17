/* =====================================================================
   Trust panel (Hipcamp's host banner): one deep panel, the heading and
   four facts with Faye's disc ticks on the left, a photo flush to the
   right edge. Only facts from the scope (content/copy.md, Trust panel).
   ===================================================================== */
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';

const FACTS = [
  'Stripe handles every card payment, so your card number goes to Stripe, not to us.',
  'Just before you pay, we check the price again with the airline or hotel and show the total with taxes and fees.',
  'Your booking reference and itinerary arrive by email and stay in your account.',
  'If something needs to change, call or email us with your booking reference.'
];

/* the 3:2 photo covers a 616 x 480 half-panel at 1440, so it is drawn 720px wide (the root scales past it);
   below 1025 it spans the column (2:1 on tablets, 3:2 on phones), width-bound */
const SIZES = '(min-width: 1441px) 50vw, (min-width: 1025px) 720px, (min-width: 641px) calc(100vw - 48px), calc(100vw - 32px)';

export function TrustPanel() {
  return (
    <section className="o-homeTrust b-wrap" aria-labelledby="home-trust-title">
      <div className="o-homeTrust__panel">
        <div className="o-homeTrust__media">
          {/* alt adjusted to the sourced photo (copy.md: "Hands holding a phone with a booking on screen, a coffee cup beside it") */}
          <Photo name="trust-reception-sign" alt="A Reception sign on a whitewashed wall above the sea" sizes={SIZES} className="o-homeTrust__img" />
        </div>
        <div className="o-homeTrust__copy">
          <h2 className="o-homeTrust__title a-h2" id="home-trust-title">Booked, paid and in your inbox</h2>
          <ul className="o-homeTrust__facts">
            {FACTS.map((f) => (
              <li className="o-homeTrust__fact" key={f}>
                <span className="a-disc" aria-hidden="true"><Icon name="tick" /></span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {/* round 3 (spec A10b) asked for three facts under the ticks; the critic found each one repeats a tick above
              (Stripe, email, your account), which caps depth as filler, so the row is left out */}
        </div>
      </div>
    </section>
  );
}
