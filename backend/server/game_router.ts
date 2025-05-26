// game_router.ts
import { FastifyInstance } from 'fastify';
import { GameInstance } from './server.js';

const games = new Map<string, GameInstance>();

function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

export default async function gameRouter(fastify: FastifyInstance) {

	// 🎮 Créer une nouvelle partie
	fastify.post('/start', async (_request, reply) => {
		const id = generateGameId();
		const game = new GameInstance();
		games.set(id, game);
		console.log(`🎮 Partie créée : ${id}`);
		reply.send({ gameId: id });
	});

	// 📦 Récupérer l'état de la partie
	fastify.get('/:id/state', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		reply.send(game.getState());
	});

	// ▶️ Démarrer la partie
	fastify.post('/:id/start', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		game.startGame();
		reply.status(200).send({ status: "started" });
	});

	// 🎮 Déplacer les raquettes
	fastify.post('/:id/move', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		const body = request.body as { keys: any };
		game.move(body.keys);
		reply.status(200).send({ status: "ok" });
	});
}
