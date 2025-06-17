import { FastifyInstance } from 'fastify';
import { getDb_user } from '../database';
import { getDb_tournaments } from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

export default async function tournamentRoutes(fastify: FastifyInstance) {
	fastify.post('/create', async (request, reply) => {
		const { name, players_max, type, password } = request.body as { name: string, players_max: number, type: string, password: string | null };

		try {
			let hashed;
			const db = await getDb_tournaments();
			if (password)
			{
				hashed = await bcrypt.hash(password, 10);
			}
			const result = await db.run(
				`INSERT INTO tournaments (name, type, password) VALUES (?, ?, ?)`,
				[name, type, hashed]
			);
			const tournamentId = result.lastID;
			await db.run(
				`INSERT INTO result (id) VALUES (?)`,
				[tournamentId]
			);
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});

	fastify.post('/get_players', async (request, reply) => {
		const { tournamentId } = request.body as { tournamentId: string };

		try {
			const db = await getDb_tournaments();
			const players = await db.get(
				`SELECT player1, player2, player3, player4, player5, player6, player7, player8
				FROM tournaments WHERE id = ?`,
				[tournamentId]
			);

			if (!players)
			{
				reply.status(500);
				return ;
			}

			else
			{
				reply.status(200).send(players);
				return ;
			}
		} catch (err) {
			console.error('DB error: ', err);
			reply.status(500).send({ error: 'Internal server error' });
		}
	});

	fastify.post('/get_winners', async (request, reply) => {
		const { tournamentId } = request.body as { tournamentId: string };

		try {
			const db = await getDb_tournaments();
			const players = await db.get(
				`SELECT winner1, loser1, winner2, loser2, winner3, loser3, winner4, loser4,
				winner1_semifinals, loser1_semifinals, winner2_semifinals, loser2_semifinals, winner_final, loser_final
				FROM result JOIN tournaments ON result.id = tournaments.id WHERE tournaments.id = ?`,
				[tournamentId]
			);

			if (!players)
			{
				reply.status(500);
				return ;
			}

			else
			{
				reply.status(200).send(players);
				return ;
			}
		} catch (err) {
			console.error('DB error: ', err);
			reply.status(500).send({ error: 'Internal server error' });
		}
	});

	fastify.post('/is_in', async (request, reply) => {
		const { token } = request.body as { token: string };

		let userId: string;

		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
		}
		catch (err) {
			reply.status(401).send(`Invalid token: ${err}`);
			return ;
		}

		try {
			const db = await getDb_tournaments();
			const tournament = await db.get(
				`SELECT * FROM tournaments WHERE player1 = ? OR player2 = ? OR player3 = ? OR player4 = ? OR player5 = ? OR player6 = ? OR player7 = ? OR player8 = ?`,
				[userId, userId, userId, userId, userId, userId, userId, userId]
			);

			if (!tournament)
			{
				reply.status(200).send({ tournamentId: '0', userId: userId });
				return ;
			}

			else
			{
				reply.status(200).send({ tournamentId: tournament.id, userId: userId });
				return ;
			}
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	fastify.post('/join', async (request, reply) => {
		const { id_tournament, token, password, alias } = request.body as { id_tournament: string, token: string, password: string | null, alias: string };

		try {
			let is_pass_valid;
			const dbUsers = await getDb_user();
			const db = await getDb_tournaments();
			const tournament = await db.get(`SELECT * FROM tournaments WHERE id = ?`,
			[id_tournament]
			);
			if (password)
			{
				is_pass_valid = await bcrypt.compare(password, tournament.password);
			}
			let userId;
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userId = (decoded as { userId: string }).userId;
			}
			catch (err) {
				reply.status(401).send(`Invalid token: ${err}`);
				return ;
			}

			if (tournament.players === tournament.players_max)
			{
				reply.status(200).send('This tournament is full !');
				return ;
			}

			if (tournament.type === 'private' && !is_pass_valid)
			{
				reply.status(200).send('Wrong password !');
				return ;
			}

			await dbUsers.run(`UPDATE users SET aliastournament = ? WHERE id = ?`, [alias, userId]);

			const list = await db.get(
				`SELECT player1, player2, player3, player4, player5, player6, player7, player8
				FROM tournaments WHERE id = ?`,
				[id_tournament]
			);

			let tab = [];
			for (let i = 1; i < 9; i++) {
				if (i === 1 && list.player1 === '?')
					tab.push(i);
				else if (i === 2 && list.player2 === '?')
					tab.push(i);
				else if (i === 3 && list.player3 === '?')
					tab.push(i);
				else if (i === 4 && list.player4 === '?')
					tab.push(i);
				else if (i === 5 && list.player5 === '?')
					tab.push(i);
				else if (i === 6 && list.player6 === '?')
					tab.push(i);
				else if (i === 7 && list.player7 === '?')
					tab.push(i);
				else if (i === 8 && list.player8 === '?')
					tab.push(i);
			}

			const playerSlot = 'player' + (tab[Math.floor(Math.random() * tab.length)]).toString();

			await db.run(
				`UPDATE tournaments SET ${playerSlot} = ?, players = players + 1 WHERE id = ?`,
				[userId, id_tournament]
			);

			const players = await db.get(
				`SELECT players_max, players FROM tournaments WHERE id = ?`,
				[id_tournament]
			);

			let full;
			if (players.players_max === players.players) {
				full = true;
			}
			else {
				full = false;
			}

			reply.status(200).send({ full: full, id: id_tournament });
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	fastify.post('/list', async (request, reply) => {
		interface TournamentItem {
			id: number;
			name: string;
			players: number;
			maxPlayers: number;
			type: 'public' | 'private';
		}
		try {
			const db = await getDb_tournaments();
			const rows = await db.all(`SELECT * FROM tournaments;`);
			const tournaments: TournamentItem[] = rows.map((row: any) => ({
				id: row.id,
				name: row.name,
				players: row.players,
				maxPlayers: row.players_max,
				type: row.type,
			}));
			reply.send({ tournaments });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});

	fastify.post('/results', async (request, reply) => {
		const { winner, loser, pos1, pos2, tournamentId } = request.body as {
			winner: string,
			loser: string,
			pos1: string,
			pos2: string,
			tournamentId: string
		};

		const allowedColumns =
			['winner1',
			 'loser1',
			 'winner2',
			 'loser2',
			 'winner3',
			 'loser3',
			 'winner4',
			 'loser4',
			 'winner1_semifinals',
			 'loser1_semifinals',
			 'winner2_semifinals',
			 'loser2_semifinals',
			 'winner_final',
			 'loser_final'
			];

		if (!allowedColumns.includes(pos1) || !allowedColumns.includes(pos2)) {
			reply.status(400).send('Invalid position keys');
			return ;
		}

		try {
			const db = await getDb_tournaments();
			const query = `UPDATE result SET ${pos1} = ?, ${pos2} = ? WHERE id = ?`;
			await db.run(query, [winner, loser, tournamentId]);

			const db_user = await getDb_user();
			await db_user.run(
				`UPDATE stats SET tournaments_played = tournaments_played + 1, tournaments_lose = tournaments_lose + 1,
				last_ranking = ? WHERE id_player = ?`
				, [pos2, loser]);
			if (pos1 === 'winner_final') {
				await db_user.run(
					`UPDATE stats SET tournaments_played = tournaments_played + 1, tournaments_win = tournaments_win + 1,
					last_ranking = ? WHERE id_player = ?`
					, [pos1, winner]);
				setTimeout(async () => {
					await db.run(`DELETE FROM tournaments WHERE id = ?`, [tournamentId]);
					await db.run(`DELETE FROM result WHERE id = ?`, [tournamentId]);
				}, 5000);
			}
			reply.send({ success: true });
		} catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});

	fastify.post('/turn_into_alias', async (request, reply) => {
		const tournamentData =
		request.body as {
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
			loser_final: string
		};

		try {
			const db = await getDb_user();

			for (const [key, value] of Object.entries(tournamentData) as [keyof typeof tournamentData, string][]) {
				if (value === '?')
					continue ;
				const result = await db.get(`SELECT aliastournament FROM users WHERE id = ?`, [value]);
				if (result.aliastournament && result.aliastournament !== '') {
					tournamentData[key] = result.aliastournament;
				}
				else {
					const name = await db.get(`SELECT name FROM	users WHERE id = ?`, [value]);
					tournamentData[key] = name.name;
				}
			}
			reply.status(200).send(tournamentData);
		} catch (err) {
			console.error('DB error: ', err);
			reply.status(500).send({ error: 'Internal server error' });
		}
	});
}
