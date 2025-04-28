import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true
      }
    }
  },
  build: {
    target: 'esnext'
  }
});