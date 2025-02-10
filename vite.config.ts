import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import eslintPlugin from 'vite-plugin-eslint'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include:['src/**/*.js','src/**/*.ts','src/**/*.vue','src/*.js','src/*.ts','src/*.vue']
    }),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
  
    host: '0.0.0.0',
    port: 8080, 
    open: true,
    proxy: {
      '/kpl/': {
        target: 'http://121.37.13.67:8000',
        // target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        ws: true,
        // rewrite: (path: string) => path.replace(/^\/kpl/, ''),
      },
      '/sdata/': {
        target: 'http://121.37.13.67:8000',
        // target: 'http://127.0.0.1:5000',

        changeOrigin: true,
        ws: true,
        // rewrite: (path: string) => path.replace(/^\/sdata/, ''),
      },
    },
  }
})


