import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function startTournamentsRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/start', async (request, reply) => {
		try {
			const { id } = request.body as { id: number };
			const db = await getDb_tournaments();
			const data = await db.get(
				`SELECT player1, player2, player3, player4, player5, player6, player7, player8 FROM tournaments WHERE id = ?`,
				[id]
			);
			reply.status(200).send(data);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
}
