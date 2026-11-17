/* Error page (group H): as the 404, with Try again. Copy: landfall/content/copy.md, 404 and error. */
'use client';
import { useEffect } from 'react';
import { ErrorBody } from '@/components/account/Pages';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { document.title = 'Something went wrong | Landfall'; }, [error]);
  return <ErrorBody retry={reset} />;
}
