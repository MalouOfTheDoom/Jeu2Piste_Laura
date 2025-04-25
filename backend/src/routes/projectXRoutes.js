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
  fastify.post('/startProjectX', async (_, reply) => {
    startProjectX()
    reply.send({ success: true })
  })
  fastify.post('/cancelProjectX', async (_, reply) => {
    cancelProjectX()
    reply.send({ success: true })
  })
  fastify.post('/diffuseProjectX', async (request, reply) => {
    const { disarmCode } = request.body // Get the code from the request body

    if (!disarmCode) {
      return reply
        .status(400)
        .send({ success: false, message: 'Code de désactivation non fourni (∩˃o˂∩)★' })
    }

    const isDisarmed = diffuseProjectX(disarmCode) // Pass the code to the diffuseProjectX function

    if (isDisarmed) {
      return reply.send({ success: true, message: 'Bombes désactivées 😡' })
    } else {
      return reply.status(400).send({ success: false, message: 'Code incorrect ( ͡° ͜ʖ ͡°)' })
    }
  })
}
