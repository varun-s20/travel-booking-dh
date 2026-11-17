/* travel-booking (working name Overwing, a placeholder): Terms and conditions (components/pages/LegalNotice.tsx) */
import type { Metadata } from 'next';
import { LegalNotice } from '@/components/pages/LegalNotice';

export const metadata: Metadata = { title: 'Terms and conditions', description: 'The terms for booking flights and hotels on Overwing.' };

export default function TermsPage() {
  return <LegalNotice anchors={['payments', 'changes']} title="Terms and conditions" notice="The full terms for booking flights and hotels, including payments and changes, come from Overwing and are available on request." />;
}
