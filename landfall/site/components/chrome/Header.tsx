/* =====================================================================
   Landfall (working name, a placeholder): header, menu sheet, account menu
   Kasa's 66px strip: frosted with white text while it sits on a hero
   photo ([data-hero-photo]), solid white everywhere else; hides on
   scroll down past 120 and returns on any scroll up (400ms settle).
   The same scroll job runs the pinned compact search ([data-compact]):
   on home it appears once the hero card and photo have gone; it docks at
   74 under the header (with the header's white strip behind it) or floats
   at 24 while the header is hidden. The hero's caption, pause and tabs
   fade before the header or the bar can cover them.
   Menu sheet below 1025 and the signed-in account menu are rendered into
   <body>: the app goes inert, focus is trapped, Escape closes and focus
   returns to the opener. The signed-in state comes from the server
   session (lib/session.ts). Copy: landfall/content/copy.md, Header and Menu.
   ===================================================================== */
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { addScrollJob, prefersReducedMotion, setAppInert, toast, trapTab } from '@/lib/client';
import { signOut as endSession, useSession } from '@/lib/session';
import { setSearch, useSearch } from '@/components/search/store';
import Icon from '@/components/ui/Icon';
import Logo from '@/components/chrome/Logo';

const NAV = 66, COMPACT = 52;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const user = session.user;
  const search = useSearch();
  const ref = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const acctBtn = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  const [acct, setAcct] = useState(false);
  const home = pathname === '/';

  /* ---- one scroll job for the header, the compact bar and the hero overlays ---- */
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastY = window.scrollY;
    let hidden = false;
    const desktopMq = window.matchMedia('(min-width: 1025px)');
    header.classList.remove('is-hidden');
    /* keyboard focus entering a hidden header brings it back */
    const onFocus = () => { hidden = false; header.classList.remove('is-hidden'); };
    header.addEventListener('focusin', onFocus);
    const stop = addScrollJob((y) => {
      const photo = document.querySelector<HTMLElement>('[data-hero-photo]');
      const card = document.querySelector<HTMLElement>('[data-hero-card] .m-search__card');
      const compact = document.querySelector<HTMLElement>('[data-compact]');
      const photoBottom = photo ? photo.getBoundingClientRect().bottom : -1;
      const locked = document.body.classList.contains('is-locked');
      if (Math.abs(y - lastY) > 4) { hidden = y > lastY && y > 120 && !locked; header.classList.toggle('is-hidden', hidden); }
      if (y < 60) { hidden = false; header.classList.remove('is-hidden'); }
      let docked = false;
      if (compact) {
        const pageMode = compact.getAttribute('data-compact') === 'page';
        /* home: only once the photo's bottom has passed the bar's own bottom (floating 24 + 52, docked 74 + 52), so the bar never sits on the photo */
        const barBottom = hidden ? (desktopMq.matches ? 24 : 12) + COMPACT : NAV + 8 + COMPACT;
        const past = pageMode || (!!card && card.getBoundingClientRect().bottom < 0 && photoBottom < barBottom);
        docked = past && !hidden;
        compact.classList.toggle('is-shown', past);
        compact.classList.toggle('is-docked', docked);
        compact.inert = !past;
      }
      /* the caption, pause and tabs fade well before the header or the bar (which comes in once the photo has gone) can reach them */
      const cover = (hidden ? 0 : NAV) + (photo ? 160 : 0);
      let tabsGone = false;
      document.querySelectorAll<HTMLElement>('.o-hero__caption, .o-hero__pause, .o-hero__tabs').forEach((el) => {
        const gone = el.getBoundingClientRect().top < cover + 8;
        el.classList.toggle('is-covered', gone);
        if (gone && el.classList.contains('o-hero__tabs')) tabsGone = true;
      });
      /* below 1025 the lower photo is bright city: the header turns solid once the tabs have faded (critic, 2026-11-11) */
      const overPhoto = !!photo && photoBottom >= NAV + 4 && !docked && (desktopMq.matches || !tabsGone);
      header.classList.toggle('-photo', overPhoto);
      header.classList.toggle('has-strip', docked);
      lastY = y;
    });
    return () => { stop(); header.removeEventListener('focusin', onFocus); };
  }, [pathname]);

  /* ---- close the menus on navigation ---- */
  useEffect(() => { setMenu(false); setAcct(false); }, [pathname]);

  /* ---- account menu: outside click and Escape ---- */
  useEffect(() => {
    if (!acct) return;
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!ref.current?.contains(t)) setAcct(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAcct(false); acctBtn.current?.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [acct]);

  async function signOut() {
    setAcct(false); setMenu(false);
    await endSession();
    toast("You've signed out");
    router.push('/');
  }

  /* Flights and Hotels go to / and /?mode=hotels; on home they switch the whole page in place (round 3, A0) */
  function onTab(e: React.MouseEvent, tab: 'flights' | 'hotels') {
    setSearch({ tab });
    if (!home) return;
    e.preventDefault();
  }
  const tabCurrent = (tab: 'flights' | 'hotels'): 'page' | undefined => (pathname.startsWith(`/${tab}`) || (home && search.tab === tab) ? 'page' : undefined);

  return (
    <>
      <header ref={ref} className={`o-header${home ? ' -photo' : ''}`}>
        <div className="o-header__in">
          <Logo />
          <nav className="o-header__nav" aria-label="Main">
            <ul className="o-header__links">
              <li><Link prefetch={false} className="o-header__link" href="/" onClick={(e) => onTab(e, 'flights')} aria-current={tabCurrent('flights')}>Flights</Link></li>
              <li><Link prefetch={false} className="o-header__link" href="/?mode=hotels" onClick={(e) => onTab(e, 'hotels')} aria-current={tabCurrent('hotels')}>Hotels</Link></li>
              <li><Link prefetch={false} className="o-header__link" href="/#destinations">Destinations</Link></li>
              <li><Link prefetch={false} className="o-header__link" href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined}>Help</Link></li>
            </ul>
          </nav>
          <div className="o-header__end">
            <Link prefetch={false} className="o-header__link o-header__bookings" href="/bookings" aria-current={pathname.startsWith('/bookings') ? 'page' : undefined}>My bookings</Link>
            {user ? (
              <>
                <button ref={acctBtn} type="button" className="a-button -ghost o-header__signin" aria-expanded={acct} aria-controls={acct ? 'acct-menu' : undefined} aria-label={`Your account, ${user.firstName} ${user.lastName}`} onClick={() => setAcct((a) => !a)}>Your account</button>
                {acct && (
                  <div className="m-acctmenu" id="acct-menu">
                    <p className="m-acctmenu__who">{user.firstName} {user.lastName}</p>
                    <Link prefetch={false} className="m-acctmenu__item" href="/bookings">My bookings</Link>
                    <Link prefetch={false} className="m-acctmenu__item" href="/account">Profile</Link>
                    <button type="button" className="m-acctmenu__item" onClick={signOut}>Sign out</button>
                  </div>
                )}
              </>
            ) : (
              /* final pass: until the session is read (loading on the server and in the first paint), the slot holds its place unseen, so a signed-in visitor never sees "Sign in" flash */
              <Link prefetch={false} className={`a-button -ghost o-header__signin${session.status === 'ready' ? '' : ' is-pending'}`} href="/login">Sign in</Link>
            )}
            <Link prefetch={false} className="o-header__icon o-header__account" href={user ? '/account' : '/login'} aria-label={user ? 'Your account' : 'Sign in or create an account'}><Icon name="user" /></Link>
            <button ref={menuBtn} type="button" className="o-header__icon o-header__menu" aria-expanded={menu} aria-controls={menu ? 'menu' : undefined} aria-label="Menu" onClick={() => setMenu(true)}><Icon name="menu" /></button>
          </div>
        </div>
      </header>
      <MenuSheet open={menu} onClose={(focus) => { setMenu(false); if (focus) window.setTimeout(() => menuBtn.current?.focus(), 40); }} signedIn={!!user} onSignOut={signOut} onTab={(tab) => setSearch({ tab })} />
    </>
  );
}

