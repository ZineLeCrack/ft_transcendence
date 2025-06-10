import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function addhistoryRoutes(fastify: FastifyInstance) {
	fastify.post('/addhistory', async (request, reply) => {
		const { Id1, Id2, score1, score2, tournament } = request.body as { Id1: string, Id2: string, score1: number, score2: number, tournament: boolean };


		try {

			let tournament_bool;
			if (!tournament)
			{
				tournament_bool = 0;
			}
			else 
			{
				tournament_bool = 1;
			}
			const db = await getDb_user();
			await db.run(
				`
				INSERT INTO history (id_player1, id_player2, point_player1, point_player2, tournament) values (?, ?, ?, ?, ?);
				`,
				[Id1, Id2, score1, score2 , tournament_bool]
			);

			await db.run(
				`
				UPDATE stats SET games_played = games_played + 1, wins = wins + 1, total_points = total_points + 5 WHERE id_player = ?;
				`,
				[score1 === 5 ? Id1 : Id2]
			);

			await db.run(
				`
				UPDATE stats SET games_played = games_played + 1, loses = loses + 1, total_points = total_points + ? WHERE id_player = ?;
				`,
				[score1 === 5 ? score2 : score1, score1 === 5 ? Id2 : Id1]
			);

			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
