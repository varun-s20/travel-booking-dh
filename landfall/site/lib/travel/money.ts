/* =====================================================================
   Landfall: money in minor units
   Suppliers send decimal strings ("412.30"); the app keeps integers in
   minor units (cents) everywhere, so no amount ever passes through a
   float. Conversion is exact string arithmetic.
   ===================================================================== */

/* ISO 4217 minor-unit exponents for currencies a supplier may send; anything unlisted is 2 */
const EXPONENT: Record<string, number> = { JPY: 0, KRW: 0, VND: 0, CLP: 0, ISK: 0, HUF: 2, BHD: 3, KWD: 3, OMR: 3, JOD: 3, TND: 3 };
export const exponentOf = (currency: string) => EXPONENT[currency.toUpperCase()] ?? 2;

/* "412.3" in USD -> 41230. Throws on anything that is not a plain decimal. */
export function toMinor(amount: string | number, currency: string): number {
  const s = String(amount).trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error(`Not a decimal amount: ${s}`);
  const neg = s.startsWith('-');
  const [int, frac = ''] = s.replace('-', '').split('.');
  const e = exponentOf(currency);
  /* round half up on any digits beyond the currency's precision */
  const kept = (frac + '0'.repeat(e)).slice(0, e);
  const rest = frac.slice(e);
  let minor = parseInt(int + kept || '0', 10);
  if (rest && +rest[0] >= 5) minor += 1;
  return neg ? -minor : minor;
}

/* 41230 in USD -> "412.30" (the form suppliers expect back, e.g. Duffel payments) */
export function fromMinor(minor: number, currency: string): string {
  const e = exponentOf(currency);
  const neg = minor < 0;
  const abs = String(Math.abs(Math.round(minor))).padStart(e + 1, '0');
  const out = e ? `${abs.slice(0, -e)}.${abs.slice(-e)}` : abs;
  return neg ? `-${out}` : out;
}
