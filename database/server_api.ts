import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { setupWebSocket } from './websocket.js';
import fastifyMultipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';

import authRoutes from './auth/auth_back.js';
import historyRoutes from './stats/history_back.js';
import chatRoutes from './chat/chat_back.js';
import a2fRoutes from './a2f/check_a2f.js';
import addhistoryRoutes from './stats/add_history.js';
import searchRoutes from './search/search_back.js';
import editRoutes from './edit/edit.js';
import friendRoutes from './friend_block/friend-back.js';
import blockRoutes from './friend_block/block-back.js';
import privateGameRoutes from './chat/private_game.js';
import StatsRoutes from './stats/stats_back.js';
import tournamentRoutes from './tournament/tournament_router.js';

dotenv.config();

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const IP_NAME = process.env.IP_NAME;

async function main() {
	const app = Fastify({
		logger: false,
		https: {
			key: privateKey,
			cert: certificate,
		},
		bodyLimit: 100 * 1024 * 1024,
		connectionTimeout: 120000,
	});

	await app.register(fastifyMultipart, {
		limits: {
			fileSize: 500 * 1024 * 1024,
			files: 1,
			fields: 10,
		}
	});

	await app.register(cors, { origin: true });
	await app.register(authRoutes);
	await app.register(historyRoutes);
	await app.register(chatRoutes);
	await app.register(a2fRoutes);
	await app.register(addhistoryRoutes);
	await app.register(searchRoutes);
	await app.register(editRoutes);
	await app.register(friendRoutes);
	await app.register(blockRoutes);
	await app.register(privateGameRoutes, { prefix: '/private_game'});
	await app.register(StatsRoutes);
	await app.register(tournamentRoutes, { prefix: '/tournament' });
	await app.register(fastifyCookie);
	await app.listen({ port: 3451, host: '0.0.0.0' });

	const server = app.server;
	setupWebSocket(server);
	console.info(`HTTPS server running at https://${IP_NAME}:3451`);
}

main();
