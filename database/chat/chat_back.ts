import { FastifyInstance } from 'fastify';
import { getDb_chat } from '../database.js';

export default async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/sendinfo', async (request, reply) => {
    const { username, content } = request.body as { username: string, content: string };

    if (!username || !content) {
      reply.status(400).send('Incomplete data');
      return;
    }

    try {
      const db = await getDb_chat();
      await db.run(
        `INSERT INTO chat (username, content) VALUES (?, ?)`,
        [username, content]
      );
      reply.status(200).send({ username, content });
    } catch (err) {
      console.error(err);
      reply.status(500).send('Server error');
    }
  });

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
