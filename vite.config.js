import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: { 
    outDir: 'dist',
    minify: false,
    modulePreload: false,
    rollupOptions: {
      output: { manualChunks: undefined }
    }
  },
  define: {
    __WORKER_URL__: JSON.stringify(
      process.env.VITE_WORKER_URL || 'https://kouvadeiros-api.jboikos.workers.dev'
    ),
    __SCORES_URL__: JSON.stringify(
      process.env.VITE_SCORES_URL || 'https://kouvadeiros-scores.jboikos.workers.dev'
    ),
  }
})
