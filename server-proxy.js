import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { readFile } from 'fs/promises'

const app = new Hono()

// Configuration des microservices depuis les variables d'environnement
const API_BASE_URL = process.env.VITE_API_URL || 'http://wayhost.trustmycloud.com'
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || `${API_BASE_URL}:8000`
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || `${API_BASE_URL}:8002`
const SERVER_SERVICE = process.env.SERVER_SERVICE_URL || `${API_BASE_URL}:8001`

console.log('🔧 Microservices configuration:')
console.log(`   AUTH: ${AUTH_SERVICE}`)
console.log(`   PAYMENT: ${PAYMENT_SERVICE}`)
console.log(`   SERVER: ${SERVER_SERVICE}`)

// Middlewares
app.use('*', compress())
app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://votre-domaine.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Helper pour créer un proxy
// Helper pour créer un proxy avec gestion correcte des cookies
const createProxy = (targetService, pathPrefix) => {
  return async (c) => {
    const url = new URL(c.req.url)
    const targetPath = url.pathname.replace(`/api${pathPrefix}`, pathPrefix)
    const targetUrl = `${targetService}${targetPath}${url.search}`
    
    console.log(`🔄 [${pathPrefix.toUpperCase()} PROXY] ${c.req.method} ${url.pathname} → ${targetUrl}`)
    
    try {
      // Récupérer TOUS les headers de la requête (y compris Cookie)
      const requestHeaders = {}
      for (const [key, value] of c.req.raw.headers.entries()) {
        requestHeaders[key] = value
      }
      
      // Construire la requête vers le microservice
      const fetchOptions = {
        method: c.req.method,
        headers: requestHeaders,
      }
      
      // Ajouter le body si ce n'est pas une requête GET/HEAD
      if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
        fetchOptions.body = await c.req.arrayBuffer()
      }
      
      const response = await fetch(targetUrl, fetchOptions)
      
      // Créer la réponse en préservant TOUS les headers importants
      const responseHeaders = new Headers()
      
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase()
        
        // Exclure seulement les headers qui causent des conflits
        if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(lowerKey)) {
          responseHeaders.set(key, value)
        }
      })
      
      // S'assurer que les cookies Set-Cookie sont bien transmis
      const setCookieHeaders = response.headers.get('set-cookie')
      if (setCookieHeaders) {
        console.log('🍪 Set-Cookie header found:', setCookieHeaders)
        responseHeaders.set('set-cookie', setCookieHeaders)
      }
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      })
      
    } catch (error) {
      console.error(`❌ [${pathPrefix.toUpperCase()} PROXY ERROR]`, error.message)
      return c.json({ 
        error: `${pathPrefix.replace('/', '')} service unavailable`,
        message: error.message 
      }, 503)
    }
  }
}

// Routes proxy pour les microservices
app.all('/api/auth/*', createProxy(AUTH_SERVICE, '/auth'))
app.all('/api/payment/*', createProxy(PAYMENT_SERVICE, '/payment'))
app.all('/api/server/*', createProxy(SERVER_SERVICE, '/server'))

// Health check pour Kubernetes
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      auth: AUTH_SERVICE,
      payment: PAYMENT_SERVICE,
      server: SERVER_SERVICE
    }
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