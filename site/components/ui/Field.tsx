/* =====================================================================
   Form fields (spec 2b, passenger form): 56px, radius 16, a 3:1 border,
   a real label above in 14px Geist 600, help under the label, the error
   under the field in the error colour with an icon, tied by
   aria-describedby and aria-invalid. Forms are novalidate; each page
   validates and passes the message in.
   ===================================================================== */
import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Icon } from '@/components/Icon';

type Base = { id: string; label: ReactNode; help?: ReactNode; error?: string; className?: string; after?: ReactNode };

function describedBy(id: string, help?: ReactNode, error?: string) {
  return [help ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return <p className="m-field__error" id={`${id}-error`}><Icon name="alert" size="s" />{error}</p>;
}

/* React 19 passes ref as a prop, so a page can focus the input (the card number after a decline) */
export function TextField({ id, label, help, error, className = '', after, ...rest }: Base & InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <div className={`m-field ${className}`}>
      <label className="m-field__label" htmlFor={id}>{label}</label>
      {help && <p className="m-field__help" id={`${id}-help`}>{help}</p>}
      <div className="m-field__control">
        <input className="m-field__input" id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, help, error)} {...rest} />
        {after}
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextArea({ id, label, help, error, className = '', ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`m-field ${className}`}>
      <label className="m-field__label" htmlFor={id}>{label}</label>
      {help && <p className="m-field__help" id={`${id}-help`}>{help}</p>}
      <textarea className="m-field__input -area" id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, help, error)} {...rest} />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function SelectField({ id, label, help, error, className = '', children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`m-field ${className}`}>
      <label className="m-field__label" htmlFor={id}>{label}</label>
      {help && <p className="m-field__help" id={`${id}-help`}>{help}</p>}
      <div className="m-field__control -select">
        <select className="m-field__input" id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, help, error)} {...rest}>{children}</select>
        <Icon name="chev-down" size="s" className="m-field__chev" />
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

/* a checkbox row: box, label, its own error */
export function CheckField({ id, label, error, className = '', ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`m-check ${className}`}>
      <div className="m-check__row">
        <input className="m-check__box" type="checkbox" id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
        <label className="m-check__label" htmlFor={id}>{label}</label>
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

/* "Check 2 details before you continue": focus lands here when a form is sent with errors */
export function ErrorSummary({ id, title, items }: { id: string; title: string; items: { field: string; message: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="m-errorSum" id={id} tabIndex={-1} role="alert">
      <p className="m-errorSum__title"><Icon name="alert" />{title}</p>
      <ul className="m-errorSum__list">
        {items.map((i) => (
          <li key={i.field}><a className="m-errorSum__link" href={`#${i.field}`} onClick={(e) => { e.preventDefault(); document.getElementById(i.field)?.focus(); }}>{i.message}</a></li>
        ))}
      </ul>
    </div>
  );
}
