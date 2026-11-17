/* =====================================================================
   travel-booking (working name Overwing, a placeholder): confirmation
   "You're booked": the booking just made (kept in this browser) or one
   of the demo account's. components/booking/BookingView.tsx.
   ===================================================================== */
import type { Metadata } from 'next';
import { BookingPage } from '@/components/booking/BookingPage';

export const metadata: Metadata = { title: 'You’re booked' };

export default async function ConfirmationPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return (
    <div className="t-booking b-wrap">
      <BookingPage code={ref.toUpperCase()} mode="confirmation" />
    </div>
  );
}
