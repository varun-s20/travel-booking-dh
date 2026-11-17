'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): Header
   Hipcamp's quiet app shell, revised for the client's "easy navigation"
   (revision 2026-11-11, items 7 to 10):
   - rail (1025 and up): brand tile, Flights, Hotels, Bookings, Help,
     More, in one list. Flights and Hotels set the home search;
   - top bar (1025 and up): solid, beside the rail, with Log in and Sign
     up at every scroll position; inner pages put the compact search in
     its middle (results.css);
   - phone bar (up to 1024): wordmark, Log in, More;
   - floating tab bar (below 900): Flights, Hotels, Bookings, Account.
     It steps aside while the visitor scrolls down or types in the
     search, and stays hidden on pages with a fixed booking bar;
   - More menu: a popover level with its button, a bottom sheet on the
     phone with Help and contact in it.
   Logged in (lib/store.ts), Log in and Sign up become one pill with the
   visitor's first name: Profile, Bookings, Log out (copy.md, chrome).
   The current link is marked from the path, never per page.
   ===================================================================== */
import { AppLink as Link } from '@/components/AppLink';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/Icon';
import { MQ_DESKTOP, MQ_SEARCH, PRODUCT_EVENT, addScrollJob, currentProduct, requestSearch, setAppInert, toast, trapTab, visibleFocusables, type SearchMode, setSearchMode } from '@/lib/client';
import { currentUser, logOut, useStore } from '@/lib/store';
import { ROUTES } from '@/lib/site';

/* revision 2026-11-11, item 9: Help left the tab bar, so it lives in the phone sheet as "Help and contact"
   (proposed wording, for the Copywriter). Desktop has Help in the rail, so the row hides there (chrome.css). */
const MORE_LINKS = [
  { href: ROUTES.about, label: 'About us' },
  { href: ROUTES.contact, label: 'Help and contact', phoneOnly: true },
  { href: ROUTES.terms, label: 'Terms and conditions' },
  { href: ROUTES.privacy, label: 'Privacy policy' }
];

