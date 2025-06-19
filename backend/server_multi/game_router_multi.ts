import { FastifyInstance } from 'fastify';
import { GameInstance } from './multiplayer.js';
import jwt from 'jsonwebtoken';
import { getDb_user} from "../database";
import { request } from 'http';
import { response } from 'express';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export const games = new Map<string, GameInstance>();

export function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

export default async function gameRouter(fastify: FastifyInstance) {
	fastify.post('/start', async (request, reply) => {

		let userId;
		let userName;
		const db = await getDb_user();
		try {
			const token = request.cookies.accessToken!;  
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
			const result = await db.get(`SELECT name FROM users WHERE id = ?`, [userId]);
			userName = result.name;
		}
		catch (err) {
			reply.status(401).send('Invalid token or database error');
			return ;
		}

		for (const [id, game] of games) {
			if (!game.private && game.player1.id === userId) {
				reply.send({ gameId: id, player: "player1" });
				return ;
			} else if (!game.private && game.player2.id === userId) {
				reply.send({ gameId: id, player: "player2" });
				return ;
			} else if (!game.private && !game.full) {
				game.full = true;
				game.player2.id = userId;
				game.player2.name = userName;
				game.message = "";
				game.startGame();
				reply.send({ gameId: id, player: "player2" });
				return ;
			}
		}
		const id = generateGameId();
		const game = new GameInstance(id, userId, userName, false, '');
		games.set(id, game);
		reply.send({ gameId: id, player: "player1" });
	});

	fastify.post('/:id/end', async (request, reply) => {
		const { id } = request.body as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send(`Game not found`);
			return ;
		}

		const gameStat = {
			Id1: game.player1.id,
			Id2: game.player2.id,
			score1: game.leftScore,
			score2: game.rightScore,
		}

		game.stop();
		games.delete(id);

		if (game.tournamentId !== '') {
			reply.status(200).send({
				...gameStat,
				tournament: true,
				tournamentId: game.tournamentId
			});
		} else if (game.private) {
			reply.status(200).send({ ...gameStat, username1: game.player1.name, username2: game.player2.name, private: true });
		} else {
			reply.status(200).send({ ...gameStat, private: false });
		}
	});

	fastify.get('/:id/state', async (request, reply) => {
		const { id } = request.params as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send({ error: "Game not found" });
			return ;
		}

		reply.send(game.getState());
	});

	fastify.post('/:id/start', async (request, reply) => {
		const { id } = request.params as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send({ error: "Game not found" });
			return ;
		}

		game.startGame();
		reply.status(200).send({ status: "started" });
	});

	fastify.post('/:id/player1move', async (request, reply) => {
		const { id } = request.params as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send({ error: "Game not found" });
			return ;
		}

		const body = request.body as { keys: any };
		game.move_left(body.keys);
		reply.status(200).send({ success: true });
	});

	fastify.post('/:id/player2move', async (request, reply) => {
		const { id } = request.params as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send({ error: "Game not found" });
			return ;
		}

		const body = request.body as { keys: any };
		game.move_right(body.keys);
		reply.status(200).send({ success: true });
	});

	fastify.post('/:id/getname', async (request, reply) => {
		const { id } = request.params as { id: string };

		const game = games.get(id);

		if (!game) {
			reply.status(404).send({ error: "Game not found" });
			return ;
		}

		const Name = game.getName();
		reply.status(200).send(Name);
	});

	fastify.post('/private/create', async (request, reply) => {
		const {target } = request.body as {target: string };

		let userId;

		try {
			const token = request.cookies.accessToken!;  
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return ;
		}

		const id = generateGameId();
		const game = new GameInstance(id, '', '', true, '');
		game.player1.id = userId;
		game.player2.id = target;
		games.set(id, game);
		reply.status(200).send({ gameId: id });
	});

	fastify.post('/private/join', async (request, reply) => {
		let userId, userName;
		const db = await getDb_user();
		try {
			const token = request.cookies.accessToken!;  
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
			const result = await db.get(`SELECT name FROM users WHERE id = ?`, [userId]);
			userName = result.name;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return ;
		}

		for (const [id, game] of games) {
			if (game.private && game.player1.id.toString() === userId.toString()) {
				game.player1.name = userName;
				if (game.player2.name !== '') {
					game.full = true;
					game.startGame();
				}
				reply.status(200).send({ gameId: id, player: 'player1' });
				return ;
			} else if (game.private && game.player2.id.toString() === userId.toString()) {
				game.player2.name = userName;
				if (game.player1.name !== '') {
					game.full = true;
					game.startGame();
				}
				reply.status(200).send({ gameId: id, player: 'player2' });
				return ;
			}
		}
		reply.status(404).send('Game not found');
	});

	fastify.post('/which_player', async (request, reply) => {
		const {gameId } = request.body as {gameId: string };
		const game = games.get(gameId.toString());

		if (!game) {
			reply.status(404).send('Game not found');
			return ;
		}

		let userId;

		try {
			const token = request.cookies.accessToken!;  
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return ;
		}

		if (game.player1.id.toString() === userId.toString()) {
			reply.status(200).send({ player: 'player1' });
			return ;
		} else if (game.player2.id.toString() === userId.toString()) {
			reply.status(200).send({ player: 'player2' });
			return ;
		}

		reply.status(401).send('Player not in the game');
	});

	fastify.post('/disconnection', async (request, reply) => {
		const { gameId } = request.body as { gameId: string };

		const game = games.get(gameId.toString());

		if (!game) {
			reply.status(404).send('Game not found');
			return ;
		}

		if (!game.full) {
			game.stop();
			games.delete(gameId.toString());
			reply.status(200).send({ success: true });
			return ;
		}

		reply.status(200).send({ success: true });
	});
}
