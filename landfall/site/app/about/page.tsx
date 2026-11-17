/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): About
   Group H. Kasa text styles in a 680 column under a 21:9 water photo.
   Copy: landfall/content/copy.md, About (interim body from scope facts).
   ===================================================================== */
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import Photo from '@/components/ui/Photo';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Landfall is a place to search, book and keep flights and hotels, with every price shown as a full total and card payments by Stripe.'
};

export default function AboutPage() {
  return (
    <div className="t-page t-about">
      <div className="l-container">
        <Photo name="pages/harbour-first-light" priority alt="A harbour at first light, still water and moored boats under a pale sky" sizes="(min-width: 1312px) 1248px, 94vw" className="x-banner" fx={50} fy={55} />
      </div>
      <article className="l-narrow x-read">
        <h1 className="t-display t-h1">About Landfall</h1>
        <p className="t-lead">A place to search, book and keep your flights and hotels.</p>
        {/* CLIENT COPY REQUIRED: the company story, in the client's own words, replaces this interim body (scope facts only). */}
        <h2 className="t-display t-h2">What you can book</h2>
        <p>Flights and hotel rooms. Search flights by where you’re leaving from, where you’re going, your dates, how many people are traveling and the cabin you want. Search hotels by city, dates, guests and rooms. Results show the total price, and you can filter and sort them until the right one is at the top.</p>
        <h2 className="t-display t-h2">How booking works</h2>
        <p>Choose a flight and fare, or a hotel and room, and add the travelers’ details. Just before you pay, we check the price and availability again with the airline or hotel, so you book what’s really there. You pay by card through Stripe. Your confirmation, booking reference and itinerary come to you by email.</p>
        <h2 className="t-display t-h2">Your bookings, in one place</h2>
        <p>With an account, My bookings keeps your upcoming and past bookings, their references and the travel documents the airline issues, on your phone or your computer.</p>
        <h2 className="t-display t-h2">Talk to us</h2>
        <p>Call <a className="a-link" href={SITE.phoneHref}>{SITE.phone}</a> or email <a className="a-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>. If it’s about a trip, have your booking reference ready.</p>
      </article>
    </div>
  );
}
