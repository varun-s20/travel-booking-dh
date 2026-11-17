/* =====================================================================
   travel-booking (working name Overwing, a placeholder): 404
   One cabin window with its blind fully down, the window's quiet
   "closed" state (spec 2b). Copy: content/copy.md, 404 and error.
   ===================================================================== */
import type { Metadata } from 'next';
import { NotFoundBody } from '@/components/NotFoundBody';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return <NotFoundBody />;
}
