import { FastifyInstance } from 'fastify';
import { getDb_chat, getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function privateGameRoutes(fastify: FastifyInstance) {

	fastify.post('/reply-pong', async (_request, reply) => {
		const { token, target, answer } = _request.body as { token: string, target: string, answer: number };
		try {
			const dbChat = await getDb_chat();
			const dbUser = await getDb_user();
			
			const decoded = jwt.verify(token, JWT_SECRET);
			let id_user = (decoded as { userId: string }).userId;
		
			const user = await dbUser.get("SELECT name FROM users WHERE id = ?", [id_user]);

			if (answer === 1) {
				await dbChat.run("UPDATE privatechat SET pongRequest = 2 WHERE username1 = ? AND username2 = ? AND pongRequest = 1",
					[target, user.name]);
			}
			else {
				await dbChat.run("UPDATE privatechat SET pongRequest = 3 WHERE username1 = ? AND username2 = ? AND pongRequest = 1",
					[target, user.name]);
			}
		return reply.send({ status: "ok" });
		
		} catch (err) {
			console.error(err);
			reply.status(500).send('Server error');
		}
	});
}