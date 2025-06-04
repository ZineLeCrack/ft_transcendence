import { FastifyInstance } from 'fastify';

export default async function startTournamentsRoutes(fastify: FastifyInstance) {
	fastify.post('/tournament_start', async (request, reply) => {
		const { player1, player2, player3, player4, player5, player6, player7, player8 }
		= request.body as { player1: string, player2: string, player3: string, player4: string, player5: string, player6: string, player7: string, player8: string };
		console.log(player1, player2, player3, player4, player5, player6, player7, player8);
		reply.status(200);
	});
}
