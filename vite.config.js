import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  define: {
    __WORKER_URL__: JSON.stringify(
      process.env.VITE_WORKER_URL || 'https://kouvadeiros-api.jboikos.workers.dev'
    )
  }
})
