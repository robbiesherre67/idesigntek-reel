// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    plugins: [vue()],
    base: isProd ? '/idesigntek-reel/' : '/',   // subfolder only in prod
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // robust alias
      },
    },
    server: { port: 3000, strictPort: false },
    preview: { port: 3001, strictPort: true },
  }
})