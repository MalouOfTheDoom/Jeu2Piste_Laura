import {
  cancelProjectX,
  diffuseProjectX,
  getProjectXInfos,
  startProjectX,
} from '../projectXState.js'

export async function projectXRoutes(fastify) {
  fastify.get('/api/checkProjectXInfos', async (_, reply) => {
    return getProjectXInfos()
  })
  fastify.post('/api/startProjectX', async (_, reply) => {
    startProjectX()
    reply.send({ success: true })
  })
  fastify.post('/api/cancelProjectX', async (_, reply) => {
    cancelProjectX()
    reply.send({ success: true })
  })
  fastify.post('/api/diffuseProjectX', async (_, reply) => {
    diffuseProjectX()
    reply.send({ success: true })
  })
}
