/* Terms (group H). Copy: landfall/content/copy.md, Terms and Privacy (as content/copy.md). No date and no contents list until the client's text arrives. */
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms and conditions', description: 'The terms for booking flights and hotels on Landfall.' };

export default function TermsPage() {
  return (
    <div className="t-page t-legal">
      <article className="l-narrow x-read x-legal">
        <h1 className="t-display t-h1">Terms and conditions</h1>
        {/* CLIENT COPY REQUIRED: the terms, from the client or their lawyer. */}
        <p className="x-legal__notice">The full terms for booking flights and hotels come from Landfall.</p>
        <p>Questions about them? Email <a className="a-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        {/* round 3, Developer A: the footer's "Price display" link lands here (round3-spec.md A12); the line is the footer's price disclosure */}
        <h2 className="t-h3" id="prices">Price display</h2>
        <p>Prices include taxes and fees and are for all travelers or the whole stay unless a line says per traveler or per night. Savings lines compare a price with the usual price for the same route or hotel over the last 30 days.</p>
      </article>
    </div>
  );
}
