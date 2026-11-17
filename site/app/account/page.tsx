/* travel-booking (working name Overwing, a placeholder): your profile.
   The page is the form or view in components/account/Profile.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { Profile } from '@/components/account/Profile';

export const metadata: Metadata = { title: 'Your profile' };

export default function ProfilePage() {
  return <div className="t-account b-wrap"><Profile /></div>;
}
