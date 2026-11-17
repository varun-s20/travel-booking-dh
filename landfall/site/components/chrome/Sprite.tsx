/* =====================================================================
   Landfall icon language: a 20px grid with a 2px safe edge, one fine 1.25 line (1.25px at 20px, 1px at 16px), square caps, mitre joins, no fills.
   Built only from straight runs, true circles and 45 or 60 degree turns; corners stay square or are cut at 45 degrees, never rounded.
   ---------------------------------------------------------------------
   travel-booking, Landfall (working name, a placeholder): icon sprite.
   One inline sprite for the whole app, rendered once by app/layout.tsx
   before the app wrapper, so portalled dialogs can use it too. Redrawn
   from scratch on 2026-11-11 (Chief Officer note 3), so it shares nothing
   with the other design. The .a-svg rule in global.css sets the line
   (stroke 1.25, square caps, mitre joins). Use components/ui/Icon.tsx:
   <Icon name="arrow" />. Add symbols at the end of their block and list
   them in build/progress.md.
   ===================================================================== */
export const ICONS = [
  'search', 'swap', 'plane', 'land', 'bed', 'pin', 'calendar', 'user', 'users', 'menu', 'close', 'arrow', 'arrow-l',
  'chev-l', 'chev-r', 'chev-d', 'chev-u', 'pause', 'play', 'minus', 'plus', 'check', 'tick', 'alert', 'info', 'error',
  'filter', 'sort', 'copy', 'download', 'eye', 'eye-off', 'lock', 'mail', 'phone', 'clock', 'bag', 'seat', 'refund',
  'change', 'wifi', 'coffee', 'gym', 'pool', 'spa', 'glass', 'parking', 'snow', 'paw', 'access', 'map', 'star', 'card',
  'doc', 'ticket', 'signout', 'edit', 'trash', 'grid', 'expand', 'globe', 'door', 'baby',
  /* round 3, Developer B: time of day tiles and the checked bag */
  'moon', 'sunrise', 'sun', 'sunset', 'suitcase'
] as const;
export type IconName = (typeof ICONS)[number];

