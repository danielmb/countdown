import { useEffect } from 'react';

/**
 * Invokes `handler` when the given key is pressed.
 */
export function useKeyPress(
  targetKey: string,
  handler: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, handler]);
}
