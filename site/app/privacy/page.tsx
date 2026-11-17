/* travel-booking (working name Overwing, a placeholder): Privacy policy (components/pages/LegalNotice.tsx) */
import type { Metadata } from 'next';
import { LegalNotice } from '@/components/pages/LegalNotice';

export const metadata: Metadata = { title: 'Privacy policy', description: 'How Overwing collects, uses and protects your details.' };

export default function PrivacyPage() {
  return <LegalNotice anchors={['cookies']} title="Privacy policy" notice="The full privacy policy, including how cookies are used, comes from Overwing and is available on request." />;
}
