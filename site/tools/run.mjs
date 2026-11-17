/* =====================================================================
   travel-booking (working name Overwing, a placeholder): palette runner
   Runs next dev, build or start for one palette version without extra
   packages (cross-env is not installed), so the npm scripts work on
   Windows and elsewhere:
     node tools/run.mjs dev navy        -> port 3001 (the default)
     node tools/run.mjs build cabin      (cabin serves on 3002)
   Each palette gets its own build folder (.next-navy, .next-cabin),
   so both versions can build and run side by side; Next.js 16 locks a
   build folder to one dev or build process at a time.
   ===================================================================== */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

/* revision 2026-11-11: palettes navy (default) and cabin; the gold palette moved to Landfall (redesign note) */
const PORTS = { navy: '3001', cabin: '3002' };
const [command, palette = 'navy'] = process.argv.slice(2);

if (!['dev', 'build', 'start'].includes(command) || !PORTS[palette]) {
  console.error('Usage: node tools/run.mjs <dev|build|start> <navy|cabin>');
  process.exit(1);
}

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
const args = [nextBin, command];
if (command !== 'build') args.push('--port', PORTS[palette]);

/* dev runs build inside .next/ (Developer, session 2): with the build folder at .next-<palette>, Turbopack
   watched its own cache writes there and rebuilt every few seconds, reloading the page in a loop. Builds
   and starts keep .next-<palette>, so the two palettes still build side by side. */
const distDir = command === 'dev' ? `.next/dev-${palette}` : `.next-${palette}`;
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_PALETTE: palette, NEXT_DIST_DIR: distDir }
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
