/* =====================================================================
   travel-booking (working name Overwing, a placeholder): AppLink
   next/link for every internal link. Session 1 skipped prefetching for
   routes not built yet (they logged 404s); every route exists now, so it
   prefetches as Next.js does by default. Kept as one seam for links.
   ===================================================================== */
import Link from 'next/link';
import type { ComponentProps } from 'react';

export function AppLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />;
}
