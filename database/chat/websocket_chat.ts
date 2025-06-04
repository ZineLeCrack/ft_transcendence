import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import { getDb_chat } from '../database.js';
import { getDb_user } from '../database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

const clients = new Set<WebSocket>();

export function setupWebSocket(server: any) {
	const wss = new WebSocketServer({ server });

	wss.on('connection', (ws) => {
		console.log('Client connecté via WebSocket');
		clients.add(ws);

		ws.on('close', () => {
			console.log('Client déconnecté');
			clients.delete(ws);
		});

		ws.on('message', async (message) => {
			try {
				const data = JSON.parse(message.toString());
				const { token, content } = data; 

				if (!token || !content) return;
				let id_user;
				try {
					const decoded = jwt.verify(token, JWT_SECRET);
					id_user = (decoded as { userId: string }).userId;
				}
				catch (err) {
					console.log(err);
					return;
				}
				const dbusers = await getDb_user();
				const db = await getDb_chat();
				const response = await dbusers.get(`SELECT name FROM users WHERE id = ?`,[id_user]);
				const username = response.name;
				await db.run(
					`INSERT INTO chat (username, content) VALUES (?, ?)`,
					[username, content]
				);

				for (const client of clients) {
					if (client.readyState === ws.OPEN) {
						client.send(JSON.stringify({ username, content }));
					}
				}
			} catch (err) {
				console.error('Erreur WebSocket :', err);
			}
		});
	});
}
