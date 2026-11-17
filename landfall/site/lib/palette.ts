/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): palette switch
   Two palette versions from one codebase: navy (the default) and
   harbour. The palette is fixed at build time by NEXT_PUBLIC_PALETTE
   (tools/run.mjs sets it) and written to <html data-palette> in
   app/layout.tsx. No colour values live here yet: Landfall's tokens
   (landfall/design/) decide how each palette is applied, and the
   browser's theme-color goes here once they exist.
   ===================================================================== */
export type Palette = 'navy' | 'harbour';

export const PALETTES: readonly Palette[] = ['navy', 'harbour'];

export const PALETTE: Palette = process.env.NEXT_PUBLIC_PALETTE === 'harbour' ? 'harbour' : 'navy';
