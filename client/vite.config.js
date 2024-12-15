import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/submit': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(`Rewriting path: ${path.replace(/^\/api/, '')}`);  // 在控制台中查看请求路径
          return path.replace(/^\/api/, '');
        },
      },
    },
  },
})
