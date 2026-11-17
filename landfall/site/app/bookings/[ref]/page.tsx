/* Booking detail (group H). Copy: landfall/content/copy.md, Booking detail. noindex (layout). */
import type { Metadata } from 'next';
import { BookingDetail } from '@/components/account/Bookings';

type Props = { params: Promise<{ ref: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { return { title: `Booking ${(await params).ref.toUpperCase()}` }; }
export default async function Page({ params }: Props) {
  const ref = (await params).ref.toUpperCase();
  return <div className="t-page t-booking"><BookingDetail bookingRef={ref} /></div>;
}
