/* travel-booking (working name Overwing, a placeholder): log in.
   The page is the form or view in components/account/AuthForms.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { LoginForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Log in' };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginFormPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <div className="t-account b-wrap"><LoginForm next={one(sp.next)} reset={one(sp.reset) === '1'} /></div>;
}
