'use client';
/* Toasts (copy.md, "Toasts and system messages"): one at a time, bottom
   centre above the tab bar, announced politely, gone after 3.2s. Any
   component calls toast() from lib/client.ts. Going offline says so. */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { TOAST_EVENT, toast } from '@/lib/client';

export function Toaster() {
  const [msg, setMsg] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      const m = (e as CustomEvent<{ message: string }>).detail?.message || '';
      setMsg('');
      window.clearTimeout(timer.current);
      requestAnimationFrame(() => setMsg(m));
      timer.current = window.setTimeout(() => setMsg(''), 3200);
    };
    const offline = () => toast('You’re offline. Check your connection and try again.');
    window.addEventListener(TOAST_EVENT, on);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener(TOAST_EVENT, on); window.removeEventListener('offline', offline); window.clearTimeout(timer.current); };
  }, []);
  return (
    <div className="m-toast" role="status" aria-live="polite">
      {msg && <p className="m-toast__msg"><Icon name="tick" size="s" />{msg}</p>}
    </div>
  );
}
