'use client';
/* A link to the hero search that works without JS (#search); with JS it
   asks the search to open on a tab and come into view (desktop) or open
   its sheet (phone). Used by the entry cards and the pre-footer band. */
import { Icon } from '@/components/Icon';
import { requestSearch, type SearchMode } from '@/lib/client';

type Props = { mode?: SearchMode; label: string; className?: string };

export function SearchLink({ mode, label, className = 'a-button -light' }: Props) {
  return (
    <a
      className={className}
      href="#search"
      onClick={(e) => { e.preventDefault(); requestSearch(mode); }}
    >
      <span className="a-button__label">{label}</span>
      <Icon name="arrow" className="a-button__icon" />
    </a>
  );
}
