import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function postResultsRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/results', async (request, reply) => {
		const { winner, loser, pos1, pos2, tournamentId } = request.body as {
			winner: string,
			loser: string,
			pos1: string,
			pos2: string,
			tournamentId: string
		};

		try {
			const db = await getDb_tournaments();
			const query = `UPDATE result SET ${pos1} = ?, ${pos2} = ? WHERE id = ?`;
			console.log(query);
			await db.run(query, [winner, loser, tournamentId]);
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
