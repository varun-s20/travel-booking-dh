'use client';
/* The footer's two links that depend on the visitor:
   - Flights and Hotels open the home search on that tab (from another page
     the home page reads the #search or #search-hotels hash on arrival);
   - "Log in" becomes "Log out" once logged in (copy.md, footer). */
import { usePathname } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { requestSearch, toast } from '@/lib/client';
import { currentUser, logOut, useStore } from '@/lib/store';
import { ROUTES } from '@/lib/site';

export function FooterSearchLink({ mode, label }: { mode: 'flights' | 'hotels'; label: string }) {
  const pathname = usePathname();
  const hash = mode === 'hotels' ? '#search-hotels' : '#search';
  return (
    <Link className="o-footer__link" href={`/${hash}`} onClick={(e) => {
      if (pathname !== '/') return;
      e.preventDefault();
      requestSearch(mode);
    }}>{label}</Link>
  );
}

export function FooterAuthLink() {
  const user = currentUser(useStore());
  if (!user) return <Link className="o-footer__link" href={ROUTES.login}>Log in</Link>;
  return <button className="o-footer__link -button" type="button" onClick={() => { logOut(); toast('You’ve logged out'); }}>Log out</button>;
}
