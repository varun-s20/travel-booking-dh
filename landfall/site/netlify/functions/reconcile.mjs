/* Netlify scheduled function: runs the reconcile job every 5 minutes (UTC).
   It only calls the app's own GET /api/cron/reconcile with the CRON_SECRET; the work itself runs
   in that route (server/bookings/reconcile.ts), which fits Netlify's 60 s request limit.
   A scheduled function may run for 30 s, so it waits up to 25 s for the report and then returns;
   the route carries on to its own end either way.
   Netlify only runs it on the published deploy (not deploy previews); "Run now" in
   Netlify > Logs > Functions triggers it by hand.
   Needs CRON_SECRET (and APP_URL, else Netlify's own URL) in the site's environment variables. */
export default async () => {
  const secret = process.env.CRON_SECRET;
  const base = process.env.APP_URL || process.env.URL;
  if (!secret || !base) {
    console.error(JSON.stringify({ level: 'error', msg: 'reconcile.not_configured', cronSecret: !!secret, url: !!base }));
    return;
  }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 25_000);
  try {
    const res = await fetch(new URL('/api/cron/reconcile', base), { headers: { authorization: `Bearer ${secret}` }, signal: ctl.signal });
    const body = await res.text();
    console.log(JSON.stringify({ level: res.ok ? 'info' : 'error', msg: 'reconcile.run', status: res.status, body: body.slice(0, 500) }));
  } catch (e) {
    const waited = e instanceof Error && e.name === 'AbortError';
    console.log(JSON.stringify({ level: waited ? 'info' : 'error', msg: waited ? 'reconcile.still_running' : 'reconcile.failed', error: String(e) }));
  } finally {
    clearTimeout(timer);
  }
};

export const config = { schedule: '*/5 * * * *' };
