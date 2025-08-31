import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { readFile } from 'fs/promises'

const app = new Hono()

// Middlewares
app.use('*', compress())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://votre-domaine.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check pour Kubernetes
app.get('/health', (c) => {
  return c.json({
    status: 'Wayhost Panel is running',
    timestamp: new Date().toISOString(),
  })
})

// Servir les fichiers statiques avec cache optimisé
app.use('/*', serveStatic({
  root: './dist',
  onNotFound: async (path, c) => {
    // Fallback pour le routing SPA - lire le fichier avec fs/promises
    try {
      const html = await readFile('./dist/index.html', 'utf-8')
      return c.html(html)
    } catch (error) {
      console.error('Error reading index.html:', error)
      return c.text('App not found', 404)
    }
  }
}))

// Fallback SPA pour toutes les autres routes
app.get('*', async (c) => {
  try {
    const html = await readFile('./dist/index.html', 'utf-8')
    return c.html(html)
  } catch (error) {
    console.error('Error reading index.html:', error)
    return c.text('App not found', 404)
  }
})

const port = parseInt(process.env.PORT) || 3000

console.log(`🚀 Hono server starting on http://0.0.0.0:${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
}, (info) => {
  console.log(`🎯 Server is running on http://localhost:${info.port}`)
})