/* travel-booking (working name Overwing, a placeholder): create an account.
   The page is the form or view in components/account/AuthForms.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Create an account' };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RegisterFormPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <div className="t-account b-wrap"><RegisterForm next={one(sp.next)} /></div>;
}
