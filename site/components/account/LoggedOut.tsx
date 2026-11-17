/* Logged out on Bookings (copy.md, Dashboard): one window with its blind
   down, the line, Log in and Create an account. */
import { AppLink as Link } from '@/components/AppLink';
import { ROUTES } from '@/lib/site';

export function LoggedOut({ next = ROUTES.bookings }: { next?: string }) {
  return (
    <div className="m-empty -page">
      <span className="m-empty__window" aria-hidden="true" />
      <h1 className="m-empty__title a-h2">Log in to see your bookings</h1>
      <p className="m-empty__line">Your upcoming and past bookings, references and e-ticket numbers are kept in your account.</p>
      <div className="m-empty__actions">
        <Link className="a-button" href={`${ROUTES.login}?next=${encodeURIComponent(next)}`}><span className="a-button__label">Log in</span></Link>
        <Link className="a-button -soft" href={ROUTES.register}><span className="a-button__label">Create an account</span></Link>
      </div>
    </div>
  );
}
