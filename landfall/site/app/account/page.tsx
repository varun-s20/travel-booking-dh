/* Profile (group H). Copy: landfall/content/copy.md, Profile. noindex (layout). */
import type { Metadata } from 'next';
import Profile from '@/components/account/Profile';

export const metadata: Metadata = { title: 'Your profile' };
export default function Page() { return <div className="t-page t-account"><Profile /></div>; }
