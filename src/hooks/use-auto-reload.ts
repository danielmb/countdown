import { useEffect, useRef } from 'react';

/**
 * Hook that automatically reloads the page when the server restarts.
 * Polls the /health endpoint and compares server start times.
 */
export function useAutoReload(intervalMs: number = 10000) {
  const serverStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch('/health');
        if (!response.ok) return;

        const data = await response.json();
        const currentStartTime = data.startTime;

        // If this is the first check, just store the start time
        if (serverStartTimeRef.current === null) {
          serverStartTimeRef.current = currentStartTime;
          console.log(
            '[Auto-reload] Server start time recorded:',
            new Date(currentStartTime),
          );
          return;
        }

        // If the start time changed, the server restarted - reload the page
        if (serverStartTimeRef.current !== currentStartTime) {
          console.log(
            '[Auto-reload] Server restarted detected, reloading page...',
          );
          window.location.reload();
        }
      } catch (error) {
        // Server might be down during deployment, that's okay
        console.log(
          '[Auto-reload] Health check failed (server might be restarting)',
        );
      }
    };

    // Initial check
    checkServerHealth();

    // Set up polling interval
    const intervalId = setInterval(checkServerHealth, intervalMs);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [intervalMs]);
}
