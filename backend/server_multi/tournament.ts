import { FastifyInstance } from 'fastify';
import { GameInstance } from './multiplayer';
import { generateGameId } from './game_router_multi';
import { games } from './game_router_multi';
import { getDb_user } from '../database';
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
	instance: GameInstance,
	game: number
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
			instance: GameInstance,
			game: number
		};

		tournamentData.game = 1;
		tournamentData.gameId = generateGameId();
		tournamentData.instance = new GameInstance(tournamentData.gameId, '', '', true, tournamentData.id);
		tournamentData.instance.player1.id = tournamentData.player1;
		tournamentData.instance.player2.id = tournamentData.player2;
		games.set(tournamentData.gameId, tournamentData.instance);
		console.log(`First game launch at tournament ${tournamentData.id} -> gameId: ${tournamentData.gameId}`);
		tournamentsInstances.set(tournamentData.id, tournamentData);

		reply.status(200).send({ next_player1: tournamentData.player1, next_player2: tournamentData.player2 });
	});

	fastify.post('/join', async (request, reply) => {
		const { token, tournamentId } = request.body as { token: string, tournamentId: string };

		let userId;
		const db = await getDb_user();
		let userName;
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
			const result = await db.get(`SELECT name FROM users WHERE id = ?`, [userId]);
			userName = result.name;
		} 
		catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}

		const game = tournamentsInstances.get(tournamentId.toString())?.instance;
		if (!game) {
			reply.status(200).send({ gameId: '0', err: true, message: 'The tournament is not started !' });
			return ;
		}

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
	});

	fastify.post('/next_game', async (request, reply) => {
		const { tournamentId } = request.body as { tournamentId: string };

		const tournament = tournamentsInstances.get(tournamentId.toString());
		tournament!.game += 1;
		const game = tournament?.instance;
		let winner = '?';
		let loser = '?';
		if (game?.leftScore === 5) {
			winner = game.player1.id;
			loser = game.player2.id;
		} else if (game?.rightScore === 5) {
			winner = game.player2.id;
			loser = game.player1.id;
		}

		let results;

		if (tournament?.game === 2) {
			tournament.winner1 = winner;
			tournament.loser1 = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner1',
				pos2: 'loser1',
				next_player1: tournament.player3,
				next_player2: tournament.player4
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.player3;
			tournament.instance.player2.id = tournament.player4;
			games.set(tournament.gameId, tournament.instance);
			console.log(`Second game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 3) {
			tournament.winner2 = winner;
			tournament.loser2 = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner2',
				pos2: 'loser2',
				next_player1: tournament.player5,
				next_player2: tournament.player6
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.player5;
			tournament.instance.player2.id = tournament.player6;
			games.set(tournament.gameId, tournament.instance);
			console.log(`Third game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 4) {
			tournament.winner3 = winner;
			tournament.loser3 = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner3',
				pos2: 'loser3',
				next_player1: tournament.player7,
				next_player2: tournament.player8
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.player7;
			tournament.instance.player2.id = tournament.player8;
			games.set(tournament.gameId, tournament.instance);
			console.log(`Fourth game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 5) {
			tournament.winner4 = winner;
			tournament.loser4 = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner4',
				pos2: 'loser4',
				next_player1: tournament.winner1,
				next_player2: tournament.winner2
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.winner1;
			tournament.instance.player2.id = tournament.winner2;
			games.set(tournament.gameId, tournament.instance);
			console.log(`First semifinal game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 6) {
			tournament.winner1_semifinals = winner;
			tournament.loser1_semifinals = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner1_semifinals',
				pos2: 'loser1_semifinals',
				next_player1: tournament.winner3,
				next_player2: tournament.winner4
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.winner3;
			tournament.instance.player2.id = tournament.winner4;
			games.set(tournament.gameId, tournament.instance);
			console.log(`Second semifinal game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 7) {
			tournament.winner2_semifinals = winner;
			tournament.loser2_semifinals = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner2_semifinals',
				pos2: 'loser2_semifinals',
				next_player1: tournament.winner1_semifinals,
				next_player2: tournament.winner2_semifinals
			}
			tournament.gameId = generateGameId();
			tournament.instance = new GameInstance(tournament.gameId, '', '', true, tournament.id);
			tournament.instance.player1.id = tournament.winner1_semifinals;
			tournament.instance.player2.id = tournament.winner2_semifinals;
			games.set(tournament.gameId, tournament.instance);
			console.log(`Final game launch at tournament ${tournament.id} -> gameId: ${tournament.gameId}`);
		} else if (tournament?.game === 8) {
			tournament.winner_final = winner;
			tournament.loser_final = loser;
			results = {
				winner: winner,
				loser: loser,
				pos1: 'winner_final',
				pos2: 'loser_final',
				next_player1: '',
				next_player2: ''
			}
		}
		reply.status(200).send({ ...results, tournamentId: tournamentId });
	});
}
