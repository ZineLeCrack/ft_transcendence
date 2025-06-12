import { FastifyInstance } from 'fastify';
import { GameInstance } from './server.js';
import { getAIMove } from '../ai/ai.js';

const games = new Map<string, GameInstance>();

function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

export default async function gameRouter(fastify: FastifyInstance) {
	fastify.post('/start', async (_request, reply) => {
		const id = generateGameId();
		const game = new GameInstance();
		games.set(id, game);
		console.log(`Game created: ${id}`);
		reply.send({ gameId: id });
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

	fastify.post('/:id/move', async (request, reply) => {
		const { id } = request.params as { id: string };
		const game = games.get(id);
		if (!game)
			return reply.status(404).send({ error: "Game not found" });

		const body = request.body as { keys: any };
		game.move(body.keys);
		reply.status(200).send({ status: "ok" });
	});

	fastify.post('/end', async (request, reply) => {
		const { gameId } = request.body as { gameId: string };

		const game = games.get(gameId.toString());

		if (!game) {
			reply.status(404).send('Game not found');
			return ;
		}

		game.stop();

		if (games.delete(gameId.toString())) {
			console.log(`Local game ${gameId} close`);
		}

		reply.status(200).send({ success: true });
	});

	fastify.post('/:id/ai', async (request, reply) => {
        const { id } = request.params as { id: string };
        const game = games.get(id);
        if (!game)
            return reply.status(404).send({ error: "Game not found" });

        const body = request.body as {
            paddlePosition: number,
            ballPosition: { x: number; y: number },
            ballDirection: { x: number; y: number }
        };

        // Appel à l'IA
        const aiMove = getAIMove(
            body.paddlePosition,
            body.ballPosition,
            body.ballDirection
        );

        reply.status(200).send(aiMove);
    });
}
