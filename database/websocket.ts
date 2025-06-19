import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import { getDb_chat } from './database.js';
import { getDb_user } from './database.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';
const clients = new Set<WebSocket>();

function parseCookies(cookieHeader:any) {
	const cookies:any = {};
	if (!cookieHeader) return cookies;

	const pairs = cookieHeader.split(';');
	for (const pair of pairs) {
		const [name, ...rest] = pair.trim().split('=');
		const value = rest.join('=');
		cookies[name] = decodeURIComponent(value);
	}
	return cookies;
}

export function setupWebSocket(server: any) {
	const wss = new WebSocketServer({ server });

	wss.on('connection', (ws ,req) => {
		const cookies = parseCookies(req.headers.cookie);
		const token = cookies['accessToken'];
		clients.add(ws);

		ws.on('close', () => {
			clients.delete(ws);
		});

		ws.on('message', async (message) => {
			try {
				const data = JSON.parse(message.toString());
				const { type, content, targetUsername, id, pongRequest, next_player1, next_player2, gameId, winner } = data;
				const dbusers = await getDb_user();
				const dbchat = await getDb_chat();
				if (type === 'multi_player_join') {
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, gameId }));
						}
					}
				}
				if (type === 'tournament_end') {
					const winnerName = await dbusers.get(`SELECT name FROM users WHERE id = ?`,[winner]);
					await dbchat.run(
						`
						INSERT INTO chat (username, content, announceTournament, announceTournament_id1, announceTournament_id2) VALUES (?, ?, ?, ?, ?)
						`,
						[winnerName.name, "", 3, winner, id]);
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, id, winner: winnerName.name }));
						}
					}
				}
				if (type === 'new_message') {
					if (!token || !content) return ;

					if (content.length > 512) {
						ws.send(JSON.stringify({type: 'error', message: 'message_too_long'}));
						return ;
					}

					let id_user;
					try {
						const decoded = jwt.verify(token, JWT_SECRET);
						id_user = (decoded as { userId: string }).userId;
					}
					catch (err) {
						console.error(err);
						return ;
					}
					const response = await dbusers.get(`SELECT name FROM users WHERE id = ?`, [id_user]);
					const username = response.name;
					await dbchat.run(
						`INSERT INTO chat (username, content) VALUES (?, ?)`,
						[username, content]
					);

					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, username, content }));
						}
					}
				} else if (type === 'tournament_created') {
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type }));
						}
					}
				} else if (type === 'tournament_new_player') {
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, token, id }));
						}
					}
				} else if (type === 'tournament_next_game') {
					await dbchat.run(
						`INSERT INTO chat (username, content, announceTournament, announceTournament_id1, announceTournament_id2) VALUES (?, ?, ?, ?, ?)`,
						["", "", 2, next_player1, next_player2]);
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, next_player1, next_player2, id }));
						}
					}
				} else if (type === 'new_private_message') {
					if (pongRequest === 1 || pongRequest === 2 || pongRequest === 3)
					{
						if (!token || !targetUsername) return ;
					}
					else
					{
						if (!token || !content || !targetUsername) return ;
					}

					if (content.length > 512) {
						ws.send(JSON.stringify({type: 'error', message: 'message_too_long'}));
						return ;
					}

					let id_user;
					try {
						const decoded = jwt.verify(token, JWT_SECRET);
						id_user = (decoded as { userId: string }).userId;
					}
					catch (err) {
						console.error(err);
						return ;
					}
					const response = await dbusers.get(`SELECT name FROM users WHERE id = ?`,[id_user]);
					const username = response.name;

					const lastInvite = await dbchat.get(`
						SELECT created_at FROM privatechat
						WHERE pongRequest IN (1, 2) AND ((username1 = ? AND username2 = ?) OR (username1 = ? AND username2 = ?))
						ORDER BY created_at DESC LIMIT 1
						`, [username, targetUsername, targetUsername, username]);
					if (pongRequest === 1 && lastInvite) {
						ws.send(JSON.stringify({type: 'error', message: 'cancel_request'}));
						return ;
					}

					if (pongRequest !== 2 && pongRequest !== 3)
					{
						await dbchat.run(
						`INSERT INTO privatechat (username1, username2, content, pongRequest) VALUES (?, ?, ?, ?)`,
						[username, targetUsername, content, pongRequest]
						);
					}

					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({ type, username, targetUsername , content, pongRequest }));
						}
					}
				}
				else if (type === 'add_friend' || type === 'remove_friend' || type === 'decline_friend' || type === 'accept_friend' || type === 'block_users' || type === 'unblock_users')
				{
					let id_user;
					try {
						const decoded = jwt.verify(token, JWT_SECRET);
						id_user = (decoded as { userId: string }).userId;
					}
					catch (err) {
						console.error(err);
						return ;
					}
					const response = await dbusers.get(`SELECT name FROM users WHERE id = ?`,[id_user]);
					const username = response.name;
					for (const client of clients) {
						if (client.readyState === ws.OPEN) {
							client.send(JSON.stringify({type, username, targetUsername}));
						}
					}
				}
			}
			catch (err)
			{
				console.error('Erreur WebSocket :', err);
			}
		});
	});
}
