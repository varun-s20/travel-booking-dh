/* =====================================================================
   Landfall (working name, a placeholder): buttons (Varun V9)
   Pills, sentence case, a small arrow, the quiet hover in global.css.
   variant: 'primary' (navy, on light grounds), 'bright' (on navy),
   'ghost' (secondary, and on photos). inner: inside a search surface
   (keeps the 12px radius, ruling 5). block: full width. arrow: the
   small arrow after the label. ButtonLink takes href (next/link for
   internal paths); Button is a <button type="button"> unless type is set.
   ===================================================================== */
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Icon from './Icon';
import type { IconName } from '@/components/chrome/Sprite';

type Common = { variant?: 'primary' | 'bright' | 'ghost'; inner?: boolean; block?: boolean; large?: boolean; arrow?: boolean; icon?: IconName; className?: string; children: ReactNode };

export function buttonClass({ variant = 'primary', inner, block, large, className }: Omit<Common, 'children'>): string {
  return ['a-button', variant !== 'primary' ? `-${variant}` : '', inner ? '-inner' : '', block ? '-block' : '', large ? '-lg' : '', className || ''].filter(Boolean).join(' ');
}

function Inner({ icon, arrow, children }: Pick<Common, 'icon' | 'arrow' | 'children'>) {
  return <>{icon && <Icon name={icon} />}{children}{arrow && <Icon name="arrow" />}</>;
}

export function Button({ variant, inner, block, large, arrow, icon, className, children, type = 'button', ...rest }: Common & ComponentPropsWithoutRef<'button'>) {
  return <button type={type} className={buttonClass({ variant, inner, block, large, className })} {...rest}><Inner icon={icon} arrow={arrow}>{children}</Inner></button>;
}

export function ButtonLink({ variant, inner, block, large, arrow, icon, className, children, href, ...rest }: Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const cls = buttonClass({ variant, inner, block, large, className });
  if (href.startsWith('/')) return <Link href={href} className={cls} {...rest}><Inner icon={icon} arrow={arrow}>{children}</Inner></Link>;
  return <a href={href} className={cls} {...rest}><Inner icon={icon} arrow={arrow}>{children}</Inner></a>;
}
