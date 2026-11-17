/* =====================================================================
   travel-booking (working name Overwing, a placeholder): palette switch
   Two palette versions from one codebase. Revision 2026-11-11 (client:
   "deep navy, white and teal"): Night navy is the default and Cabin dawn
   the alternate; the gold palette moved to Landfall (redesign note). The palette
   is fixed at build time by NEXT_PUBLIC_PALETTE (tools/run.mjs sets it);
   app/layout.tsx writes it to <html data-palette>, and tokens.css swaps
   the colour roles under :root[data-palette="cabin"].
   Literal colours here only where the platform needs one: the browser's
   theme-color meta (same values as --c-theme in tokens.css).
   ===================================================================== */
export type Palette = 'navy' | 'cabin';

export const PALETTE: Palette = process.env.NEXT_PUBLIC_PALETTE === 'cabin' ? 'cabin' : 'navy';

export const THEME_COLOR: Record<Palette, string> = {
  navy: '#FFFFFF',
  cabin: '#F7FAFF'
};
