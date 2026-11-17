/* =====================================================================
   Landfall (working name, a placeholder), group F: email preview frame
   Shows one rendered email in an iframe (srcdoc, so the email's own
   styles never meet the site's) and grows the frame to the email's
   height: on load, and once after hydration in case the frame loaded
   before React attached its handler; again when the window resizes.
   ===================================================================== */
'use client';
import { useEffect, useRef } from 'react';

export default function EmailFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const doc = el.contentDocument;
      if (doc?.body) { el.style.height = '0px'; el.style.height = `${doc.documentElement.scrollHeight}px`; }
    };
    fit();
    el.addEventListener('load', fit);
    window.addEventListener('resize', fit);
    return () => { el.removeEventListener('load', fit); window.removeEventListener('resize', fit); };
  }, [html]);
  return <iframe ref={ref} className="f-mail__frame" srcDoc={html} title={title} />;
}
