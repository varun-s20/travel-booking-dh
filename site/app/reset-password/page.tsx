/* travel-booking (working name Overwing, a placeholder): choose a new password.
   The page is the form or view in components/account/AuthForms.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { ResetForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Choose a new password' };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ResetFormPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <div className="t-account b-wrap"><ResetForm expired={one(sp.token) === 'expired'} /></div>;
}
