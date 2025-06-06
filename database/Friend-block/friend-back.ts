import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';
let userID: string;

export default async function friendRoutes(fastify: FastifyInstance) {
	fastify.post('/isfriend', async (request, reply) => {
		const { tokenID, target } = request.body as { tokenID: string, target: string };

		if (!tokenID || !target) {
			reply.status(400).send({ exists: false, error: "Missing username or target" });
			return;
		}
			
		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			userID = (decoded as { userId: string }).userId;
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
				reply.send({ status: 0 });
				return;
			}
			const friend = await db.get(
				'SELECT friend FROM friend WHERE id_player1 = ? AND id_player2 = ?',
				[userID, targetUserID.id]
			);
			reply.send({ status: friend ? friend.friend : 0 });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, err });
		}
	});
	
	fastify.post('/requestfriend', async (request, reply) => {
		const { tokenID, target } = request.body as { tokenID: string, target: string };

		if (!tokenID || !target) {
			reply.status(400).send({ exists: false, error: "Missing username or target" });
			return;
		}

		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			userID = (decoded as { userId: string }).userId;
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
				reply.send({ success: false, error: "User not found" });
				return;
			}
			await db.run(
				`INSERT INTO friend (id_player1, id_player2, friend) VALUES (?, ?, 2)
				 ON CONFLICT(id_player1, id_player2) DO UPDATE SET friend=2`,
				[userID, targetUserID.id]
			);
			await db.run(
				`INSERT INTO friend (id_player1, id_player2, friend) VALUES (?, ?, 3)
				 ON CONFLICT(id_player1, id_player2) DO UPDATE SET friend=3`,
				[targetUserID.id, userID]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, error: "Internal server error" });
		}
	});

	fastify.post('/replyrequest', async (request, reply) => {
		const { tokenID, target, answer } = request.body as { tokenID: string, target: string, answer: number };

		if (!tokenID || !target || typeof answer !== 'number') {
			reply.status(400).send({ exists: false, error: "Missing username, target or answer" });
			return;
		}

		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			userID = (decoded as { userId: string }).userId;
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
				reply.send({ success: false, error: "User not found" });
				return;
			}
			if (answer === 1) {
				await db.run(
					`UPDATE friend SET friend=1 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
					[userID, targetUserID.id, targetUserID.id, userID]
				);
			} else {
				await db.run(
					`UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
					[userID, targetUserID.id, targetUserID.id, userID]
				);
			}
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ exists: false, err });
		}
	});

	fastify.post('/removefriend', async (request, reply) => {
		const { tokenID, target } = request.body as { tokenID: string, target: string };

		if (!tokenID || !target) {
			reply.status(400).send({ success: false, error: "Missing username or target" });
			return;
		}

		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			userID = (decoded as { userId: string }).userId;
			const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
			if (!userID || !targetUserID) {
				reply.send({ success: false, error: "User not found" });
				return;
			}
			await db.run(
				`UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
				[userID, targetUserID.id, targetUserID.id, userID]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ success: false, error: "Internal server error" });
		}
	});

	fastify.post('/getfriends', async (request, reply) => {
		const { tokenID } = request.body as { tokenID: string };

		if (!tokenID) {
			reply.status(400).send({ success: false, error: "Missing token" });
			return;
		}
		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			const userID = (decoded as { userId: string }).userId;

			const friends = await db.all(
				`SELECT u.name as username, u.profile_pic as profilPic, u.status as status
				FROM friend f
				JOIN users u ON u.id = f.id_player2
				WHERE f.id_player1 = ? AND f.friend IN (1, 3)`,
				[userID]
			);



			const friendsWithStatus = friends.map((f: any) => ({
				username: f.username,
				profilPic: f.profilPic,
				status: f.status
			}));
			
			reply.send({ friends: friendsWithStatus });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ success: false, error: "Internal server error" });
		}
	});
	fastify.post('/setstatus', async (request, reply) => {
		const { tokenID, status } = request.body as { tokenID: string, status: string }
		
		if (!tokenID || !status) {
			reply.status(400).send({ success: false, error: "Missing token or status" });
			return;
		}
		try {
			const db = await getDb_user();
			const decoded = jwt.verify(tokenID, JWT_SECRET);
			const userID = (decoded as { userId: string }).userId;
			if (!userID) {
				reply.status(400).send({ success: false, error: "Invalid token" });
				return;
			}
			await db.run(
				`UPDATE users SET status = ? WHERE id = ?`,
				[status, userID]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error("DB error:", err);
			reply.status(500).send({ success: false, err });
		}
	});
}