export default function Sprite() {
  return (
    <svg className="a-sprite" width="0" height="0" aria-hidden="true" focusable="false">
      {/* ---- search and booking ---- */}
      <symbol id="i-search" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5" /><path d="M12.5 12.5l4.5 4.5" /></symbol>
      <symbol id="i-swap" viewBox="0 0 20 20"><path d="M3 6.5h11.5M12.5 3.5l3 3-3 3M17 13.5H5.5M7.5 10.5l-3 3 3 3" /></symbol>
      <symbol id="i-plane" viewBox="0 0 20 20"><path d="M17 10l-3.5-1.5L9 4H7.5l2 4.5H5.5L4 6.5H2.5l1 3.5-1 3.5H4l1.5-2h4l-2 4.5H9l4.5-4.5z" /></symbol>
      <symbol id="i-land" viewBox="0 0 20 20"><path d="M2 16.5h16M4 4.5l8 8M7 13.5h6v-6" /></symbol>
      <symbol id="i-bed" viewBox="0 0 20 20"><path d="M2.5 4.5v11M2.5 13h15M17.5 15.5V10h-8v3" /><rect x="4.5" y="9" width="3" height="2.5" /></symbol>
      <symbol id="i-pin" viewBox="0 0 20 20"><path d="M10 17.5l-4.59-6.97A5.5 5.5 0 1 1 14.59 10.53z" /><circle cx="10" cy="7.5" r="2" /></symbol>
      <symbol id="i-calendar" viewBox="0 0 20 20"><path d="M2.5 4h15v13.5h-15zM2.5 8h15M6.5 2v3M13.5 2v3" /><rect x="11.5" y="11.5" width="3" height="3" /></symbol>
      <symbol id="i-user" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.5" /><path d="M3.5 17.5a6.5 6.5 0 0 1 13 0" /></symbol>
      <symbol id="i-users" viewBox="0 0 20 20"><circle cx="7.5" cy="7" r="3" /><path d="M2 17.5a5.5 5.5 0 0 1 11 0" /><circle cx="13.75" cy="6.5" r="2.5" /><path d="M13.5 11.5a5 5 0 0 1 5 5" /></symbol>
      <symbol id="i-baby" viewBox="0 0 20 20"><path d="M3 8h12a6 6 0 0 1-12 0zM9 8V2a6 6 0 0 0-6 6M15 8l2.5-3" /><circle cx="5.5" cy="16.5" r="1.5" /><circle cx="12.5" cy="16.5" r="1.5" /></symbol>
      <symbol id="i-seat" viewBox="0 0 20 20"><path d="M4.5 2.5l2.5 10h8.5M9.5 9.5h5M11 12.5v5M7.5 17.5h7" /></symbol>
      <symbol id="i-bag" viewBox="0 0 20 20"><path d="M4 6h12v11H4zM7.5 6V3h5v3M7.5 6v11M12.5 6v11" /></symbol>
      <symbol id="i-ticket" viewBox="0 0 20 20"><path d="M2.5 5.5h15v3a1.5 1.5 0 0 0 0 3v3h-15v-3a1.5 1.5 0 0 0 0-3zM13 5.5v9" /></symbol>
      <symbol id="i-card" viewBox="0 0 20 20"><path d="M2 4.5h16v11H2zM2 8h16M5 12.5h3.5" /></symbol>
      <symbol id="i-refund" viewBox="0 0 20 20"><path d="M5 6.5h7.5a4.5 4.5 0 0 1 0 9H8M7 3.5l-3 3 3 3" /></symbol>
      <symbol id="i-change" viewBox="0 0 20 20"><path d="M6.5 16.5v-12M3.5 6.5l3-3 3 3M13.5 3.5v12M10.5 13.5l3 3 3-3" /></symbol>
      <symbol id="i-clock" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" /><path d="M10 5.5V10h3.5" /></symbol>
      <symbol id="i-doc" viewBox="0 0 20 20"><path d="M4.5 2.5H12L15.5 6v11.5h-11zM12 2.5V6h3.5M7.5 10h5M7.5 13h5" /></symbol>
      <symbol id="i-door" viewBox="0 0 20 20"><path d="M3.5 17.5h13M6 17.5v-15h8v15M11.5 9.5V11" /></symbol>

      {/* ---- chrome and controls ---- */}
      <symbol id="i-menu" viewBox="0 0 20 20"><path d="M2.5 7.5h15M2.5 12.5h15" /></symbol>
      <symbol id="i-close" viewBox="0 0 20 20"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 20 20"><path d="M2.5 10h13M13 6.5l3.5 3.5-3.5 3.5" /></symbol>
      <symbol id="i-arrow-l" viewBox="0 0 20 20"><path d="M17.5 10h-13M7 6.5L3.5 10 7 13.5" /></symbol>
      <symbol id="i-chev-l" viewBox="0 0 20 20"><path d="M12.5 4.5L7 10l5.5 5.5" /></symbol>
      <symbol id="i-chev-r" viewBox="0 0 20 20"><path d="M7.5 4.5L13 10l-5.5 5.5" /></symbol>
      <symbol id="i-chev-d" viewBox="0 0 20 20"><path d="M4.5 7.5L10 13l5.5-5.5" /></symbol>
      <symbol id="i-chev-u" viewBox="0 0 20 20"><path d="M4.5 12.5L10 7l5.5 5.5" /></symbol>
      <symbol id="i-pause" viewBox="0 0 20 20"><path d="M7 4.5v11M13 4.5v11" /></symbol>
      <symbol id="i-play" viewBox="0 0 20 20"><path d="M6 4l9 6-9 6z" /></symbol>
      <symbol id="i-minus" viewBox="0 0 20 20"><path d="M4.5 10h11" /></symbol>
      <symbol id="i-plus" viewBox="0 0 20 20"><path d="M4.5 10h11M10 4.5v11" /></symbol>
      <symbol id="i-check" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 10.25l2.5 2.5 4.5-5" /></symbol>
      <symbol id="i-tick" viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-8.5" /></symbol>
      <symbol id="i-alert" viewBox="0 0 20 20"><path d="M10 3l7.5 13.5h-15zM10 8v4M10 14v.5" /></symbol>
      <symbol id="i-info" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" /><path d="M10 9v5M10 6v.5" /></symbol>
      <symbol id="i-error" viewBox="0 0 20 20"><path d="M7 2.5h6L17.5 7v6L13 17.5H7L2.5 13V7zM10 6v5M10 13.5v.5" /></symbol>
      <symbol id="i-filter" viewBox="0 0 20 20"><path d="M2.5 6h3M8.5 6h9M2.5 14h9M14.5 14h3" /><rect x="5.5" y="4.5" width="3" height="3" /><rect x="11.5" y="12.5" width="3" height="3" /></symbol>
      <symbol id="i-sort" viewBox="0 0 20 20"><path d="M3 5.5h14M3 10h9.5M3 14.5h5" /></symbol>
      <symbol id="i-copy" viewBox="0 0 20 20"><path d="M7 7h10.5v10.5H7zM13 7V2.5H2.5V13H7" /></symbol>
      <symbol id="i-download" viewBox="0 0 20 20"><path d="M10 2.5V12M6 9l4 4 4-4M3 13.5v4h14v-4" /></symbol>
      <symbol id="i-eye" viewBox="0 0 20 20"><path d="M2 10a9 9 0 0 1 16 0 9 9 0 0 1-16 0z" /><circle cx="10" cy="10" r="2.5" /></symbol>
      <symbol id="i-eye-off" viewBox="0 0 20 20"><path d="M2 10a9 9 0 0 1 16 0 9 9 0 0 1-16 0zM3.5 3.5l13 13" /><circle cx="10" cy="10" r="2.5" /></symbol>
      <symbol id="i-lock" viewBox="0 0 20 20"><path d="M4 9h12v9H4zM6.5 9V6a3.5 3.5 0 0 1 7 0v3M10 12.5v2" /></symbol>
      <symbol id="i-mail" viewBox="0 0 20 20"><path d="M2.5 4.5h15v11h-15zM2.5 4.5L10 11l7.5-6.5" /></symbol>
      <symbol id="i-phone" viewBox="0 0 20 20"><path d="M5.5 2.5h9v15h-9zM8.5 15h3" /></symbol>
      <symbol id="i-signout" viewBox="0 0 20 20"><path d="M8 2.5H3.5v15H8M7.5 10H16M13.5 6.5L17 10l-3.5 3.5" /></symbol>
      <symbol id="i-edit" viewBox="0 0 20 20"><path d="M3 17v-3.5L13.5 3 17 6.5 6.5 17zM11 5.5L14.5 9" /></symbol>
      <symbol id="i-trash" viewBox="0 0 20 20"><path d="M3 5.5h14M7.5 5.5V3h5v2.5M4.5 5.5l1 12h9l1-12M8.5 8.5v6M11.5 8.5v6" /></symbol>
      <symbol id="i-grid" viewBox="0 0 20 20"><path d="M3 3h5.5v5.5H3zM11.5 3H17v5.5h-5.5zM3 11.5h5.5V17H3zM11.5 11.5H17V17h-5.5z" /></symbol>
      <symbol id="i-expand" viewBox="0 0 20 20"><path d="M3 7.5V3h4.5M12.5 3H17v4.5M17 12.5V17h-4.5M7.5 17H3v-4.5" /></symbol>
      <symbol id="i-globe" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" /><ellipse cx="10" cy="10" rx="3.5" ry="7.5" /><path d="M2.5 10h15" /></symbol>
      <symbol id="i-map" viewBox="0 0 20 20"><path d="M2.5 4.5l5-2 5 2 5-2v13l-5 2-5-2-5 2zM7.5 2.5v13M12.5 4.5v13" /></symbol>
      <symbol id="i-star" viewBox="0 0 20 20"><path d="M10 3.1l1.82 4.99 5.31.19-4.18 3.28 1.46 5.11L10 13.7l-4.41 2.97 1.46-5.11-4.18-3.28 5.31-.19z" /></symbol>

      {/* ---- amenities and policies ---- */}
      <symbol id="i-wifi" viewBox="0 0 20 20"><path d="M7.53 14.03a3.5 3.5 0 0 1 4.94 0M5.05 11.55a7 7 0 0 1 9.9 0M2.58 9.08a10.5 10.5 0 0 1 14.84 0M9.75 16.75h.5" /></symbol>
      <symbol id="i-coffee" viewBox="0 0 20 20"><path d="M3.5 7.5h10v7l-3 3h-4l-3-3zM13.5 9H16v3.5h-2.5M6.5 2.5V5M10.5 2.5V5" /></symbol>
      <symbol id="i-gym" viewBox="0 0 20 20"><path d="M6 10h8M1.5 10h2M16.5 10h2M3.5 5.5H6v9H3.5zM14 5.5h2.5v9H14z" /></symbol>
      <symbol id="i-pool" viewBox="0 0 20 20"><path d="M7.5 12V4.5H6M13.5 12V4.5H12M7.5 7h6M7.5 10h6M2 16l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5" /></symbol>
      <symbol id="i-spa" viewBox="0 0 20 20"><path d="M10 3.5a8 8 0 0 1 0 11.5 8 8 0 0 1 0-11.5zM3 9.5a7 7 0 0 0 14 0" /></symbol>
      <symbol id="i-glass" viewBox="0 0 20 20"><path d="M3.5 3h13L10 10.5zM10 10.5v7M6 17.5h8" /></symbol>
      <symbol id="i-parking" viewBox="0 0 20 20"><path d="M2.5 2.5h15v15h-15zM7.5 14.5v-9H11a2.5 2.5 0 0 1 0 5H7.5" /></symbol>
      <symbol id="i-snow" viewBox="0 0 20 20"><path d="M10 2.5v15M16.5 6.25l-13 7.5M16.5 13.75l-13-7.5M8.25 3.25L10 5l1.75-1.75M8.25 16.75L10 15l1.75 1.75M16.72 8.14l-2.39-.64.64-2.39M14.97 14.89l-.64-2.39 2.39-.64M5.02 14.89l.65-2.39-2.39-.64M3.28 8.14l2.39-.64-.65-2.39" /></symbol>
      <symbol id="i-paw" viewBox="0 0 20 20"><circle cx="4.75" cy="9.25" r="1.5" /><circle cx="7.75" cy="5.25" r="1.5" /><circle cx="12.25" cy="5.25" r="1.5" /><circle cx="15.25" cy="9.25" r="1.5" /><ellipse cx="10" cy="13.75" rx="4" ry="3.25" /></symbol>
      <symbol id="i-access" viewBox="0 0 20 20"><circle cx="10" cy="3.5" r="1.5" /><path d="M10 6.5v5h4.5l1.5 4M10 8.5h4M6.75 9.6A4.5 4.5 0 1 0 13.23 15.04" /></symbol>
      {/* ---- round 3, Developer B: time of day (flight filters) and the checked bag ---- */}
      <symbol id="i-moon" viewBox="0 0 20 20"><path d="M15.5 13.25A6.25 6.25 0 0 1 7.75 3.5a6.75 6.75 0 1 0 7.75 9.75z" /></symbol>
      <symbol id="i-sunrise" viewBox="0 0 20 20"><path d="M2.5 15.5h15M6 15.5a4 4 0 0 1 8 0M10 9V3.5M7.5 6 10 3.5 12.5 6M3.5 10.5l1.75 1.25M16.5 10.5l-1.75 1.25" /></symbol>
      <symbol id="i-sun" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5" /><path d="M10 2.5v2.5M10 15v2.5M2.5 10H5M15 10h2.5M4.7 4.7l1.75 1.75M13.55 13.55l1.75 1.75M4.7 15.3l1.75-1.75M13.55 6.45l1.75-1.75" /></symbol>
      <symbol id="i-sunset" viewBox="0 0 20 20"><path d="M2.5 15.5h15M6 15.5a4 4 0 0 1 8 0M10 3.5V9M7.5 6.5 10 9l2.5-2.5M3.5 10.5l1.75 1.25M16.5 10.5l-1.75 1.25" /></symbol>
      <symbol id="i-suitcase" viewBox="0 0 20 20"><path d="M7.5 5.5v-3h5v3M4.5 5.5h11v11h-11zM8 8.5v5M12 8.5v5M6.5 16.5v1.5M13.5 16.5v1.5" /></symbol>
    </svg>
  );
}
