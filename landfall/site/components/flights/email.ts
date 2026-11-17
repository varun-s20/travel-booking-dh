/* =====================================================================
   Landfall (working name, a placeholder), group F: email renderer
   Spec 2b, Email: 600px single column on white, the wordmark at the top
   with its landfall line drawn as a 2px image-free rule (two table cells:
   ink, then the accent where the land is), the H1 in Georgia (Newsreader
   doesn't load in mail clients), the reference block, the rows with the
   landfall line above the paid total, a pill button in the action fill
   with its label colour, and the footer lines.
   Email-safe HTML: tables, inline styles, no CSS variables. The colours
   below are the role values of landfall/design/tokens.css (navy and
   harbour palettes), written out because mail clients can't read tokens;
   change them with tokens.css.
   Content: lib/emails.ts (landfall/content/copy.md, Email).
   ===================================================================== */
import { esc, type EmailContent } from '@/lib/emails';
import type { Palette } from '@/lib/palette';
import { SITE } from '@/lib/site';

const COLOURS: Record<Palette, { ink: string; muted: string; ground: string; surface: string; tint: string; line: string; accent: string; action: string; onAction: string; link: string }> = {
  navy: { ink: '#121839', muted: '#4D5478', ground: '#F5F6FB', surface: '#FFFFFF', tint: '#E6F6F8', line: '#E3E5F0', accent: '#0BA3AD', action: '#0BA3AD', onAction: '#121839', link: '#16225A' },
  harbour: { ink: '#0A2A3C', muted: '#46606F', ground: '#F2F9FC', surface: '#FFFFFF', tint: '#EAF6FB', line: '#DCEBF3', accent: '#C2410C', action: '#FF6F59', onAction: '#0A2A3C', link: '#0A4D68' }
};

const UI = "'Albert Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

/* the landfall line: a hairline in ink (or line colour) ending in the accent, as two cells */
function landfall(c: (typeof COLOURS)[Palette], width: number, base: string, h = 2): string {
  const land = Math.round(width * 0.22);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${width}" style="width:${width}px;max-width:100%;border-collapse:collapse"><tr>`
    + `<td height="${h}" style="height:${h}px;background:${base};font-size:0;line-height:0">&nbsp;</td>`
    + `<td width="${land}" height="${h}" style="width:${land}px;height:${h}px;background:${c.accent};font-size:0;line-height:0">&nbsp;</td></tr></table>`;
}

export function renderEmail(e: EmailContent, palette: Palette): string {
  const c = COLOURS[palette];
  const b = e.block;
  const p = (text: string, extra = '') => `<p style="margin:0 0 16px;font-family:${UI};font-size:16px;line-height:1.55;color:${c.ink};${extra}">${esc(text)}</p>`;

  const rows = (b.rows || []).map(([k, v]) => {
    const paid = k === 'Paid';
    const rule = paid ? `<tr><td colspan="2" style="padding:8px 0 0">${landfall(c, 520, c.line, 2)}</td></tr>` : '';
    return `${rule}<tr>`
      + `<td valign="top" width="128" style="width:128px;padding:${paid ? '16px' : '12px'} 16px 12px 0;font-family:${UI};font-size:14px;line-height:1.5;color:${c.muted};border-top:${paid || k === b.rows![0][0] ? '0' : `1px solid ${c.line}`}">${esc(k)}</td>`
      + `<td valign="top" style="padding:${paid ? '16px' : '12px'} 0 12px;font-family:${UI};font-size:${paid ? 18 : 15}px;line-height:1.5;color:${c.ink};font-weight:${paid ? 700 : 400};border-top:${paid || k === b.rows![0][0] ? '0' : `1px solid ${c.line}`}">${esc(v)}</td></tr>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(e.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${c.ground};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(e.preview)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${c.ground}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:${c.surface};border-radius:16px;border:1px solid ${c.line}">
<tr><td style="padding:32px 40px 0">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${SERIF};font-size:26px;line-height:1;color:${c.ink};padding:0 0 8px">landfall</td></tr>
  <tr><td>${landfall(c, 124, c.ink, 2)}</td></tr></table>
</td></tr>
<tr><td style="padding:36px 40px 8px">
  <h1 style="margin:0;font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.2;color:${c.ink}">${esc(b.h1)}</h1>
</td></tr>
${b.ref ? `<tr><td style="padding:16px 40px 8px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${c.tint};border-radius:12px"><tr><td style="padding:16px 20px">
    <p style="margin:0 0 4px;font-family:${UI};font-size:14px;color:${c.muted}">Booking reference</p>
    <p style="margin:0;font-family:${UI};font-size:28px;line-height:1.1;font-weight:700;letter-spacing:.06em;color:${c.ink}">${esc(b.ref)}</p>
  </td></tr></table>
</td></tr>` : ''}
${b.intro?.length ? `<tr><td style="padding:16px 40px 0">${b.intro.map((t) => p(t)).join('')}</td></tr>` : ''}
${rows ? `<tr><td style="padding:8px 40px 8px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table></td></tr>` : ''}
${b.paras?.length ? `<tr><td style="padding:16px 40px 0">${b.paras.map((t) => p(t)).join('')}</td></tr>` : ''}
<tr><td style="padding:16px 40px 40px">
  <a href="${esc(b.button.href)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${c.action};color:${c.onAction};font-family:${UI};font-size:15px;font-weight:700;line-height:1.2;text-decoration:none">${esc(b.button.label)}</a>
</td></tr>
<tr><td style="padding:24px 40px 32px;border-top:1px solid ${c.line}">
  ${p(e.support, `font-size:14px;color:${c.ink}`)}
  ${p(e.reason, `font-size:13px;color:${c.muted}`)}
  <p style="margin:0;font-family:${UI};font-size:13px;color:${c.muted}">&copy; 2026 ${esc(SITE.name)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
