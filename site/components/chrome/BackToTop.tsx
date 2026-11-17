'use client';
/* Back to top: a plain link to #main that works without JS; with JS it
   scrolls smoothly (instantly under reduced motion) and moves focus to
   the top of the content, so keyboard users land where they can see. */
import { Icon } from '@/components/Icon';
import { prefersReducedMotion } from '@/lib/client';

export function BackToTop() {
  return (
    <a
      className="a-button -light -small"
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        document.getElementById('main')?.focus({ preventScroll: true });
      }}
    >
      <span className="a-button__label">Back to top</span>
      <Icon name="arrow" className="a-button__icon" />
    </a>
  );
}
