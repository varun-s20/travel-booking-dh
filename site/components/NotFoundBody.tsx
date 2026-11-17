/* The 404's body (spec 2b: one cabin window with the blind fully down),
   shared by app/not-found.tsx and the client pages that look a booking
   up in the browser and don't find it. Copy: content/copy.md, 404. */
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';

export function NotFoundBody({ title = 'We couldn’t find that page', line = 'The link may be broken, or the page may have moved. Start a new search or go back to the home page.', actions }: { title?: string; line?: string; actions?: React.ReactNode }) {
  return (
    <div className="t-notFound b-wrap">
      <span className="t-notFound__window" aria-hidden="true" />
      <h1 className="t-notFound__title a-h1">{title}</h1>
      <p className="t-notFound__line a-lead">{line}</p>
      <div className="t-notFound__actions">
        {actions ?? (
          <>
            <Link className="a-button" href="/#search"><span className="a-button__label">Start a search</span><Icon name="arrow" className="a-button__icon" /></Link>
            <Link className="a-link t-notFound__home" href="/">Go to the home page</Link>
          </>
        )}
      </div>
    </div>
  );
}
