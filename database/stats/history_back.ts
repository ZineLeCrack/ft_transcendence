import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function historyRoutes(fastify: FastifyInstance) {
	fastify.post('/history', async (request, reply) => {
		const { username } = request.body as { username: string};

		try {
			const db = await getDb_user();
			const token = request.cookies.accessToken!;
			const decoded = jwt.verify(token, JWT_SECRET);
			let ID;

			if (username)
			{
				const name = await db.get(`SELECT * FROM users WHERE name = ?`, [username])
				if (!name)
				{
					reply.status(404).send('This user doesn\'t exist');
					return ;
				}
				ID = name.id;
			}

			if (!ID) {
				ID = (decoded as { userId: string }).userId;
			}
			const rows = await db.all(
			`
				SELECT
					history.point_player1,
					history.point_player2,
					history.game_date,
					history.tournament,
					history.tournamentId,
					u1.name AS usernameplayer1,
					u2.name AS usernameplayer2
				FROM history
				JOIN users u1 ON history.id_player1 = u1.id
				JOIN users u2 ON history.id_player2 = u2.id
				WHERE u1.id = ? OR u2.id = ?
				ORDER BY history.game_date DESC
			`,
			[ID, ID]
		);
			const formatted = rows.map((row: any) => ({
				usernameplayer1: row.usernameplayer1,
				usernameplayer2: row.usernameplayer2,
				pointplayer1: row.point_player1,
				pointplayer2: row.point_player2,
				tournament: row.tournament,
				tournamentId: row.tournamentId,
				date: row.game_date,
			}));

			reply.send(formatted);
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
