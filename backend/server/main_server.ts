import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';
import gameRoutes from './game_router.js'; // ton routeur de jeu en mode plugin Fastify

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

  // 🔓 Autoriser les requêtes cross-origin
  await app.register(cors, { origin: true });

  // 🕹️ Routes du jeu multijoueur
  await app.register(gameRoutes, { prefix: '/game' });

  // 🚀 Lancer le serveur
  await app.listen({ port: 4000, host: '0.0.0.0' });

  console.log(`🔐 HTTPS Master Game Server running at https://${IP_NAME}:4000`);
}

main().catch(err => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
