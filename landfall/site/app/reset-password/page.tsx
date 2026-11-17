/* Reset password (group H): ?expired=1 shows the expired link state. Copy: landfall/content/copy.md, Account. noindex (layout). */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Reset } from '@/components/account/Auth';

export const metadata: Metadata = { title: 'Choose a new password' };
export default function Page() { return <Suspense><Reset /></Suspense>; }
