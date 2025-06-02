import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database.js';

export default async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/isfriend', async (request, reply) => {
    const { username, target } = request.body as { username: string, target: string };

    if (!username || !target) {
      reply.status(400).send({ exists: false, error: "Missing username or target" });
      return;
    }

    try {
      const db = await getDb_user();
      const userID = await db.get('SELECT id FROM users WHERE name = ?', [username]);
      const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
      if (!userID || !targetUserID) {
        reply.send({ status: 0 });
        return;
      }
      const friend = await db.get(
        'SELECT friend FROM friend WHERE id_player1 = ? AND id_player2 = ?',
        [userID.id, targetUserID.id]
      );
      reply.send({ status: friend ? friend.friend : 0 });
    } catch (err) {
      console.error("DB error:", err);
      reply.status(500).send({ exists: false, error: "Internal server error" });
    }
  });
  fastify.post('/requestfriend', async (request, reply) => {
    const { username, target } = request.body as { username: string, target: string };

    if (!username || !target) {
      reply.status(400).send({ exists: false, error: "Missing username or target" });
      return;
    }

    try {
      const db = await getDb_user();
      const userID = await db.get('SELECT id FROM users WHERE name = ?', [username]);
      const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
      if (!userID || !targetUserID) {
        reply.send({ success: false, error: "User not found" });
        return;
      }
      await db.run(
        `INSERT INTO friend (id_player1, id_player2, friend) VALUES (?, ?, 2)
         ON CONFLICT(id_player1, id_player2) DO UPDATE SET friend=2`,
        [userID.id, targetUserID.id]
      );
      await db.run(
        `INSERT INTO friend (id_player1, id_player2, friend) VALUES (?, ?, 3)
         ON CONFLICT(id_player1, id_player2) DO UPDATE SET friend=3`,
        [targetUserID.id, userID.id]
      );
      reply.send({ success: true });
    } catch (err) {
      console.error("DB error:", err);
      reply.status(500).send({ exists: false, error: "Internal server error" });
    }
  });
  fastify.post('/answerrequest', async (request, reply) => {
    const { username, target, answer } = request.body as { username: string, target: string, answer: number };

    if (!username || !target || typeof answer !== 'number') {
      reply.status(400).send({ exists: false, error: "Missing username, target or answer" });
      return;
    }

    try {
      const db = await getDb_user();
      const userID = await db.get('SELECT id FROM users WHERE name = ?', [username]);
      const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
      if (!userID || !targetUserID) {
        reply.send({ success: false, error: "User not found" });
        return;
      }
      if (answer === 1) {
        await db.run(
          `UPDATE friend SET friend=1 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
          [userID.id, targetUserID.id, targetUserID.id, userID.id]
        );
      } else {
        await db.run(
          `UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
          [userID.id, targetUserID.id, targetUserID.id, userID.id]
        );
      }
      reply.send({ success: true });
    } catch (err) {
      console.error("DB error:", err);
      reply.status(500).send({ exists: false, error: "Internal server error" });
    }
  });
  fastify.post('/removefriend', async (request, reply) => {
    const { username, target } = request.body as { username: string, target: string };

    if (!username || !target) {
      reply.status(400).send({ success: false, error: "Missing username or target" });
      return;
    }

    try {
      const db = await getDb_user();
      const userID = await db.get('SELECT id FROM users WHERE name = ?', [username]);
      const targetUserID = await db.get('SELECT id FROM users WHERE name = ?', [target]);
      if (!userID || !targetUserID) {
        reply.send({ success: false, error: "User not found" });
        return;
      }
      await db.run(
        `UPDATE friend SET friend=0 WHERE (id_player1=? AND id_player2=?) OR (id_player1=? AND id_player2=?)`,
        [userID.id, targetUserID.id, targetUserID.id, userID.id]
      );
      reply.send({ success: true });
    } catch (err) {
      console.error("DB error:", err);
      reply.status(500).send({ success: false, error: "Internal server error" });
    }
  });
}