import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { projectXRoutes } from './src/routes/projectXRoutes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = join(__dirname, '../frontend/dist')

// Détermine l'environnement
const port = Number(process.env.PORT) || 3000
const host = 'RENDER' in process.env ? '0.0.0.0' : 'localhost'
const app = fastify({ logger: true })

// Serve static files from frontend
app.register(fastifyStatic, {
  root: root,
  prefix: '/', // all static routes will be accessible from /
  index: false,
})

// Configuration CORS
await app.register(fastifyCors, {
  origin: ['http://localhost:5173'], // Autorise uniquement votre frontend Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
})

// Serve the frontend route
app.get('/', (req, reply) => {
  reply.sendFile('index.html') // Main file to serve
})

// Catch-all for SPA routes
app.setNotFoundHandler((request, reply) => {
  if (request.raw.method === 'GET' && !request.url.startsWith('/api')) {
    return reply.sendFile('index.html') // serve index.html for any unrecognized route
  }
  reply.status(404).send({ error: 'Not Found' })
})

// Register your projectX routes
app.register(projectXRoutes)

// After all routes and plugins are registered, print the routes
// app.ready().then(() => {
//   console.log(app.printRoutes())
// })

// Start the server
app.listen({ host, port }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
