import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lingui } from "@lingui/vite-plugin";

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
// Configuration du proxy seulement en développement


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  const proxyConfig = {
    '/api/auth': {
      target: env.VITE_API_URL + ':8000',
      changeOrigin: true,
      rewrite: (path: string) => {
        const newPath = path.replace(/^\/api\/auth/, '/auth')
        console.log(`🔄 [AUTH PROXY] ${path} → ${env.VITE_API_URL}:8000${newPath}`)
        return newPath
      },
    },
    '/api/payment': {
      target: env.VITE_API_URL + ':8002',
      changeOrigin: true,
      rewrite: (path: string) => {
        const newPath = path.replace(/^\/api\/payment/, '/payment')
        console.log(`🔄 [PAYMENT PROXY] ${path} → ${env.VITE_API_URL}:8002${newPath}`)
        return newPath
      },
    },
    '/api/server': {
      target: env.VITE_API_URL + ':8001',
      changeOrigin: true,
      rewrite: (path: string) => {
        const newPath = path.replace(/^\/api\/server/, '/server')
        console.log(`🔄 [SERVER PROXY] ${path} → ${env.VITE_API_URL}:8001${newPath}`)
        return newPath
      },
    },
  }
  
  return {
    plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: './src/modules',
      generatedRouteTree: "./src/routeTree.gen.ts",
      routeFileIgnorePrefix: "-",
      quoteStyle: "single",
      routeFileIgnorePattern: "\.ts$",
    }),
    viteReact(
      {
        babel: {
          plugins: ["@lingui/babel-plugin-lingui-macro"],
        },
      }
    ),
    tailwindcss(),
    lingui(),
  ],
  server: {
    port: 5173,
    proxy: proxyConfig,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}})

