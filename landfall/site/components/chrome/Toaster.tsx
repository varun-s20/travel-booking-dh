/* =====================================================================
   Landfall (working name, a placeholder): toasts
   The listener for lib/client.ts toast(message): any component calls
   toast('Copied') and this shows it. Rendered once by app/layout.tsx
   outside the app wrapper, so it still shows while a dialog makes the
   page inert. A polite live region; each toast stays 4.5s (longer
   messages 7s), with a close button; at most three at once.
   Messages come from landfall/content/copy.md, Toasts and system messages.
   ===================================================================== */
'use client';
import { useEffect, useState } from 'react';
import { TOAST_EVENT } from '@/lib/client';
import Icon from '@/components/ui/Icon';

type T = { id: number; message: string };
let seq = 0;

export default function Toaster() {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    const timers = new Set<number>();
    const on = (e: Event) => {
      const message = (e as CustomEvent<{ message: string }>).detail?.message;
      if (!message) return;
      const id = ++seq;
      setItems((list) => [...list.slice(-2), { id, message }]);
      const t = window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== id)), message.length > 40 ? 7000 : 4500);
      timers.add(t);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => { window.removeEventListener(TOAST_EVENT, on); timers.forEach((t) => window.clearTimeout(t)); };
  }, []);
  return (
    <div className="m-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div className="m-toast" key={t.id}>
          <Icon name="tick" />
          <span className="m-toast__text">{t.message}</span>
          <button type="button" className="m-toast__x" aria-label="Close" onClick={() => setItems((list) => list.filter((x) => x.id !== t.id))}><Icon name="close" size="sm" /></button>
        </div>
      ))}
    </div>
  );
}
