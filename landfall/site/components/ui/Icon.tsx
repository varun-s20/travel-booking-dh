/* Landfall (working name, a placeholder): one icon from the sprite in
   components/chrome/Sprite.tsx. Always decorative: give the control its
   own accessible name. size: 'sm' 16px, default 20px, 'lg' 24px. */
import type { IconName } from '@/components/chrome/Sprite';

export default function Icon({ name, size, className }: { name: IconName; size?: 'sm' | 'lg'; className?: string }) {
  const cls = ['a-svg', size ? `-${size}` : '', className || ''].filter(Boolean).join(' ');
  return <svg className={cls} aria-hidden="true" focusable="false"><use href={`#i-${name}`} /></svg>;
}
