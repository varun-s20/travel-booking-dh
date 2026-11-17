/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): palette runner
   Runs next dev, build or start for one palette version without extra
   packages (cross-env is not installed), so the npm scripts work on
   Windows and elsewhere:
     node tools/run.mjs dev navy        -> port 3003
     node tools/run.mjs start harbour   -> port 3004
     node tools/run.mjs build navy
   Each palette gets its own build folder (.next-navy, .next-harbour),
   so both versions can build and run side by side; Next.js 16 locks a
   build folder to one dev or build process at a time. Ports 3001 and
   3002 are Overwing's, 4001 and 4002 the Studio Lead's previews.
   ===================================================================== */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const PORTS = { navy: '3003', harbour: '3004' };
const [command, palette] = process.argv.slice(2);

if (!['dev', 'build', 'start'].includes(command) || !PORTS[palette]) {
  console.error('Usage: node tools/run.mjs <dev|build|start> <navy|harbour>');
  process.exit(1);
}

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
const args = [nextBin, command];
if (command !== 'build') args.push('--port', PORTS[palette]);

/* dev runs inside .next/ (as in Overwing's app, where a dev folder at .next-<palette> made Turbopack watch its
   own cache writes and reload the page in a loop). Builds and starts keep .next-<palette>, so the two palettes
   still build side by side. */
const distDir = command === 'dev' ? `.next/dev-${palette}` : `.next-${palette}`;
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_PALETTE: palette, NEXT_DIST_DIR: distDir }
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
