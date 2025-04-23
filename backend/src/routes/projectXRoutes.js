import {
  cancelProjectX,
  diffuseProjectX,
  getProjectXInfos,
  startProjectX,
} from '../projectXState.js'

export async function projectXRoutes(fastify) {
  fastify.get('/checkProjectXInfos', async (_, reply) => {
    return getProjectXInfos()
  })
  fastify.post('/apistartProjectX', async (_, reply) => {
    startProjectX()
    reply.send({ success: true })
  })
  fastify.post('/cancelProjectX', async (_, reply) => {
    cancelProjectX()
    reply.send({ success: true })
  })
  fastify.post('/diffuseProjectX', async (_, reply) => {
    diffuseProjectX()
    reply.send({ success: true })
  })
}
