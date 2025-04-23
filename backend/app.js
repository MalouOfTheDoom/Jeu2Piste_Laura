const path = require('path')
const fastify = require('fastify')({ logger: true })
const fastifyStatic = require('@fastify/static')

// Détermine l'environnement
const port = process.env.PORT || 3000
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`

// Sert les fichiers statiques du frontend
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend/dist'),
  prefix: '/', // toutes les routes statiques sont accessibles à partir de /
  index: false, // pour qu'on contrôle la route /
})

// Route pour servir le frontend
fastify.get('/', (req, reply) => {
  reply.sendFile('index.html') // Fichier principal à retourner
})

// Catch-all pour les routes SPA (si le fichier n'existe pas)
fastify.setNotFoundHandler((request, reply) => {
  if (request.raw.method === 'GET' && !request.url.startsWith('/api')) {
    return reply.sendFile('index.html') // sert index.html pour toute route non reconnue
  }
  reply.status(404).send({ error: 'Not Found' })
})

// Lance le serveur
fastify.listen({ host, port }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
