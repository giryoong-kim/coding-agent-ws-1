import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    // When VITE_API_BASE_URL is set at build time, it is used as the default
    // API origin. When empty (the default), the frontend resolves to same-origin
    // at runtime. A running user can always override with ?endpoint= in the URL.
    define: {
      __API_BASE_URL__: JSON.stringify(env['VITE_API_BASE_URL'] ?? ''),
    },
  }
})
