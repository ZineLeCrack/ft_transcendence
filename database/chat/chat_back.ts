import { FastifyInstance } from 'fastify';
import { getDb_chat } from '../database.js';

export default async function chatRoutes(fastify: FastifyInstance) {

  fastify.post('/getmessages', async (_request, reply) => {
    try {
      const db = await getDb_chat();
      const messages = await db.all(`SELECT * FROM chat`);
      reply.status(200).send({ tab: messages });
    } catch (err) {
      console.error(err);
      reply.status(500).send('Server error');
    }
  });
}
