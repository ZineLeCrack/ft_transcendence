import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

export default async function joinTournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/join', async (request, reply) => {
		const { id_tournament, id_user, password } = request.body as { id_tournament: string, id_user: string, password: string | null };

		try {
			const db = await getDb_tournaments();
			const tournament = await db.get(`SELECT * FROM tournaments WHERE id=?`,
			[id_tournament]
			);

			if (tournament.players === tournament.players_max)
			{
				reply.status(500).send('This tournament is full !');
				return ;
			}

			if (tournament.type === 'private' && password !== tournament.password)
			{
				reply.status(500).send('Wrong password !');
				return ;
			}

			const playerSlot = 'player' + (parseInt(tournament.players) + 1).toString();

			db.run(
				`UPDATE tournaments SET ${playerSlot} = ?, players = players + 1 WHERE id = ?`,
				[id_user, id_tournament]
			);

			reply.status(200);
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
