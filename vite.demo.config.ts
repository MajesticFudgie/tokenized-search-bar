import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base: '/tokenized-search-bar/',
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
  },
})
