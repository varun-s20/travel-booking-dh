/* Create an account (group H). Copy: landfall/content/copy.md, Account. noindex (layout). */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Register } from '@/components/account/Auth';

export const metadata: Metadata = { title: 'Create an account' };
export default function Page() { return <Suspense><Register /></Suspense>; }
