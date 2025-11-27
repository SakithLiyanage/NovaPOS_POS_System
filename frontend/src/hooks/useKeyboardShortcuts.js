import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        if (event.key !== 'Escape') return;
      }

      const key = event.key;
      const handler = shortcuts[key];
      
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
