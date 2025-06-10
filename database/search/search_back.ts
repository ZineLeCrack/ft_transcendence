import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function searchRoutes(fastify: FastifyInstance) {
	fastify.post('/search', async (request, reply) => {
		const { username } = request.body as { username: string };

		if (!username) {
			reply.status(400).send({ exists: false, error: "No username provided" });
			return;
		}

		try {
			const db = await getDb_user();
			const user = await db.get(`SELECT * FROM users WHERE name = ?`, [username]);
			
			const exists = user;
			reply.status(200).send({ exists });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, error: "Internal server error" });
		}
	});
}
