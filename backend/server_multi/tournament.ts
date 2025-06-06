import { FastifyInstance } from 'fastify';
import { GameInstance } from './multiplayer';
import { generateGameId } from './game_router_multi';
import { games } from './game_router_multi';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

interface TournamentInstance {
	id: string,
	player1: string,
	player2: string,
	player3: string,
	player4: string,
	player5: string,
	player6: string,
	player7: string,
	player8: string,
	winner1: string,
	loser1: string,
	winner2: string,
	loser2: string,
	winner3: string,
	loser3: string,
	winner4: string,
	loser4: string,
	winner1_semifinals: string,
	loser1_semifinals: string,
	winner2_semifinals: string,
	loser2_semifinals: string,
	winner_final: string,
	loser_final: string,
	gameId: string,
	instance: GameInstance
}

const tournamentsInstances = new Map<string, TournamentInstance>();

export default async function tournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/start', async (request, reply) => {
		const tournamentData: TournamentInstance = request.body as {
			id: string,
			player1: string,
			player2: string,
			player3: string,
			player4: string,
			player5: string,
			player6: string,
			player7: string,
			player8: string,
			winner1: string,
			loser1: string,
			winner2: string,
			loser2: string,
			winner3: string,
			loser3: string,
			winner4: string,
			loser4: string,
			winner1_semifinals: string,
			loser1_semifinals: string,
			winner2_semifinals: string,
			loser2_semifinals: string,
			winner_final: string,
			loser_final: string,
			gameId: string,
			instance: GameInstance
		};

		tournamentData.gameId = generateGameId();
		tournamentData.instance = new GameInstance(tournamentData.gameId, "", "", true);
		tournamentData.instance.player1.id = tournamentData.player1;
		tournamentData.instance.player2.id = tournamentData.player2;
		games.set(tournamentData.gameId, tournamentData.instance);
		console.log(`First game launch at tournament ${tournamentData.id} -> gameId: ${tournamentData.gameId}`);
		tournamentsInstances.set(tournamentData.id, tournamentData);

		reply.status(200);
	});

	fastify.post('/join', async (request, reply) => {
		const { token, tournamentId } = request.body as { token: string, tournamentId: string };

		let userId;
		let userName;
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
			userName = (decoded as { name: string }).name;
		} 
		catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}

		const game = tournamentsInstances.get(tournamentId.toString())?.instance!;
		console.log(`POST: (${game.gameId}) (${tournamentsInstances.get(tournamentId.toString())?.gameId})`);

		if (game.player1.id === userId) {
			if (game.player1.name === '') {
				game.player1.name = userName;
				if (game.player1.name !== '' && game.player2.name !== '') {
					game.full = true;
					game.message = "";
					game.startGame();
				}
			}
			reply.status(200).send({ gameId: game.gameId, player: 'player1' });
			return ;
		}
		else if (game.player2.id === userId) {
			if (game.player2.name === '') {
				game.player2.name = userName;
				if (game.player1.name !== '' && game.player2.name !== '') {
					game.full = true;
					game.message = "";
					game.startGame();
				}
			}
			reply.status(200).send({ gameId: game.gameId, player: 'player2' });
			return ;
		}
		else {
			reply.status(200).send({ gameId: '0', err: true, message: 'Not your turn !' });
			return ;
		}
	})
}

// sqlite3 database/tournaments.db
// UPDATE tournaments SET players_max = 1 WHERE id = 1;
