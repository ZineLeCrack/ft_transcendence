import { FastifyInstance } from 'fastify';
import { getDb_tournaments } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function isInATournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament/is_in', async (request, reply) => {
		const { token } = request.body as { token: string };

		let name: string;

		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			name = (decoded as { name: string }).name;
		}
		catch (err) {
			reply.status(401).send(`Invalid token: ${err}`);
			return ;
		}

		try {
			const db = await getDb_tournaments();
			const tournament = await db.get(
				`SELECT * FROM tournaments WHERE player1 = ? OR player2 = ? OR player3 = ? OR player4 = ? OR player5 = ? OR player6 = ? OR player7 = ? OR player8 = ?`,
				[name, name, name, name, name, name, name, name]
			);

			if (!tournament)
			{
				reply.status(200).send({ tournamentId: '0' });
				return ;
			}

			else
			{
				reply.status(200).send({ tournamentId: tournament.id });
				return ;
			}
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}
