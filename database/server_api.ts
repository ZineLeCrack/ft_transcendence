import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { setupWebSocket } from './chat/websocket_chat.js';

import authRoutes from './auth/auth_back.js';
import historyRoutes from './stats/history_back.js';
import chatRoutes from './chat/chat_back.js';
import a2fRoutes from './a2f/check_a2f.js';
import addhistoryRoutes from './stats/add_history.js';
import searchRoutes from './search/search_back.js';
import editRoutes from './edit/edit.js';
import createTournamentRoutes from './tournament/create_tournament.js';
import listTournamentsRoutes from './tournament/list_tournaments.js';
import joinTournamentRoutes from './tournament/join_tournament.js';
import friendRoutes from './Friend-block/friend-back.js';
import blockRoutes from './Friend-block/block-back.js';
import isInATournamentRoutes from './tournament/is_in_a_tournament.js';
import getPlayersATournamentRoutes from './tournament/get_players.js';
import startTournamentsRoutes from './tournament/start_tournament.js';
import getWinnersATournamentRoutes from './tournament/get_winners.js';

dotenv.config();

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const IP_NAME = process.env.IP_NAME || '10.12.200.0';

async function main() {
	const app = Fastify({
		logger: false,
		https: {
			key: privateKey,
			cert: certificate,
		},
	});

	await app.register(cors, { origin: true });
	await app.register(authRoutes);
	await app.register(historyRoutes);
	await app.register(chatRoutes);
	await app.register(a2fRoutes);
	await app.register(addhistoryRoutes);
	await app.register(searchRoutes);
	await app.register(editRoutes);
	await app.register(createTournamentRoutes);
	await app.register(listTournamentsRoutes);
	await app.register(joinTournamentRoutes);
	await app.register(friendRoutes);
	await app.register(blockRoutes);
	await app.register(isInATournamentRoutes);
	await app.register(getPlayersATournamentRoutes);
	await app.register(startTournamentsRoutes);
	await app.register(getWinnersATournamentRoutes);

	await app.listen({ port: 3451, host: '0.0.0.0' });

	const server = app.server;
	setupWebSocket(server);
	console.log(`HTTPS server running at https://${IP_NAME}:3451`);
}

main();
