import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to fix @uidotdev/usehooks import assignment issue
    {
      name: 'fix-usehooks-import',
      transform(code, id) {
        if (id.includes('@uidotdev/usehooks')) {
          // Replace the problematic import assignment
          return code.replace(
            'React.useEffectEvent = React.experimental_useEffectEvent;',
            `
            // Safe assignment to avoid esbuild error
            if (React.experimental_useEffectEvent && !React.useEffectEvent) {
              try {
                Object.defineProperty(React, 'useEffectEvent', {
                  value: React.experimental_useEffectEvent,
                  writable: true,
                  configurable: true
                });
              } catch (e) {
                // Fallback for strict environments
                React.useEffectEvent = React.experimental_useEffectEvent;
              }
            }
            `,
          );
        }
        return code;
      },
    },
  ],
  optimizeDeps: {
    // Force pre-bundling of problematic packages
    include: ['@uidotdev/usehooks'],
  },
});
