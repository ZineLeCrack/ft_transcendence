import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/isfriend', async (request, reply) => {
    const { username, target } = request.body as { username: string, target: string };

    if (!username || !target) {
      reply.status(400).send({ exists: false, error: "Missing username or target" });
      return;
    }

    try {
      const db = await getDb_user();
      const userID = await db.get('SELECT id FROM users WHERE name = ?', [username]);
      const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
      if (!userID || !targetUserID) {
        reply.send({ status: 0 });
        return;
      }
      const friend = await db.get(
        'SELECT friend FROM friend WHERE id_player1 = ? AND id_player2 = ?',
        [userID.id, targetUserID.id]
      );
      reply.send({ status: friend ? friend.friend : 0 });
    } catch (err) {
      console.error("DB error:", err);
      reply.status(500).send({ exists: false, error: "Internal server error" });
    }
});
}