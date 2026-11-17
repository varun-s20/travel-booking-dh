/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): back from a
   payment redirect
   Checkout confirms cards in the page (3-D Secure opens in Stripe's own
   window), so this is rarely reached: only when Stripe had to send the
   visitor away to finish a payment. It completes the booking the same
   way checkout does (components/booking/CheckoutReturn.tsx).
   ===================================================================== */
import type { Metadata } from 'next';
import CheckoutReturn from '@/components/booking/CheckoutReturn';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: 'Confirming your booking', robots: { index: false, follow: false } };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

export default async function CheckoutReturnPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <div className="t-page t-checkout"><CheckoutReturn bookingId={one(sp.booking)} guestKey={one(sp.key) || undefined} redirectStatus={one(sp.redirect_status)} /></div>;
}
