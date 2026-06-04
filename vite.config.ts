import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      root: 'demo',
      server: { open: true },
    }
  }

  return {
    plugins: [
      react(),
      dts({
        include: ['src'],
        outDir: 'dist/types',
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'TokenizedSearchBar',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
          assetFileNames: (info) => {
            if (info.name === 'style.css') return 'index.css'
            return info.name ?? 'asset'
          },
        },
      },
      cssCodeSplit: false,
    },
  }
})
