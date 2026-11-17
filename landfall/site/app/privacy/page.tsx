/* Privacy (group H). Copy: landfall/content/copy.md, Terms and Privacy (as content/copy.md). No date and no contents list until the client's text arrives. */
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy policy', description: 'How Landfall collects, uses and protects your details.' };

export default function PrivacyPage() {
  return (
    <div className="t-page t-legal">
      <article className="l-narrow x-read x-legal">
        <h1 className="t-display t-h1">Privacy policy</h1>
        {/* CLIENT COPY REQUIRED: the privacy policy, from the client or their lawyer. */}
        <p className="x-legal__notice">The full privacy policy, on how Landfall collects, uses and protects your details, comes from Landfall.</p>
        <p>Questions about it? Email <a className="a-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        {/* round 3, Developer A: the footer's "Cookies" link lands here (round3-spec.md A12). CLIENT COPY REQUIRED: the full cookie policy. The lines below state only what this build does (lib/recent.ts). */}
        <h2 className="t-h3" id="cookies">Cookies and this browser</h2>
        <p>Your recent searches and the trips you looked at are kept in this browser only, so the homepage can show them again under Recommended for you. They are never sent to us. Clear them at any time with Clear recent searches on the homepage.</p>
      </article>
    </div>
  );
}
