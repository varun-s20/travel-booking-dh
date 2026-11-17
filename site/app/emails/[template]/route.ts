/* One email, rendered for review in the palette this build runs (lib/emails.ts). */
import { renderEmail } from '@/lib/emails';
import { PALETTE } from '@/lib/palette';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, ctx: { params: Promise<{ template: string }> }) {
  const { template } = await ctx.params;
  const html = renderEmail(template, PALETTE, new URL(req.url).origin);
  if (!html) return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
