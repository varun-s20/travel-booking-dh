'use client';
/* =====================================================================
   Landfall: finishing a booking after a payment redirect
   Asks the server to complete the booking (POST /api/checkout/<id>/
   complete), waits while the airline or hotel confirms, then opens the
   confirmation page. A payment that didn't go through says so, with
   nothing charged.
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Notice from '@/components/ui/Notice';
import { ButtonLink } from '@/components/ui/Button';

type Outcome = { status: 'confirmed' | 'processing' | 'awaiting_payment' | 'failed'; reference: string; code?: string };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function CheckoutReturn({ bookingId, guestKey, redirectStatus }: { bookingId: string; guestKey?: string; redirectStatus: string }) {
  const router = useRouter();
  const [failed, setFailed] = useState(redirectStatus === 'failed' || !bookingId);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || failed) return;
    started.current = true;
    let live = true;
    (async () => {
      let r = await api<Outcome>(`/api/checkout/${encodeURIComponent(bookingId)}/complete`, { method: 'POST', body: { guestKey } });
      for (let i = 0; i < 40 && live && (r.error || r.data?.status === 'processing' || r.data?.status === 'awaiting_payment'); i++) {
        await sleep(3000);
        r = await api<Outcome>(`/api/checkout/${encodeURIComponent(bookingId)}${guestKey ? `?key=${encodeURIComponent(guestKey)}` : ''}`);
      }
      if (!live) return;
      if (r.data && r.data.status !== 'failed') {
        if (guestKey) { try { window.sessionStorage.setItem(`landfall:guest:${r.data.reference}`, guestKey); } catch { /* the URL carries it too */ } }
        router.replace(`/confirmation/${r.data.reference}${guestKey ? `?key=${encodeURIComponent(guestKey)}` : ''}`);
      } else setFailed(true);
    })();
    return () => { live = false; };
  }, [bookingId, guestKey, failed, router]);

  return (
    <div className="l-container f-co">
      <h1 className="t-display t-h1">{failed ? 'The booking didn’t go through' : 'Confirming your booking'}</h1>
      {failed ? (
        <Notice tone="error" title="Your card has not been charged" actions={<ButtonLink href="/">Search again</ButtonLink>}>
          <p>The payment or the booking couldn’t be completed, so nothing was taken. Search again to see what’s available now.</p>
        </Notice>
      ) : (
        <p className="t-body t-muted f-pay__wait" aria-live="polite">This can take a few seconds. Please keep this page open.</p>
      )}
    </div>
  );
}
