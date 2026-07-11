import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Forward live-lead API calls to the local Express backend (npm run server)
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
})
