import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function createTournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/create', async (request, reply) => {
		const { name, players_max, type } = request.body as { name: string, players_max: number, type: string };

		try {
			const db = await getDb_tournaments();
			await db.run(
				`
				INSERT INTO tournaments (name, players_max, type) values (?, ?, ?);
				`,
				[name, players_max, type]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
