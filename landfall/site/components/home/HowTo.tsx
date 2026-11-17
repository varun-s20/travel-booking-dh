/* =====================================================================
   Landfall (working name, a placeholder): what happens when you book
   Kasa's promo rows: three alternating rows, a 4:3 photo (radius 16) on
   one side and an H3 with its text on the other; the photo sits over the
   text at 390. Facts from the scope only. Never three icon cards.
   Copy: landfall/content/copy.md, What happens when you book. The photo
   alts were adjusted to the photos as sourced, as the deck asks
   (public/images/credits.md).
   ===================================================================== */
import Photo from '@/components/ui/Photo';
import SplitText from '@/components/ui/SplitText';

const ROWS = [
  {
    id: 'total', photo: 'promo/ferry-deck-puget-sound', fx: 62, fy: 50,
    alt: 'A ferry deck at sunset, its lights on along the rail above calm water',
    title: 'You see the full total first',
    text: "Every flight and room shows the total for the whole trip before anything else, with taxes and fees already in it, and the price per traveler or per night under it. Just before you pay, we check that price again with the airline or hotel, so the total you agree to is the one that's really there."
  },
  {
    id: 'stripe', photo: 'promo/lighthouse-pier-namerikawa', fx: 50, fy: 55,
    alt: 'A quiet pier at dusk running out to a small lighthouse, the sea calm under a pink sky',
    title: 'Your card details go to Stripe',
    text: "Card payments run through Stripe. You enter your card in Stripe's payment form on our checkout page, so your card number goes to Stripe, not to us. If your card is declined, nothing is charged, and you can try again or use another card on the same page."
  },
  {
    id: 'trips', photo: 'promo/utrecht-canal-dining', fx: 50, fy: 55,
    alt: 'Diners at tables along a canal at dusk, a small boat passing below the lit terrace',
    title: 'Your trip stays in My bookings',
    text: 'When the booking is confirmed, your booking reference and itinerary come by email. Sign in and My bookings keeps every trip, upcoming and past, with the e-ticket numbers the airline issues, on your phone or your computer. If your plans change, contact us with your booking reference.'
  }
];

export default function HowTo() {
  return (
    <section className="o-howto" aria-labelledby="howto-title">
      <div className="l-container">
        <hr className="a-rule o-howto__rule" />
        <SplitText as="h2" className="o-howto__title t-display t-h2" id="howto-title">What happens when you book</SplitText>
        <div className="o-howto__rows">
          {ROWS.map((r) => (
            <article className="m-howrow" key={r.id} aria-labelledby={`howto-${r.id}`}>
              <Photo name={r.photo} className="m-howrow__media" fx={r.fx} fy={r.fy} alt={r.alt} sizes="(min-width: 1025px) 700px, (min-width: 641px) 45vw, 100vw" />
              <div className="m-howrow__text">
                <h3 className="m-howrow__title t-h3" id={`howto-${r.id}`}>{r.title}</h3>
                <p className="m-howrow__body t-body">{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
