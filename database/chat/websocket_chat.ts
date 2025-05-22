import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import { getDb_chat } from '../database.js';

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
				const { username, content } = data;

				if (!username || !content) return;

				const db = await getDb_chat();
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
