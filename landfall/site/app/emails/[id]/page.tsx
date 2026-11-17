/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): one email
   Group F. Renders the email (components/flights/email.ts) in the
   current palette and shows it in a frame, under its subject and
   preview line. Unknown ids are a 404.
   ===================================================================== */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { emailContent, EMAILS } from '@/lib/emails';
import { PALETTE } from '@/lib/palette';
import { SITE } from '@/lib/site';
import Icon from '@/components/ui/Icon';
import EmailFrame from '@/components/flights/EmailFrame';
import { renderEmail } from '@/components/flights/email';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = EMAILS[(await params).id];
  return e ? { title: e.subject, robots: { index: false, follow: false } } : {};
}

export function generateStaticParams() { return Object.keys(EMAILS).map((id) => ({ id })); }

export default async function EmailPage({ params }: Props) {
  const id = (await params).id;
  const e = emailContent(id, SITE.url || 'http://localhost:3003');
  if (!e) notFound();
  return (
    <div className="t-page t-emails">
      <div className="l-narrow f-mail">
        <p className="f-back"><Link className="a-link" href="/emails" prefetch={false}><Icon name="arrow-l" size="sm" />Email previews</Link></p>
        <h1 className="t-h3 f-mail__subject">{e.subject}</h1>
        <p className="t-small t-muted">{e.preview}</p>
      </div>
      <div className="f-mail__wrap">
        <EmailFrame html={renderEmail(e, PALETTE)} title={e.subject} />
      </div>
    </div>
  );
}
