'use client';
/* =====================================================================
   Landfall: Stripe's Payment Element, dressed in Landfall's tokens
   - PaymentProvider: the Elements group in deferred-intent mode (the
     amount is shown before any PaymentIntent exists; checkout creates it
     on Pay). Cards only, manual capture, as the server's PaymentIntent.
   - PaymentFields: the card fields themselves (number, expiry, CVC and
     the billing country and postcode Stripe asks for), or a notice when
     no publishable key is configured.
   Colours, radius and type are the role values of app/styles/tokens.css
   for each palette, written out because Stripe's fields live in an
   iframe that can't read the site's CSS variables. Albert Sans can't
   load inside that iframe either, so the fields fall back to Helvetica
   or Arial; keep these values in step with tokens.css.
   ===================================================================== */
import type { ReactNode } from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import type { Appearance, StripeElementsOptionsMode } from '@stripe/stripe-js';
import { getStripe, stripeConfigured } from '@/lib/stripe-client';
import { PALETTE, type Palette } from '@/lib/palette';
import Notice from '@/components/ui/Notice';

const TOKENS: Record<Palette, { ink: string; muted: string; surface: string; field: string; focus: string; error: string; tint: string }> = {
  navy: { ink: '#121839', muted: '#4D5478', surface: '#FFFFFF', field: '#8085A6', focus: '#16225A', error: '#B3261E', tint: '#E6F6F8' },
  harbour: { ink: '#0A2A3C', muted: '#46606F', surface: '#FFFFFF', field: '#7E95A3', focus: '#C2410C', error: '#B3261E', tint: '#EAF6FB' }
};

export function stripeAppearance(p: Palette = PALETTE): Appearance {
  const t = TOKENS[p];
  return {
    theme: 'stripe',
    variables: {
      colorPrimary: t.focus,
      colorText: t.ink,
      colorTextSecondary: t.muted,
      colorBackground: t.surface,
      colorDanger: t.error,
      fontFamily: '"Albert Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSizeBase: '16px',
      spacingUnit: '4px',
      borderRadius: '8px'
    },
    rules: {
      '.Label': { color: t.ink, fontWeight: '600', marginBottom: '6px' },
      '.Input': { border: `1px solid ${t.field}`, boxShadow: 'none', padding: '12px' },
      '.Input:focus': { border: `1px solid ${t.focus}`, boxShadow: `0 0 0 2px ${t.focus}`, outline: 'none' },
      '.Input--invalid': { border: `1px solid ${t.error}`, boxShadow: 'none' },
      '.Error': { color: t.error }
    }
  };
}

/* the Elements group for one checkout; `amount` is the total shown when the page opens */
export function PaymentProvider({ amount, currency, children }: { amount: number; currency: string; children: ReactNode }) {
  const options: StripeElementsOptionsMode = {
    mode: 'payment',
    amount: Math.max(1, amount),
    currency: currency.toLowerCase(),
    captureMethod: 'manual',
    allowedPaymentMethodTypes: ['card'],
    appearance: stripeAppearance(),
    locale: 'en'
  };
  return <Elements stripe={getStripe()} options={options}>{children}</Elements>;
}

export function PaymentFields({ disabled, onReady }: { disabled?: boolean; onReady?: () => void }) {
  if (!stripeConfigured()) {
    return (
      <Notice tone="warn" title="Payments aren’t configured yet">
        <p>Card payments need the site’s Stripe keys. Nothing can be booked until they’re added.</p>
      </Notice>
    );
  }
  return (
    <PaymentElement
      onReady={onReady}
      options={{
        layout: 'tabs',
        readOnly: disabled,
        /* the booking confirmation email is the receipt; no Stripe terms text under the fields */
        terms: { card: 'never' }
      }}
    />
  );
}
