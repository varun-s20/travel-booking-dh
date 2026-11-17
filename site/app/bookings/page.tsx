/* travel-booking (working name Overwing, a placeholder): your bookings.
   The page is the form or view in components/account/Dashboard.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { Dashboard } from '@/components/account/Dashboard';

export const metadata: Metadata = { title: 'Your bookings' };

export default function DashboardPage() {
  return <div className="t-account b-wrap"><Dashboard /></div>;
}
