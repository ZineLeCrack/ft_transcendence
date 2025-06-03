import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function historyRoutes(fastify: FastifyInstance) {
  fastify.post('/history', async (request, reply) => {
    const { userId } = request.body as { userId: string };

    try {
      const db = await getDb_user();
      const rows = await db.all(
        `
        SELECT h.point_player1, h.point_player2, h.game_date,
               u1.name AS usernameplayer1, u2.name AS usernameplayer2
        FROM history h
        JOIN users u1 ON h.id_player1 = u1.id
        JOIN users u2 ON h.id_player2 = u2.id
        WHERE u1.id = ? OR u2.id = ?
        ORDER BY h.game_date DESC
        `,
        [userId, userId]
      );
      const formatted = rows.map((row: any) => ({
        imageplayer1: "/images/pdp_cle-berr.png",
        imageplayer2: "/images/pdp_rlebaill.jpeg",
        usernameplayer1: row.usernameplayer1,
        usernameplayer2: row.usernameplayer2,
        pointplayer1: row.point_player1,
        pointplayer2: row.point_player2,
        date: row.game_date,
      }));

      reply.send(formatted);
    } catch (err) {
      console.error(err);
      reply.status(500).send('Error');
    }
  });
}
