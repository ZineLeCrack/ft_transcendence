import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function blockRoutes(fastify: FastifyInstance) {

	fastify.post('/isblock', async (request, reply) => {
	const { target } = request.body as { target: string };

	if (!target) {
		reply.status(400).send({ exists: false, error: "Missing username or target" });
		return ;
	}

	try {
		const db = await getDb_user();
		let userID;
		try {
			const token = request.cookies.accessToken!;  
			const decoded = jwt.verify(token, JWT_SECRET);
			userID = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('invalid token');
			return;
		}
		const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
		if (!userID || !targetUserID) {
			reply.send({ status: 0 });
			return ;
		}
		const block = await db.get(
		'SELECT blocked FROM block WHERE id_player1 = ? AND id_player2 = ?',
		[userID, targetUserID.id]
		);
		reply.send({ status: block ? block.blocked : 0 });
	} catch (err) {
		console.error("DB error:", err);
		reply.status(500).send({ exists: false, error: "Internal server error" });
	}
	});

	fastify.post('/blockplayer', async (request, reply) => {
		const { target } = request.body as { target: string };

		if (!target) {
			reply.status(400).send({ exists: false, error: "Missing username or target" });
			return ;
		}

		let userID;
		try {
			const db = await getDb_user();
			try {
				const token = request.cookies.accessToken!;  
				const decoded = jwt.verify(token, JWT_SECRET);
				userID = (decoded as { userId: string }).userId;
			} catch (err)
			{
				reply.status(401).send('invalid token');
				return;
			}
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
				reply.send({ success: false, error: "User not found" });
				return ;
			}
			await db.run(
				`INSERT INTO block (id_player1, id_player2, blocked) VALUES (?, ?, 1)
				ON CONFLICT(id_player1, id_player2) DO UPDATE SET blocked=1`,
				[userID, targetUserID.id]
			);
			await db.run(
			`UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
			[userID, targetUserID.id, targetUserID.id, userID]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, error: "Internal server error" });
		}
	});

	fastify.post('/unblockplayer', async (request, reply) => {
	const { target } = request.body as { target: string };

	if (!target) {
		reply.status(400).send({ exists: false, error: "Missing username or target" });
		return ;
		}
		let userID;
		try {
			const db = await getDb_user();
			try {
				const token = request.cookies.accessToken!;  
				const decoded = jwt.verify(token, JWT_SECRET);
				userID = (decoded as { userId: string }).userId;
			} catch
			{
				reply.status(401).send('invalid token');
				return;
			}
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
			reply.send({ success: false, error: "User not found" });
			return ;
			}
			await db.run(
			`INSERT INTO block (id_player1, id_player2, blocked) VALUES (?, ?, 0)
			ON CONFLICT(id_player1, id_player2) DO UPDATE SET blocked=0`,
			[userID, targetUserID.id]
			);
			await db.run(
			`UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
			[userID, targetUserID.id, targetUserID.id, userID]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, error: "Internal server error" });
		}
	});
}