/* the account menu behind the first-name pill (revision 2026-11-11, item 8): a disclosure with links, not an ARIA menu */
function AccountMenu({ id, name, label, onLogOut }: { id: string; name: string; label: string; onLogOut: () => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return (
    <div className="m-acct" ref={wrap} onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false); btn.current?.focus(); } }}>
      <button ref={btn} className="m-acct__btn" type="button" aria-label={label} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Icon name="user" /><span className="m-acct__name">{name}</span>
      </button>
      <ul className="m-acct__menu" id={id} hidden={!open}>
        <li><Link className="m-acct__item" href={ROUTES.account}>Profile</Link></li>
        <li><Link className="m-acct__item" href={ROUTES.bookings}>Bookings</Link></li>
        <li><button className="m-acct__item" type="button" onClick={() => { setOpen(false); onLogOut(); }}>Log out</button></li>
      </ul>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const store = useStore();
  const user = currentUser(store);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* revision 2026-11-11, item 8: the desktop top bar is solid and always there (the floating cluster sat over
     headings, and hiding it after 160px lost Log in); a hairline shows once scrolled.
     Item 10: below 900 the tab bar steps aside while the visitor scrolls down, and returns on any scroll up,
     within 120px of the top, at the page end, or when it takes focus. */
  const [barHidden, setBarHidden] = useState(false);
  const [fieldFocus, setFieldFocus] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const wide = window.matchMedia(MQ_SEARCH);
    return addScrollJob((y) => {
      setScrolled(y > 8);
      if (wide.matches) { setBarHidden(false); last = y; return; }
      const end = y + window.innerHeight >= document.documentElement.scrollHeight - 8;
      /* critic, 11 Nov (home 1): a scroll up, the top or the page end also clears the "field has focus" hide, since
         focus goes back to the cell after the sheet closes and scrolling never moves it */
      if (y < 120 || end || y < last - 6) { setBarHidden(false); setFieldFocus(false); }
      else if (y > last + 6) setBarHidden(true);
      if (Math.abs(y - last) > 6) last = y;
    });
  }, [pathname]);
  /* while a search field has focus (phones), the bar stays out of the way of the cells and their pickers */
  useEffect(() => {
    const wide = window.matchMedia(MQ_SEARCH);
    /* only while text is being typed (critic, 11 Nov: a focused cell button kept the bar away for the rest of the visit) */
    const inSearch = (n: EventTarget | null) => n instanceof Element && n.matches('input[type="text"], input[role="combobox"]') && !!n.closest('.m-search__panel');
    const onIn = (e: FocusEvent) => { if (!wide.matches && inSearch(e.target)) setFieldFocus(true); };
    const onOut = (e: FocusEvent) => { if (inSearch(e.target) && !inSearch(e.relatedTarget)) setFieldFocus(false); };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut); };
  }, []);
  useEffect(() => { setFieldFocus(false); }, [pathname]);

  /* the product in use: on the home page the hero search reports its tab; elsewhere the path, or the
     booking on the checkout, confirmation and booking pages, decides (item 7) */
  const [product, setProductState] = useState<SearchMode | null>(null);
  useEffect(() => {
    setProductState(currentProduct());
    const on = (e: Event) => setProductState((e as CustomEvent<{ mode: SearchMode | null }>).detail.mode);
    window.addEventListener(PRODUCT_EVENT, on);
    return () => window.removeEventListener(PRODUCT_EVENT, on);
  }, []);

  /* More menu as a dialog: page inert, focus inside, Escape and outside clicks close, focus returns.
     Desktop: the popover opens level with its button, kept inside the screen (item 9) */
  useEffect(() => {
    if (!moreOpen) return;
    setAppInert(true);
    const panel = panelRef.current;
    const btn = openerRef.current;
    if (panel && btn && window.matchMedia(MQ_DESKTOP).matches) {
      const top = Math.max(16, Math.min(btn.getBoundingClientRect().top, window.innerHeight - panel.offsetHeight - 16));
      panel.style.setProperty('--more-top', `${top}px`);
    }
    if (panel) visibleFocusables(panel)[0]?.focus();
    return () => {
      setAppInert(false);
      openerRef.current?.focus();
    };
  }, [moreOpen]);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  function toggleMore(e: React.MouseEvent<HTMLButtonElement>) {
    openerRef.current = e.currentTarget;
    setMoreOpen((o) => !o);
  }

  function doLogOut() {
    logOut();
    setMoreOpen(false);
    toast('You’ve logged out');
  }

  /* rail: Flights, Hotels, Bookings, Help (More follows in the same list). Tab bar: Flights, Hotels,
     Bookings, Account; logged out, Account opens Log in, logged in, the profile (copy.md, rail).
     aria-current is "page" for the page itself and "true" for the product the home search is set to. */
  const isOn = (m: string) => pathname === m || pathname.startsWith(`${m}/`);
  const productOn = (mode: SearchMode): 'page' | 'true' | undefined => {
    if (isOn(mode === 'flights' ? ROUTES.flights : ROUTES.hotels)) return 'page';
    return product === mode ? 'true' : undefined;
  };
  const accountMatch = [ROUTES.account, ROUTES.login, ROUTES.register, ROUTES.forgot, ROUTES.reset];
  type NavItem = { href: string; label: string; icon: string; current: 'page' | 'true' | undefined; mode?: SearchMode };
  const flights: NavItem = { href: `${ROUTES.home}?mode=flights`, label: 'Flights', icon: 'plane', current: productOn('flights'), mode: 'flights' };
  const hotels: NavItem = { href: `${ROUTES.home}?mode=hotels`, label: 'Hotels', icon: 'bed', current: productOn('hotels'), mode: 'hotels' };
  const bookings: NavItem = { href: ROUTES.bookings, label: 'Bookings', icon: 'ticket', current: isOn(ROUTES.bookings) ? 'page' : undefined };
  const help: NavItem = { href: ROUTES.contact, label: 'Help', icon: 'help', current: isOn(ROUTES.contact) ? 'page' : undefined };
  const account: NavItem = { href: user ? ROUTES.account : ROUTES.login, label: 'Account', icon: 'user', current: accountMatch.some(isOn) ? 'page' : undefined };
  const railNav = [flights, hotels, bookings, help];
  const tabNav = [flights, hotels, bookings, account];
  /* on the home page Flights and Hotels switch the hero search in place, bring it into view and focus its
     first field without opening a picker (desktop); from other pages they go home with the product set */
  function onProduct(e: React.MouseEvent<HTMLAnchorElement>, n: NavItem) {
    if (!n.mode || pathname !== ROUTES.home || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    /* round 3 (spec A1): the home page swaps its content and keeps ?mode= in the URL (components/home/r3/HomeModes.tsx).
       Critic, round 3: from below the hero the switch happens where the visitor is reading, with no jump to the top
       (the spec's scroll to the search lost their place); near the top it still brings the search into view */
    const hero = document.querySelector('.o-homeHero');
    if (hero && hero.getBoundingClientRect().bottom < 0) { setSearchMode(n.mode); return; }
    requestSearch(n.mode, undefined, true);
  }
  const firstName = user ? user.firstName : '';
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <header className={`o-header${scrolled ? ' is-scrolled' : ''}${(barHidden || fieldFocus) && !moreOpen ? ' is-barHidden' : ''}`}>
      {/* ---- rail (desktop) ---- */}
      <nav className="o-header__rail" aria-label="Main">
        <Link className="o-header__brand" href={ROUTES.home} aria-label="Overwing, home">
          <span className="o-header__tile"><span className="a-glyph" aria-hidden="true" /></span>
          <span aria-hidden="true">overwing</span>
        </Link>
        <ul className="o-header__railList">
          {railNav.map((n) => (
            <li key={n.label}>
              <Link className="m-railItem" href={n.href} aria-current={n.current} onClick={(e) => onProduct(e, n)}>
                <span className="m-railItem__icon"><Icon name={n.icon} size="l" /></span>
                {n.label}
              </Link>
            </li>
          ))}
          <li>
            <button className="m-railItem -more" type="button" aria-expanded={moreOpen} aria-controls="more-menu" onClick={toggleMore}>
              <span className="m-railItem__icon"><Icon name="menu" size="l" /></span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* ---- phone bar; on desktop only its account pills show, top right ---- */}
      <div className="o-header__bar">
        <Link className="o-header__wordmark" href={ROUTES.home} aria-label="Overwing, home">
          <span className="a-wordmark" aria-hidden="true"><span className="a-glyph" />verwing</span>
        </Link>
        <div className="o-header__actions">
          {user ? (
            <AccountMenu id="account-menu" name={firstName} label={`Account menu for ${fullName}`} onLogOut={doLogOut} />
          ) : (
            <>
              <Link className="a-button -soft -small -steady" href={ROUTES.login}><span className="a-button__label">Log in</span></Link>
              <Link className="a-button -small -steady o-header__signup" href={ROUTES.register}><span className="a-button__label">Sign up</span></Link>
            </>
          )}
          <button className="a-round o-header__menuBtn" type="button" aria-label="More" aria-expanded={moreOpen} aria-controls="more-menu" onClick={toggleMore}>
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {/* ---- floating tab bar (phone) ---- */}
      <nav className="o-header__tabs" aria-label="App" onFocus={() => { setBarHidden(false); setFieldFocus(false); }}>
        {tabNav.map((n) => (
          <Link key={n.label} className="m-tab" href={n.href} aria-current={n.current} onClick={(e) => onProduct(e, n)}>
            <Icon name={n.icon} size="l" />
            {n.label}
          </Link>
        ))}
      </nav>

      {/* ---- More menu (dialog, rendered into <body> so the page behind can go inert) ---- */}
      {moreOpen && createPortal(
        <div className="m-more" id="more-menu" role="dialog" aria-modal="true" aria-labelledby="more-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); setMoreOpen(false); }
            trapTab(e);
          }}>
          <div className="m-more__scrim" onClick={() => setMoreOpen(false)} />
          <div className="m-more__panel" ref={panelRef}>
            <div className="m-more__head">
              <h2 className="m-more__title" id="more-title">More</h2>
              <button className="a-round" type="button" aria-label="Close" onClick={() => setMoreOpen(false)}><Icon name="close" /></button>
            </div>
            {user ? (
              <ul className="m-more__list m-more__account -rows">
                <li><Link className="m-more__link" href={ROUTES.bookings}>Bookings<Icon name="chev-right" size="s" /></Link></li>
                <li><Link className="m-more__link" href={ROUTES.account}>Profile<Icon name="chev-right" size="s" /></Link></li>
                <li><button className="m-more__link" type="button" onClick={doLogOut}>Log out<Icon name="chev-right" size="s" /></button></li>
              </ul>
            ) : (
              <div className="m-more__account">
                <Link className="a-button -soft -block" href={ROUTES.login}><span className="a-button__label">Log in</span></Link>
                <Link className="a-button -block" href={ROUTES.register}><span className="a-button__label">Sign up</span></Link>
              </div>
            )}
            {/* 900 to 1024 has neither the rail nor the tab bar, so the menu leads with them (critic, 11 Nov; chrome.css shows this list there only) */}
            <ul className="m-more__list m-more__products">
              {tabNav.map((n) => (
                <li key={n.label}>
                  <Link className="m-more__link" href={n.href} aria-current={n.current} onClick={(e) => { setMoreOpen(false); onProduct(e, n); }}><span className="m-more__linkText"><Icon name={n.icon} size="s" />{n.label}</span><Icon name="chev-right" size="s" /></Link>
                </li>
              ))}
            </ul>
            <ul className="m-more__list">
              {MORE_LINKS.map((l) => (
                <li key={l.href} className={l.phoneOnly ? 'm-more__phoneOnly' : undefined}>
                  <Link className="m-more__link" href={l.href}>{l.label}<Icon name="chev-right" size="s" /></Link>
                </li>
              ))}
            </ul>
            {/* polish round, 11 Nov (critic): from 900 to 1024 Log out closes the menu after a divider instead of leading it.
                Its own list (shown there only, chrome.css), so the keyboard order matches what is shown */}
            {user && (
              <ul className="m-more__list m-more__logout">
                <li><button className="m-more__link" type="button" onClick={doLogOut}>Log out<Icon name="chev-right" size="s" /></button></li>
              </ul>
            )}
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
