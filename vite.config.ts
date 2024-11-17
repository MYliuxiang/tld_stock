import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // host: '0.0.0.0',
    // port: 8000,
    // cors:true,//允许跨域。
    // proxy: {
    //   // 将请求代理到另一个服务器
    //   '/kpl': {
    //     target: 'http://8.138.113.191:8000/',//这是你要跨域请求的地址前缀
    //     changeOrigin: true,//开启跨域
    //     secure:true,
    //     rewrite: path => path.replace(/^\/kpl/, ''),//去除前缀api
    //   }
    // }
    host: '0.0.0.0',
    port: 8080, 
    open: true,
    proxy: {
      '/kpl': {
        target: 'http://8.138.113.191:8000/',
        changeOrigin: true,
        ws: true,
        rewrite: (path: string) => path.replace(/^\/kpl/, ''),
      },
    },
  }
})

