'use client';
/* =====================================================================
   travel-booking (working name Overwing, a placeholder): error (500)
   The 404's window with its blind down, the error line and the two
   actions from content/copy.md: Try again resets the page; Go to
   Bookings, so nobody pays twice.
   ===================================================================== */
import { useEffect } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { NotFoundBody } from '@/components/NotFoundBody';
import { ROUTES } from '@/lib/site';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  useEffect(() => { document.title = 'Something went wrong | Overwing'; }, []);
  return (
    <NotFoundBody title="Something went wrong on our side" line="Please try again in a moment. If you were paying, check Bookings or your email first, so you don’t book twice."
      actions={<>
        <button className="a-button" type="button" onClick={reset}><span className="a-button__label">Try again</span></button>
        <Link className="a-link t-notFound__home" href={ROUTES.bookings}>Go to Bookings</Link>
      </>} />
  );
}
