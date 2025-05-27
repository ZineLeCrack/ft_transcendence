// game_router.ts
import { FastifyInstance } from 'fastify';
import { GameInstance } from './multiplayer.js';

const games = new Map<string, GameInstance>();

function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

export default async function gameRouter(fastify: FastifyInstance) {

	fastify.post('/start', async (request, reply) => {
		const { userId, userName } = request.body as { userId: string, userName: string };
		for (const [id, game] of games) {
			if (!game.full) {
				game.full = true;
				game.player2.id = userId;
				game.player2.name = userName;
				game.message = "";
				game.startGame();
				console.log(`🎮 Partie rejointe : ${id}`);
				reply.send({ gameId: id, player: "player2" });
				return ;
			}
		}
		const id = generateGameId();
		const game = new GameInstance(userId, userName);
		games.set(id, game);
		console.log(`🎮 Partie créée : ${id}`);
		reply.send({ gameId: id, player: "player1" });
	});

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
