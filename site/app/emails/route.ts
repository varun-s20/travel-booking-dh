/* Email previews for review (not linked from the site): a list of the templates in lib/emails.ts. */
import { EMAILS } from '@/lib/emails';

export const dynamic = 'force-dynamic';

export function GET() {
  const items = Object.entries(EMAILS).map(([id, e]) => `<li style="margin:0 0 12px;"><a href="/emails/${id}" style="color:#0F1D27;">${e.subject.replace(/&/g, '&amp;')}</a></li>`).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Email previews | Overwing</title></head><body style="margin:0;padding:48px 24px;font:16px/1.5 Helvetica, Arial, sans-serif;background:#FFFFFF;color:#0F1D27;"><h1 style="font-size:24px;margin:0 0 24px;">Email previews</h1><ul style="padding-left:20px;margin:0;">${items}</ul></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
