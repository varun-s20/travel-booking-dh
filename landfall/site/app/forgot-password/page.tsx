/* Forgot password (group H). Copy: landfall/content/copy.md, Account. noindex (layout). */
import type { Metadata } from 'next';
import { Forgot } from '@/components/account/Auth';

export const metadata: Metadata = { title: 'Reset your password' };
export default function Page() { return <Forgot />; }
