/* =====================================================================
   a-save (round 3 spec 0.4): the one place the savings tint is used.
   The text always states a real difference from the mock data, such as
   "$74 below the typical fare"; never a percentage without a price.
   ===================================================================== */
import { Icon } from '@/components/Icon';

export function Save({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`a-save ${className}`.trim()}>
      <Icon name="trend-down" />
      <span>{children}</span>
    </span>
  );
}
