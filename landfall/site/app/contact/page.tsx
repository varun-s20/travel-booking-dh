/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): Contact
   Group H. Phone and email large (V10 sizes), then the form with a real
   status. No support hours (copy.md: none given). A decorative water
   photo beside the details (the image rule; alt="").
   Copy: landfall/content/copy.md, Contact (as content/copy.md).
   ===================================================================== */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE } from '@/lib/site';
import { ContactForm } from '@/components/account/Pages';
import Photo from '@/components/ui/Photo';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Call or email Landfall about a booking, a payment or anything else on the site. Have your booking reference ready.'
};

export default function ContactPage() {
  return (
    <div className="t-page t-contact">
      <div className="l-container x-contact">
        <div className="x-contact__intro">
          <h1 className="t-display t-h1">Contact us</h1>
          <p className="t-lead">Call or email us about a booking, a payment or anything else on the site. If it’s about a trip, have your booking reference ready. It’s in your confirmation email.</p>
          {/* CLIENT COPY REQUIRED: support hours, once the client gives them. */}
          <dl className="x-contact__details">
            <div><dt>Phone</dt><dd><a className="x-contact__phone t-num" href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>{SITE.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a className="x-contact__email" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          </dl>
        </div>
        <Photo name="pages/harbour-dawn-boats" alt="" sizes="(min-width: 1025px) 520px, 100vw" className="x-contact__photo" fx={50} fy={55} />
      </div>
      <section className="l-narrow x-contact__form" aria-labelledby="ct-h">
        <h2 id="ct-h" className="t-display t-h2">Send us a message</h2>
        {/* the form reads ?ref= and ?topic= ("Contact us to cancel" on a booking) */}
        <Suspense><ContactForm /></Suspense>
      </section>
    </div>
  );
}
