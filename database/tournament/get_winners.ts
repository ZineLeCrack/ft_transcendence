import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function getWinnersATournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/get_winners', async (request, reply) => {
		const { tournamentId } = request.body as { tournamentId: string };

		try {
			const db = await getDb_tournaments();
			const players = await db.get(
				`SELECT winner1, loser1, winner2, loser2, winner3, loser3, winner4, loser4,
				winner1_semifinals, loser1_semifinals, winner2_semifinals, loser2_semifinals, winner_final, loser_final
				FROM result JOIN tournaments ON result.id = tournaments.id WHERE tournaments.id = ?`,
				[tournamentId]
			);

			if (!players)
			{
				reply.status(500);
				return ;
			}

			else
			{
				reply.status(200).send(players);
				return ;
			}
		} catch (err) {
			console.error('DB error: ', err);
			reply.status(500).send({ error: 'Internal server error' });
		}
	});
}