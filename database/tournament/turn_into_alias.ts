import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function turnIntoAliasRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/turn_into_alias', async (request, reply) => {
		const tournamentData =
		request.body as {
			player1: string,
			player2: string,
			player3: string,
			player4: string,
			player5: string,
			player6: string,
			player7: string,
			player8: string,
			winner1: string,
			loser1: string,
			winner2: string,
			loser2: string,
			winner3: string,
			loser3: string,
			winner4: string,
			loser4: string,
			winner1_semifinals: string,
			loser1_semifinals: string,
			winner2_semifinals: string,
			loser2_semifinals: string,
			winner_final: string,
			loser_final: string
		};

		try {
			const db = await getDb_user();

			for (const [key, value] of Object.entries(tournamentData) as [keyof typeof tournamentData, string][]) {
				if (value === '?')
					continue ;
				const result = await db.get(`SELECT aliastournament FROM users WHERE id = ?`, [value]);
				if (result.aliastournament && result.aliastournament !== '') {
					tournamentData[key] = result.aliastournament;
				}
				else {
					const name = await db.get(`SELECT name FROM	users WHERE id = ?`, [value]);
					tournamentData[key] = name.name;
				}
			}
			reply.status(200).send(tournamentData);
		} catch (err) {
			console.error('DB error: ', err);
			reply.status(500).send({ error: 'Internal server error' });
		}
	});
}
