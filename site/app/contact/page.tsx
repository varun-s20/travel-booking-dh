/* =====================================================================
   travel-booking (working name Overwing, a placeholder): Contact
   Spec 2b: contact details large (Varun V10: phone and email first, 26px
   and 18px) with a photo, beside the contact form. No support hours and
   no address: the client hasn't given them (copy.md, Contact).
   ===================================================================== */
import type { Metadata } from 'next';
import { Photo } from '@/components/Photo';
import { ContactForm } from '@/components/pages/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Call or email Overwing about a booking, a payment or anything else on the site. Have your booking reference ready.'
};

export default function ContactPage() {
  return (
    <div className="t-contact b-wrap">
      <div className="o-pageHead">
        <h1 className="a-h1">Contact us</h1>
        <p className="o-pageHead__intro">Call or email us about a booking, a payment or anything else on the site. If it’s about a trip, have your booking reference ready. It’s in your confirmation email.</p>
      </div>
      <div className="o-contact">
        <div className="o-contact__details">
          {/* CLIENT COPY REQUIRED: support hours and a postal address, if the client wants them shown */}
          <dl className="o-contact__list">
            <div><dt>Phone</dt><dd><a className="o-contact__phone" href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>{SITE.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a className="o-contact__email" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          </dl>
          {/* revision 2026-11-11, item 33: a hand on a paper map replaces the phone on a map (a recognisable phone model).
              Alt adjusted to the sourced photo, for the Copywriter (copy.md: "A phone and a folded paper map on a café table by a window") */}
          <Photo name="contact-map-pen" alt="A hand tracing a route with a pen on a paper map, an open notebook below" className="o-contact__img"
            sizes="(min-width: 1441px) 36vw, (min-width: 1025px) 520px, calc(100vw - 32px)" />
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
