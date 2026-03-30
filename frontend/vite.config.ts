import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// 端口规则: 开发 5001-5999, 生产 7001-7799
// FoxChat: 开发 5002, 生产 7002
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    host: '0.0.0.0',  // 允许外部访问
    allowedHosts: ['foxchat.wantoai.com', 'localhost', '127.0.0.1'],  // 允许的域名
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
