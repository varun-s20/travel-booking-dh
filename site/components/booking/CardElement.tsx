'use client';
/* =====================================================================
   The card form, standing in for Stripe's Payment Element in the
   simulated build (spec 3b): themed from the tokens as the Appearance
   API would be (white card, radius 16, 1px field border, the focus
   ring), with the Element's own labels and messages (copy.md note 11:
   Stripe supplies them, we don't rewrite them). The live build swaps
   this for the real Element; nothing else on the page changes.
   ===================================================================== */
import { forwardRef } from 'react';
import { SelectField, TextField } from '@/components/ui/Field';

export type CardValue = { number: string; exp: string; cvc: string; country: string };
export type CardErrors = Partial<Record<keyof CardValue, string>>;

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'France', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Portugal', 'South Africa', 'Spain', 'Australia', 'United Arab Emirates', 'Singapore'];

function luhn(d: string): boolean {
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i];
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

/* Stripe's own messages for an incomplete or invalid card */
export function checkCard(v: CardValue): CardErrors {
  const e: CardErrors = {};
  const digits = v.number.replace(/\D/g, '');
  if (digits.length < 15) e.number = 'Your card number is incomplete.';
  else if (!luhn(digits)) e.number = 'Your card number is invalid.';
  const m = v.exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) e.exp = 'Your card’s expiration date is incomplete.';
  else {
    const mm = +m[1], yy = 2000 + +m[2];
    const now = new Date();
    if (mm < 1 || mm > 12) e.exp = 'Your card’s expiration date is incomplete.';
    else if (yy < now.getFullYear()) e.exp = 'Your card’s expiration year is in the past.';
    else if (yy === now.getFullYear() && mm < now.getMonth() + 1) e.exp = 'Your card’s expiration date is in the past.';
  }
  if (v.cvc.replace(/\D/g, '').length < 3) e.cvc = 'Your card’s security code is incomplete.';
  return e;
}

const groups = (s: string) => s.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
function expiry(s: string, prev: string): string {
  const d = s.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d.length === 2 && s.length > prev.length ? `${d} / ` : d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}

type Props = { value: CardValue; errors: CardErrors; disabled?: boolean; onChange: (v: CardValue) => void };

export const CardElement = forwardRef<HTMLInputElement, Props>(function CardElement({ value, errors, disabled, onChange }, ref) {
  return (
    <div className="m-cardEl">
      <TextField ref={ref} id="card-number" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234"
        value={value.number} error={errors.number} disabled={disabled} onChange={(e) => onChange({ ...value, number: groups(e.target.value) })} />
      <div className="m-cardEl__row">
        <TextField id="card-exp" label="Expiration date" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY"
          value={value.exp} error={errors.exp} disabled={disabled} onChange={(e) => onChange({ ...value, exp: expiry(e.target.value, value.exp) })} />
        <TextField id="card-cvc" label="Security code" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC"
          value={value.cvc} error={errors.cvc} disabled={disabled} onChange={(e) => onChange({ ...value, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
      </div>
      <SelectField id="card-country" label="Country" autoComplete="country-name" value={value.country} disabled={disabled} onChange={(e) => onChange({ ...value, country: e.target.value })}>
        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
      </SelectField>
    </div>
  );
});
