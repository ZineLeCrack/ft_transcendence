import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function createTournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/create', async (request, reply) => {
		const { name, players_max, type, password } = request.body as { name: string, players_max: number, type: string, password: string | null };

		try {
			const db = await getDb_tournaments();
			const result = await db.run(
				`INSERT INTO tournaments (name, type, password) VALUES (?, ?, ?)`,
				[name, type, password]
			);
			const tournamentId = result.lastID;
			await db.run(
				`INSERT INTO result (id) VALUES (?)`,
				[tournamentId]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
