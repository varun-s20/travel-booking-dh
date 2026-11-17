'use client';
/* Looks a booking up in the browser (lib/store.ts) for the confirmation
   and booking detail pages. Until the page hydrates it holds a quiet
   loading line; a reference this browser doesn't know shows the 404's
   window; the booking detail asks logged-out visitors to log in. */
import { BookingView } from '@/components/booking/BookingView';
import { NotFoundBody } from '@/components/NotFoundBody';
import { LoggedOut } from '@/components/account/LoggedOut';
import { bookingsFor, currentUser, findBooking, useStore } from '@/lib/store';

export function BookingPage({ code, mode }: { code: string; mode: 'confirmation' | 'detail' }) {
  const store = useStore();
  if (!store) return <div className="o-booking -loading" aria-busy="true" />;
  if (mode === 'detail') {
    if (!currentUser(store)) return <LoggedOut next={`/bookings/${code}`} />;
    const b = bookingsFor(store).find((x) => x.ref === code);
    return b ? <BookingView booking={b} mode="detail" /> : <NotFoundBody />;
  }
  const b = findBooking(store, code);
  return b ? <BookingView booking={b} mode="confirmation" /> : <NotFoundBody />;
}
