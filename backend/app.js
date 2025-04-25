import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { projectXRoutes } from './src/routes/projectXRoutes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// IMPORTANT: Use absolute path for production
const root = join(__dirname, '../frontend/dist')

const app = fastify({
  logger: true,
  // Enable trust proxy for Render.com
  trustProxy: true,
})

const port = Number(process.env.PORT) || 3000
const host = process.env.RENDER ? '0.0.0.0' : 'localhost'
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

// 1. First register CORS
await app.register(fastifyCors, {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})

// 2. Register static file serving
await app.register(fastifyStatic, {
  root: root,
  prefix: '/',
})

// 3. Register API routes
app.register(projectXRoutes, { prefix: '/api' })

// 4. SPA fallback handler - must come LAST
app.setNotFoundHandler((request, reply) => {
  // Only handle GET requests that don't start with /api
  if (request.method === 'GET' && !request.url.startsWith('/api')) {
    return reply.sendFile('index.html')
  }
  reply.code(404).send({ error: 'Not Found' })
})

// Health check endpoint
app.get('/health', (_, reply) => {
  reply.send({ status: 'ok' })
})

// Start server
app.listen({ host, port }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Server running at http://${host}:${port}`)
})
