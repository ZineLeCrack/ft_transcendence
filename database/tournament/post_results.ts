import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';
import { getDb_user } from '../database.js';

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
			await db.run(query, [winner, loser, tournamentId]);

			const db_user = await getDb_user();
			await db_user.run(
				`UPDATE stats SET tournaments_played = tournaments_played + 1, tournaments_lose = tournaments_lose + 1 WHERE id_player = ?`
				, [loser]);
			if (pos1 === 'winner_final') {
				await db_user.run(
					`UPDATE stats SET tournaments_played = tournaments_played + 1, tournaments_win = tournaments_win + 1 WHERE id_player = ?`
					, [winner]);
				setTimeout(async () => {
					await db.run(`DELETE FROM tournaments WHERE id = ?`, [tournamentId]);
					await db.run(`DELETE FROM result WHERE id = ?`, [tournamentId]);
				}, 5000);
			}
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
