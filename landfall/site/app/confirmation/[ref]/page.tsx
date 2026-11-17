/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): confirmation
   Group F. The booking is read from the server by
   components/flights/Confirmation.tsx (GET /api/bookings/<ref>): for its
   owner, or with the guest key in ?key= (from checkout or the
   confirmation email). The title ("You're going to Lisbon | Landfall") is
   set by the page itself once the booking has loaded.
   Copy: landfall/content/copy.md, Confirmation.
   ===================================================================== */
import type { Metadata } from 'next';
import Confirmation from '@/components/flights/Confirmation';

type Props = { params: Promise<{ ref: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: 'Your booking', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { ref } = await params;
  const key = (await searchParams).key;
  return (
    <div className="t-page t-confirm">
      <div className="l-confirm">
        <Confirmation refCode={ref.toUpperCase()} accessKey={typeof key === 'string' && key.length <= 100 ? key : undefined} />
      </div>
    </div>
  );
}
