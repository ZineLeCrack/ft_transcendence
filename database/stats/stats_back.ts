import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function StatsRoutes(fastify: FastifyInstance) {
	fastify.post('/stats', async (request, reply) => {
		const { userId } = request.body as { userId: string };

		try {
			const db = await getDb_user();
			const stats = await db.get(`SELECT * FROM stats WHERE id_player = ?;`,[userId]);
			
			reply.send(stats);
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
