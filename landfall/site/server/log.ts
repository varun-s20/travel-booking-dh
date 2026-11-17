/* =====================================================================
   Landfall server: structured logging
   One JSON line per event (Vercel and most hosts index these). Values
   under sensitive keys are redacted before anything is written: card
   data never reaches the server at all, and passport numbers, dates of
   birth, tokens and secrets never reach the logs. Emails are masked.
   ===================================================================== */
import 'server-only';

type Level = 'debug' | 'info' | 'warn' | 'error';
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN = ORDER[(process.env.LOG_LEVEL as Level) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')] ?? 20;

const SECRET = /pass(word)?|secret|token|authorization|cookie|api[_-]?key|client_secret|unique_identifier|passport|born_on|dob|card|cvc|number|sensitive/i;
const EMAIL = /([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+)/g;

function scrub(v: unknown, depth = 0): unknown {
  if (depth > 6) return '[deep]';
  if (typeof v === 'string') return v.replace(EMAIL, '$1***$2');
  if (Array.isArray(v)) return v.slice(0, 50).map((x) => scrub(x, depth + 1));
  if (v instanceof Error) return { name: v.name, message: scrub(v.message, depth + 1), stack: process.env.NODE_ENV === 'production' ? undefined : v.stack };
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = SECRET.test(k) ? '[redacted]' : scrub(x, depth + 1);
    return out;
  }
  return v;
}

function write(level: Level, msg: string, ctx?: Record<string, unknown>) {
  if (ORDER[level] < MIN) return;
  const line = JSON.stringify({ t: new Date().toISOString(), level, msg, ...(ctx ? (scrub(ctx) as object) : {}) });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const log = {
  debug: (msg: string, ctx?: Record<string, unknown>) => write('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => write('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => write('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => write('error', msg, ctx)
};
