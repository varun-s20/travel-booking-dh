/* =====================================================================
   Landfall: database tasks (Supabase CLI with the URL from .env.local)
     node tools/db.mjs push     apply supabase/migrations to the project
     node tools/db.mjs status   list which migrations are applied
   Reads SUPABASE_DB_URL from .env.local the same way Next.js does, so the
   connection string (it holds the database password) never has to be
   typed into a shell or stored anywhere else.
   ===================================================================== */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const task = process.argv[2];
const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('SUPABASE_DB_URL is empty. Add the Session pooler connection string to .env.local (see docs/SETUP.md).');
  process.exit(1);
}
const args = task === 'push' ? ['db', 'push', '--db-url', url, '--include-all']
  : task === 'status' ? ['migration', 'list', '--db-url', url]
  : null;
if (!args) {
  console.error('Usage: node tools/db.mjs <push|status>');
  process.exit(1);
}
const bin = require.resolve('supabase/dist/supabase.js');
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
