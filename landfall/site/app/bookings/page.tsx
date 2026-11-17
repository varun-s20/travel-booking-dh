/* My bookings (group H). Copy: landfall/content/copy.md, My bookings. noindex (layout). */
import type { Metadata } from 'next';
import { MyBookings } from '@/components/account/Bookings';

export const metadata: Metadata = { title: 'My bookings' };
export default function Page() { return <div className="t-page t-bookings"><MyBookings /></div>; }
