/* 404 (group H): the hero treatment at 60vh with a water photo, then the search card. Copy: landfall/content/copy.md, 404 and error. */
import type { Metadata } from 'next';
import { NotFoundBody } from '@/components/account/Pages';

export const metadata: Metadata = { title: 'Page not found' };
export default function NotFound() { return <NotFoundBody />; }
