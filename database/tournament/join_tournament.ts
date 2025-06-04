import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function joinTournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/join', async (request, reply) => {
		const { id_tournament, token, password } = request.body as { id_tournament: string, token: string, password: string | null };

		try {
			const db = await getDb_tournaments();
			const tournament = await db.get(`SELECT * FROM tournaments WHERE id = ?`,
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

			let userId;
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userId = (decoded as { userId: string }).userId;
			}
			catch (err) {
				reply.status(401).send(`Invalid token: ${err}`);
				return ;
			}

			await db.run(
				`UPDATE tournaments SET ${playerSlot} = ?, players = players + 1 WHERE id = ?`,
				[userId, id_tournament]
			);

			const players = await db.get(
				`SELECT players_max, players FROM tournaments WHERE id = ?`,
				[id_tournament]
			);

			let full;
			if (players.players_max === players.players) {
				full = true;
			}
			else {
				full = false;
			}

			reply.status(200).send({ full: full, id: id_tournament });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