function MenuSheet({ open, onClose, signedIn, onSignOut, onTab }: { open: boolean; onClose: (focus: boolean) => void; signedIn: boolean; onSignOut: () => void; onTab: (t: 'flights' | 'hotels') => void }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setAppInert(true);
      document.body.classList.add('is-locked');
      return;
    }
    if (!mounted) return;
    setShown(false);
    setAppInert(false);
    document.body.classList.remove('is-locked');
    const t = window.setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  /* once the sheet is in the page: fade it in and focus the close button (the ref exists only after this commit) */
  useEffect(() => {
    if (!mounted || !open) return;
    const raf = requestAnimationFrame(() => { setShown(true); closeRef.current?.focus(); });
    return () => cancelAnimationFrame(raf);
  }, [mounted, open]);
  if (!mounted) return null;
  const row = (href: string, label: string, extra?: () => void) => (
    <Link prefetch={false} className="o-menu__link" href={href} onClick={() => { extra?.(); onClose(false); }}>{label}<Icon name="chev-r" /></Link>
  );
  return createPortal(
    <div className={`o-menu${shown ? ' is-open' : ''}`} id="menu" role="dialog" aria-modal="true" aria-label="Menu"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(true); else trapTab(e); }}>
      <div className="o-menu__top">
        <Logo onClick={() => onClose(false)} />
        <button ref={closeRef} type="button" className="a-roundx" aria-label="Close menu" onClick={() => onClose(true)}><Icon name="close" /></button>
      </div>
      <div className="o-menu__groups">
        <div className="o-menu__group">
          <p className="o-menu__head">Book</p>
          {row('/', 'Flights', () => onTab('flights'))}
          {row('/?mode=hotels', 'Hotels', () => onTab('hotels'))}
          {row('/#destinations', 'Destinations')}
        </div>
        <div className="o-menu__group">
          <p className="o-menu__head">Your trips</p>
          {row('/bookings', 'My bookings')}
          {signedIn ? (
            <>
              {row('/account', 'Profile')}
              <button type="button" className="o-menu__link" onClick={onSignOut}>Sign out<Icon name="signout" /></button>
            </>
          ) : (
            <div className="o-menu__cta">
              <Link prefetch={false} className="a-button -still" href="/login" onClick={() => onClose(false)}>Sign in<Icon name="arrow" /></Link>
              <Link prefetch={false} className="a-button -ghost -still" href="/register" onClick={() => onClose(false)}>Create an account</Link>
            </div>
          )}
        </div>
        <div className="o-menu__group">
          <p className="o-menu__head">Help</p>
          {row('/contact', 'Help and contact')}
          {row('/about', 'About us')}
          {row('/terms', 'Terms and conditions')}
          {row('/privacy', 'Privacy policy')}
        </div>
      </div>
    </div>,
    document.body
  );
}
