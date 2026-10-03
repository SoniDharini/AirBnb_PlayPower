import { useEffect } from 'react';

let locks = 0;
let savedY = 0;

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    if (locks === 0) {
      savedY = window.scrollY;
      const { style } = document.body;
      style.position = 'fixed';
      style.top = `-${savedY}px`;
      style.left = '0';
      style.right = '0';
      style.width = '100%';
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        const { style } = document.body;
        style.position = '';
        style.top = '';
        style.left = '';
        style.right = '';
        style.width = '';
        window.scrollTo(0, savedY);
      }
    };
  }, [active]);
}
