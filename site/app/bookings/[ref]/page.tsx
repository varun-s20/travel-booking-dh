/* =====================================================================
   travel-booking (working name Overwing, a placeholder): booking detail
   The confirmation layout plus status, travelers, payment lines and the
   change or cancel actions (copy.md, Booking detail).
   ===================================================================== */
import type { Metadata } from 'next';
import { BookingPage } from '@/components/booking/BookingPage';

type Props = { params: Promise<{ ref: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Booking ${(await params).ref.toUpperCase()}` };
}

export default async function BookingDetailPage({ params }: Props) {
  const { ref } = await params;
  return (
    <div className="t-booking b-wrap">
      <BookingPage code={ref.toUpperCase()} mode="detail" />
    </div>
  );
}
