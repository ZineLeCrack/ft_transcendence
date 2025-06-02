// game_router.ts
import { FastifyInstance } from 'fastify';
import { GameInstance } from './multiplayer.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

const games = new Map<string, GameInstance>();

function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

export default async function gameRouter(fastify: FastifyInstance) {

	fastify.post('/start', async (request, reply) => {
		const { token } = request.body as { token: string};
		let userId;
		let userName;
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
			userName = (decoded as {name: string}).name;
		} 
		catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}
		for (const [id, game] of games) {
			if (game.player1.id === userId)
			{
				console.log(`🎮 Game join : ${id}`);
				reply.send({ gameId: id, player: "player1" });
				return ;
			}
			else if (game.player2.id === userId)
			{
				console.log(`🎮 Game join : ${id}`);
				reply.send({ gameId: id, player: "player2" });
				return ;
			}
			else if (!game.full) {
				game.full = true;
				game.player2.id = userId;
				game.player2.name = userName;
				game.message = "";
				game.startGame();
				console.log(`🎮 Game join : ${id}`);
				reply.send({ gameId: id, player: "player2" });
				return ;
			}
		}
		const id = generateGameId();
		const game = new GameInstance(id, userId, userName);
		games.set(id, game);
		console.log(`🎮 Game created : ${id}`);
		reply.send({ gameId: id, player: "player1" });
	});

	fastify.post('/:id/end', (request, reply) => {
		const { id } = request.body as { id: string };
		const gameStat = {
			Id1: games.get(id)?.player1.id,
			Id2: games.get(id)?.player2.id,
			score1: games.get(id)?.leftScore,
			score2: games.get(id)?.rightScore,
		}
		games.get(id)?.stop();
		games.delete(id);
		console.log(`🎮 Game close : ${id}`);
		reply.status(200).send(gameStat);
	})

	fastify.get('/:id/state', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		reply.send(game.getState());
	});

	fastify.post('/:id/start', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		game.startGame();
		reply.status(200).send({ status: "started" });
	});

	fastify.post('/:id/player1move', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		const body = request.body as { keys: any };
		game.move_left(body.keys);
		reply.status(200).send({ status: "ok" });
	});

	fastify.post('/:id/player2move', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		const body = request.body as { keys: any };
		game.move_right(body.keys);
		reply.status(200).send({ status: "ok" });
	});
}
