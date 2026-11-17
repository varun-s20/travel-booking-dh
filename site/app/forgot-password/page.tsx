/* travel-booking (working name Overwing, a placeholder): reset your password.
   The page is the form or view in components/account/AuthForms.tsx; copy: content/copy.md, Account. */
import type { Metadata } from 'next';
import { ForgotForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotFormPage() {
  return <div className="t-account b-wrap"><ForgotForm /></div>;
}
