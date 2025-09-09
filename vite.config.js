import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  build: {
    rollupOptions: {
      output: {
        format: 'es' // 使用ES模块格式，支持代码分割
      }
    }
  }
})
