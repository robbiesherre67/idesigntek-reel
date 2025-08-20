import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/portfolio/' : '/',
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  server: { port: 3000, strictPort: false },
  preview: { port: 3001, strictPort: true }
}))
