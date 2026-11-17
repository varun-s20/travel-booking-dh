'use client';
/* Input modality: the search cells show their accent ring only for
   keyboard focus (text inputs match :focus-visible on click too), so
   <html> carries is-kbd after a Tab and loses it on the next pointer press. */
import { useEffect } from 'react';

export function InputModality() {
  useEffect(() => {
    const root = document.documentElement;
    const key = (e: KeyboardEvent) => { if (e.key === 'Tab') root.classList.add('is-kbd'); };
    const pointer = () => root.classList.remove('is-kbd');
    document.addEventListener('keydown', key, true);
    document.addEventListener('pointerdown', pointer, true);
    return () => {
      document.removeEventListener('keydown', key, true);
      document.removeEventListener('pointerdown', pointer, true);
    };
  }, []);
  return null;
}
