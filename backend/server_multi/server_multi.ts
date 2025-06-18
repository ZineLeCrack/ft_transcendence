import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';
import gameRoutes from './game_router_multi.js';
import tournamentRoutes from './tournament.js';

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
	});

	await app.register(cors, { origin: true });
	await app.register(tournamentRoutes, { prefix: '/tournament'});
	await app.register(gameRoutes, { prefix: '/game' });
	await app.listen({ port: 4001, host: '0.0.0.0' });

	console.info(`HTTPS Master Multi Game Server running at https://${IP_NAME}:4001`);
}

main().catch(err => {
	console.error("❌ Failed to start server:", err);
	process.exit(1);
});
