/* =====================================================================
   Landfall (working name, a placeholder): form fields
   56px fields with real labels above (spec, Passenger form), inline
   errors under the field in error red with an icon, tied by
   aria-describedby and aria-invalid. Forms use noValidate and their own
   checks, then an ErrorSummary that takes focus on submit.
   - TextField: any <input> type; pass error to show it
   - PasswordField: TextField with the Show and Hide toggle
   - SelectField: native select with the chevron
   - TextArea, Checkbox
   - ErrorSummary: title plus links to each invalid field (#id)
   ===================================================================== */
'use client';
import { forwardRef, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import Icon from './Icon';

type Base = { label: ReactNode; error?: string; hint?: ReactNode; optional?: boolean; className?: string };

function describedBy(id: string, error?: string, hint?: ReactNode) {
  return [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
}

function Shell({ id, label, error, hint, optional, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={['m-field', className || ''].filter(Boolean).join(' ')}>
      <label className="m-field__label" htmlFor={id}>{label}{optional && <span className="m-field__opt"> (optional)</span>}</label>
      {hint && <p className="m-field__hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && <p className="m-field__error" id={`${id}-err`}><Icon name="error" />{error}</p>}
    </div>
  );
}

export const TextField = forwardRef<HTMLInputElement, Base & ComponentPropsWithoutRef<'input'>>(function TextField({ label, error, hint, optional, className, id, ...rest }, ref) {
  const auto = useId();
  const fid = id || auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="m-field__control">
        <input ref={ref} id={fid} className="m-field__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, error, hint)} {...rest} />
      </div>
    </Shell>
  );
});

export const PasswordField = forwardRef<HTMLInputElement, Base & Omit<ComponentPropsWithoutRef<'input'>, 'type'>>(function PasswordField({ label, error, hint, optional, className, id, ...rest }, ref) {
  const auto = useId();
  const fid = id || auto;
  const [show, setShow] = useState(false);
  return (
    <Shell id={fid} label={label} error={error} hint={hint} optional={optional} className={['-pw', className || ''].join(' ')}>
      <div className="m-field__control">
        <input ref={ref} id={fid} type={show ? 'text' : 'password'} className="m-field__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, error, hint)} {...rest} />
        <button type="button" className="m-field__toggle" aria-pressed={show} aria-controls={fid} onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}<span className="sr-only"> password</span></button>
      </div>
    </Shell>
  );
});

export const SelectField = forwardRef<HTMLSelectElement, Base & ComponentPropsWithoutRef<'select'>>(function SelectField({ label, error, hint, optional, className, id, children, ...rest }, ref) {
  const auto = useId();
  const fid = id || auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="m-field__control">
        <select ref={ref} id={fid} className="m-field__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, error, hint)} {...rest}>{children}</select>
        <span className="m-field__chev"><Icon name="chev-d" size="sm" /></span>
      </div>
    </Shell>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, Base & ComponentPropsWithoutRef<'textarea'>>(function TextArea({ label, error, hint, optional, className, id, ...rest }, ref) {
  const auto = useId();
  const fid = id || auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea ref={ref} id={fid} className="m-field__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, error, hint)} {...rest} />
    </Shell>
  );
});

export function Checkbox({ children, error, id, ...rest }: { children: ReactNode; error?: string } & Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'>) {
  const auto = useId();
  const fid = id || auto;
  return (
    <div>
      <label className="m-check" htmlFor={fid}>
        <input id={fid} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={error ? `${fid}-err` : undefined} {...rest} />
        <span className="m-check__text">{children}</span>
      </label>
      {error && <p className="m-field__error" id={`${fid}-err`}><Icon name="error" />{error}</p>}
    </div>
  );
}

/* The summary takes focus each time `version` changes (bump it on every failed submit). */
export function ErrorSummary({ title, errors, version }: { title: string; errors: { id: string; message: string }[]; version: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (errors.length) ref.current?.focus(); }, [version, errors.length]);
  if (!errors.length) return null;
  return (
    <div ref={ref} className="m-errors" role="alert" tabIndex={-1}>
      <p className="m-errors__title"><Icon name="error" />{title}</p>
      <ul className="m-errors__list">
        {errors.map((e) => <li key={e.id}><a href={`#${e.id}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(e.id)?.focus(); }}>{e.message}</a></li>)}
      </ul>
    </div>
  );
}
