/* Sign in (group H). Copy: landfall/content/copy.md, Account. noindex (layout). */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignIn } from '@/components/account/Auth';

export const metadata: Metadata = { title: 'Sign in' };
export default function Page() { return <Suspense><SignIn /></Suspense>; }
