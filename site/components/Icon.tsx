/* Icons come from the inline sprite (components/chrome/Sprite.tsx), named i-<name>. Always decorative: the control carries the name. */
type Props = { name: string; size?: 's' | 'l'; className?: string };

export function Icon({ name, size, className = '' }: Props) {
  const cls = ['a-icon', size ? `-${size}` : '', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}
