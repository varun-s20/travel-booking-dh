/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): email previews
   Group F. A review list of every booking and account email
   (lib/emails.ts), each opening its preview at /emails/<id>. A review
   route for Varun and the client, not a page visitors reach.
   ===================================================================== */
import type { Metadata } from 'next';
import Link from 'next/link';
import { EMAILS } from '@/lib/emails';
import Icon from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Email previews', robots: { index: false, follow: false } };

export default function EmailsPage() {
  const groups = ['Bookings', 'Account'] as const;
  return (
    <div className="t-page t-emails">
      <div className="l-narrow">
        <h1 className="t-display t-h1">Email previews</h1>
        {groups.map((g) => (
          <section className="f-mails" key={g} aria-labelledby={`mails-${g}`}>
            <h2 className="t-h3 f-mails__title" id={`mails-${g}`}>{g}</h2>
            <ul className="f-mails__list">
              {Object.entries(EMAILS).filter(([, e]) => e.group === g).map(([id, e]) => (
                <li key={id}>
                  <Link href={`/emails/${id}`} className="f-mails__item" prefetch={false}>
                    <span className="f-mails__subject">{e.subject}</span>
                    <span className="t-small t-muted">{e.preview}</span>
                    <Icon name="chev-r" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
