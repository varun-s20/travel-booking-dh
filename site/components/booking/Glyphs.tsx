/* =====================================================================
   Round 3 glyphs for the inner pages (spec 0.3, new sprite icons), drawn
   on the sprite's 24px grid with the same stroke, caps and joins as
   i-bag and i-wifi, rendered inline with the a-icon class so they take
   the sprite's stroke styles. Decorative: the control carries the name.
   Kept here (Developer B's files) so the shared sprite is not edited by
   two Developers at once.
   ===================================================================== */
const PATHS: Record<string, string> = {
  'bag-cabin': '<rect x="6.5" y="7" width="11" height="13" rx="2"/><path d="M10 7V4.5h4V7M9.5 20v1M14.5 20v1M9.5 11v5"/>',
  'bag-checked': '<rect x="5" y="7.5" width="14" height="12" rx="2"/><path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M9 7.5v12M15 7.5v12"/>',
  'bag-personal': '<path d="M6 10h12l-1 9.5H7z"/><path d="M9 10V8a3 3 0 0 1 6 0v2"/>',
  seat: '<path d="M7 4.5v9a2 2 0 0 0 2 2h6.5"/><path d="M9.5 15.5l-1 4M15.5 15.5V20M7 11h6.5a2 2 0 0 1 2 2v2.5"/>',
  change: '<path d="M5 9h12.5l-3-3M19 15H6.5l3 3"/>',
  refund: '<path d="M5.5 12a6.5 6.5 0 1 0 2-4.7"/><path d="M5 4.5v3.5h3.5M12 8.5v7M14 10.2c-.4-.8-1.2-1.2-2-1.2-1.2 0-2 .6-2 1.5 0 2 4 1.1 4 3.1 0 .9-.9 1.5-2 1.5-.9 0-1.7-.4-2.1-1.2"/>',
  meal: '<path d="M7 4v7a2 2 0 0 0 2 2v7M11 4v7a2 2 0 0 1-2 2M17 20V4c-1.7 1-2.5 3-2.5 6v3H17"/>',
  priority: '<path d="M12 4l2.3 4.8 5.2.7-3.8 3.6.9 5.2L12 15.8l-4.6 2.5.9-5.2-3.8-3.6 5.2-.7z"/>',
  power: '<path d="M13 3.5L6.5 13H12l-1 7.5L17.5 11H12z"/>',
  key: '<circle cx="8.5" cy="12" r="3.5"/><path d="M12 12h8M17 12v3M20 12v2.5"/>',
  door: '<path d="M6 20.5V4.5h9v16M4 20.5h16M15 6.5h3v14"/><circle cx="12.5" cy="12.5" r=".6"/>',
  shield: '<path d="M12 3.5l7 2.5v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  pool: '<path d="M8 15V6a2 2 0 0 1 4 0M16 15V6a2 2 0 0 0-2-2M8 9h8M8 12h8M3.5 18c1.4 0 1.4-1 2.8-1s1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1"/>',
  parking: '<rect x="4.5" y="4.5" width="15" height="15" rx="3"/><path d="M10 16V8h2.7a2.3 2.3 0 0 1 0 4.6H10"/>',
  spa: '<path d="M12 19.5c-4 0-7-2.5-7-6.5 2.5 0 5 .8 7 3 2-2.2 4.5-3 7-3 0 4-3 6.5-7 6.5z"/><path d="M12 16c-1.5-2-1.5-6 0-9.5 1.5 3.5 1.5 7.5 0 9.5z"/>',
  pet: '<circle cx="7" cy="10" r="1.6"/><circle cx="10.5" cy="6.8" r="1.6"/><circle cx="14.5" cy="6.8" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M12.5 11.5c-2.5 0-5 3.5-5 5.5 0 1.5 1 2.5 2.5 2.5 1 0 1.6-.5 2.5-.5s1.5.5 2.5.5c1.5 0 2.5-1 2.5-2.5 0-2-2.5-5.5-5-5.5z"/>',
  shuttle: '<rect x="4" y="5.5" width="16" height="11.5" rx="2.5"/><path d="M4 11.5h16M7 17v2M17 17v2"/><circle cx="8" cy="14.3" r=".6"/><circle cx="16" cy="14.3" r=".6"/>',
  kitchen: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M5 9h14M8 6.2h2M8 12v3"/>',
  'plane-up': '<path d="M3.5 19.5h17M5 14.5l2.5-1 2-5 1.5-.6.3 4.4 5.6-2.3c1.2-.5 2.5 0 2.9.9.2.6-.1 1.2-.7 1.5L7.7 17z"/>',
  'plane-down': '<path d="M3.5 19.5h17M7 7.5l1.8.3 2 3.8 5.5 1.6c1.2.3 2 1.4 1.8 2.4-.2.6-.8 1-1.5.9L5.5 13.6V8.2z"/>',
  'calendar-plus': '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M12 12.5v5M9.5 15h5"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
  history: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4.5V8h3.5M12 8v4.5l3 1.8"/>',
  'trend-down': '<path d="M4 7l5.5 5.5 3.5-3.5 7 7M14.5 16H20v-5.5"/>',
  route: '<circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><path d="M7.5 15.5C9 10 13 8 16 7.3" stroke-dasharray="2 2.2"/>',
  building: '<path d="M5 20.5V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M15 9.5h3a1 1 0 0 1 1 1v10M3.5 20.5h17M8 8h3M8 11.5h3M8 15h3"/>',
  ruler: '<rect x="3.5" y="8" width="17" height="8" rx="1.5"/><path d="M7 8v3M10.5 8v4M14 8v3M17.5 8v4"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  quiet: '<path d="M5 9.5h3l4-3.5v12l-4-3.5H5z"/><path d="M16 9.5l4 5M20 9.5l-4 5"/>',
  party: '<path d="M4.5 19.5l4-11 7 7z"/><path d="M14 4.5v2M18 6l-1.5 1.5M19.5 10h-2M12.5 8.5c.5-1.5 1.5-2 3-2"/>',
  child: '<circle cx="12" cy="6" r="2.2"/><path d="M8 11h8M12 9v6M12 15l-2.5 5M12 15l2.5 5"/>',
  smoke: '<path d="M3.5 15h13v3h-13zM18.5 15v3M20.5 15v3M18.5 12.5c0-1.5 2-1.5 2-3s-1-2-1-2"/>',
  globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.2 2.3 3.2 5 3.2 8s-1 5.7-3.2 8c-2.2-2.3-3.2-5-3.2-8s1-5.7 3.2-8z"/>',
  passport: '<rect x="6" y="3.5" width="12" height="17" rx="1.5"/><circle cx="12" cy="10.5" r="2.8"/><path d="M9.5 16h5"/>'
};

export const GLYPHS = Object.keys(PATHS);

export function Glyph({ name, size, className = '' }: { name: string; size?: 's' | 'l'; className?: string }) {
  const cls = ['a-icon', size ? `-${size}` : '', className].filter(Boolean).join(' ');
  return <svg className={cls} viewBox="0 0 24 24" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: PATHS[name] ?? '' }} />;
}
