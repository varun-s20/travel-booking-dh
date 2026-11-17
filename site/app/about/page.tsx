/* =====================================================================
   travel-booking (working name Overwing, a placeholder): About
   Spec 2b: a 440 banner with a stock photo under Varun's inner-page ink
   scrim (.78 / .4 / .72), H1 and one line; then a 640 text column with
   one 21:9 photo between paragraphs. The body is copy.md's interim text
   from scope facts only (copy.md note 3).
   ===================================================================== */
import type { Metadata } from 'next';
import { Photo } from '@/components/Photo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Overwing is a place to search, book and keep flights and hotels, with card payments by Stripe and every booking in your account.'
};

export default function AboutPage() {
  return (
    <div className="t-about">
      {/* ===== Banner ===== */}
      <section className="o-banner" aria-labelledby="about-title">
        {/* revision 2026-11-11, item 32: the old hero's subject, the wing over cloud, moves to the banner; the coast is not repeated here */}
        <Photo name="about-wing-cloud" alt="Late light across a wing and a bank of cloud" priority className="o-banner__img"
          sizes="(min-width: 1025px) calc(100vw - 88px), 100vw" />
        <div className="o-banner__text b-wrap">
          <h1 className="o-banner__title a-h1" id="about-title">About Overwing</h1>
          <p className="o-banner__line a-lead">A place to search, book and keep your flights and hotels.</p>
        </div>
      </section>

      {/* ===== Body (interim: scope facts only) ===== */}
      {/* CLIENT COPY REQUIRED: the company story (who runs the business, from where, why it started) goes above these sections when the client sends it */}
      <div className="o-prose b-wrap">
        <section className="o-prose__section" aria-labelledby="about-book">
          <h2 className="a-h2" id="about-book">What you can book</h2>
          <p>Flights and hotel rooms. Search flights by where you’re leaving from, where you’re going, your dates, how many people are traveling and the cabin you want. Search hotels by city, dates, guests and rooms. Results show the total price, and you can filter and sort them until the right one is at the top.</p>
        </section>
        <section className="o-prose__section" aria-labelledby="about-how">
          <h2 className="a-h2" id="about-how">How booking works</h2>
          <p>Choose a flight and fare, or a hotel and room, and add the travelers’ details. Just before you pay, we check the price and availability again with the airline or hotel, so you book what’s really there. You pay by card through Stripe. Your confirmation, booking reference and itinerary come to you by email.</p>
        </section>
      </div>
      <div className="o-prose__wide b-wrap">
        {/* revision 2026-11-11, item 32: one new 21:9 photo (alt written to the sourced photo, for the Copywriter) */}
        <Photo name="about-harbour-window" alt="A harbour with moored boats, seen through a dark room's window" className="o-prose__img" sizes="(min-width: 1441px) 86vw, (min-width: 1025px) 1232px, calc(100vw - 32px)" />
      </div>
      <div className="o-prose b-wrap">
        <section className="o-prose__section" aria-labelledby="about-keep">
          <h2 className="a-h2" id="about-keep">Your bookings, in one place</h2>
          <p>With an account you can see your upcoming and past bookings, their references and the travel documents the airline issues, on your phone or your computer.</p>
        </section>
        <section className="o-prose__section" aria-labelledby="about-talk">
          <h2 className="a-h2" id="about-talk">Talk to us</h2>
          <p>Call <a className="o-prose__link" href={SITE.phoneHref}>{SITE.phone}</a> or email <a className="o-prose__link" href={`mailto:${SITE.email}`}>{SITE.email}</a>. If it’s about a trip, have your booking reference ready.</p>
        </section>
      </div>
    </div>
  );
}
