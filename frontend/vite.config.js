import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend URL for dev proxy: BACKEND_URL env var, or http://localhost:8000 if not set.
// In production, the backend serves these static files at the same origin, so no proxy
// is needed and all /api/v1 calls resolve same-origin automatically.
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
