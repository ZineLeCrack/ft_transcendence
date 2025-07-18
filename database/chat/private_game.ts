import { FastifyInstance } from 'fastify';
import { getDb_chat, getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function privateGameRoutes(fastify: FastifyInstance) {
	fastify.post('/reply-pong', async (_request, reply) => {
		const { target, answer } = _request.body as { target: string, answer: number };
		let id_user;
		try {
			const dbChat = await getDb_chat();
			const dbUser = await getDb_user();
			try {
				const token = _request.cookies.accessToken!;
				const decoded = jwt.verify(token, JWT_SECRET);
				id_user = (decoded as { userId: string }).userId;
			} catch (err)
			{
				reply.status(401).send('invalid token');
				return;
			}
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

	fastify.post('/end', async (request, reply) => {
		const playerNames = request.body as { username1: string, username2: string };

		try {
			const db = await getDb_chat();

			await db.run(
				`UPDATE privatechat SET pongRequest = 4 WHERE (username1 = ? OR username1 = ?) AND (username2 = ? OR username2 = ?)`,
				[playerNames.username1, playerNames.username2, playerNames.username1, playerNames.username2]
			);

			reply.status(200).send({ success: true });
		} catch (err) {
			reply.status(500).send('DB error');
			return ;
		}
	});
}
