import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function getPlayersATournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/get_players', async (request, reply) => {
		const { tournamentId } = request.body as { tournamentId: string };

		try {
			const db = await getDb_tournaments();
			const players = await db.get(
				`SELECT player1, player2, player3, player4, player5, player6, player7, player8
				FROM tournaments WHERE id = ?`,
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
