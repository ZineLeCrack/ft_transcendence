import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function StatsRoutes(fastify: FastifyInstance) {
	fastify.post('/stats', async (request, reply) => {
		const { username } = request.body as { username: string };

		try {
			const db = await getDb_user();
			const token = request.cookies.accessToken!;
			const decoded = jwt.verify(token, JWT_SECRET);
			let ID;

			if (username) {
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
			const stats = await db.get(`SELECT * FROM stats WHERE id_player = ?;`,[ID]);

			reply.send(stats);
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
