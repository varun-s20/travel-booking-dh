/* Terms and Privacy (spec 2b: one 720 text column, H1, no photo). Until
   the client or their lawyer sends the text, a one-line notice only
   (copy.md, Terms and Privacy). No last-updated date: there is no real
   document to date yet. */
import { SITE } from '@/lib/site';

export function LegalNotice({ title, notice, anchors = [] }: { title: string; notice: string; anchors?: string[] }) {
  return (
    <div className="t-legal b-wrap">
      <div className="o-legal">
        {/* round 3 (spec A14): the footer links to these sections; they open the notice until the real text has them */}
        {anchors.map((a) => <span key={a} id={a} className="o-legal__anchor" aria-hidden="true" />)}
        <h1 className="a-h1">{title}</h1>
        {/* CLIENT COPY REQUIRED: the full text from the client or their lawyer, as H2 sections at 18px / 1.55 */}
        <p className="o-legal__lead">{notice}</p>
        <p className="o-legal__line">Questions? Email <a className="o-prose__link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </div>
    </div>
  );
}
