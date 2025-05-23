import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import fs from 'fs';

import authRoutes from './auth/auth_back.js';
import historyRoutes from './stats/history_back.js';
import chatRoutes from './chat/chat_back.js';


dotenv.config();

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const IP_NAME = process.env.IP_NAME || '10.12.200.0';

async function main() {
  const app = Fastify({
    logger: true,
    https: {
      key: privateKey,
      cert: certificate,
    },
  });

  await app.register(cors, { origin: true });
  await app.register(authRoutes);
  await app.register(historyRoutes);
  await app.register(chatRoutes);

  await app.listen({ port: 3451, host: '0.0.0.0' });
  console.log(`HTTPS server running at https://${IP_NAME}:3451`);
}

main();
