import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Force pre-bundling of problematic packages
    include: ['@uidotdev/usehooks'],
  },
  build: {},
  esbuild: {
    keepNames: true,
  },
});
