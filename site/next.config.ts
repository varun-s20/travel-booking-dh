/* travel-booking (working name Overwing, a placeholder): Next.js config.
   The palette version is chosen at build time by NEXT_PUBLIC_PALETTE
   (tools/run.mjs sets it); each palette builds into its own folder so
   Night navy and Cabin dawn never overwrite each other. */
import type { NextConfig } from 'next';

const palette = process.env.NEXT_PUBLIC_PALETTE === 'cabin' ? 'cabin' : 'navy';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || `.next-${palette}`,
  reactStrictMode: true,
  poweredByHeader: false,
  /* keeps the dev badge out of review screenshots (it docks bottom left, under the phone tab bar's row) */
  devIndicators: false,
  /* next dev would otherwise write an AGENTS.md into the site folder; nothing about tooling ships with the client's code */
  agentRules: false
};

export default nextConfig;
