import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function addhistoryRoutes(fastify: FastifyInstance) {
  fastify.post('/addhistory', async (request, reply) => {
    const { Id1, Id2, score1, score2 } = request.body as { Id1: number, Id2: number, score1: number, score2: number };

    try {
      const db = await getDb_user();
      const rows = await db.all(
        `
        INSERT INTO history (id_player1, id_player2, point_player1, point_player2, game_date) values (?, ?, ?, ?, '27/05/25 17:48');
        `,
        [Id1, Id2, score1, score2] // DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATE AAAAAA CHANGEEEEEEEEEEEEEEEEEEEEEEEEEER
      );
      reply.send({ success: true });
    } catch (err) {
      console.error(err);
      reply.status(500).send('Error');
    }
  });
}
