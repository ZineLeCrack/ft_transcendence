import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';

interface TournamentItem {
	id: number;
	name: string;
	players: number;
	maxPlayers: number;
	type: 'public' | 'private';
}

export default async function listTournamentsRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/list', async (request, reply) => {
		try {
			const db = await getDb_tournaments();
			const rows = await db.all(`SELECT * FROM tournaments;`);
			const tournaments: TournamentItem[] = rows.map((row: any) => ({
				id: row.id,
				name: row.name,
				players: row.players,
				maxPlayers: row.maxPlayers,
				type: row.type,
			}));
			reply.send({ tournaments });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
