import express from 'express';
import fs, { stat } from 'fs';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './auth/auth_back.js';
import historyRoutes from './stats/history_back.js';
import statsRoutes from './stats/stats_back.js';
import { setupWebSocket } from './chat/websocket_chat.js';
import chatRoutes from './chat/chat_back.js';

dotenv.config();

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || '10.12.200.0';

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(historyRoutes);
app.use(statsRoutes);
app.use(chatRoutes);

const httpsServer = https.createServer(credentials, app);

setupWebSocket(httpsServer); // 👈 ici on branche le WebSocket

httpsServer.listen(3451, '0.0.0.0', () => {
	console.log(`HTTPS server running at https://${IP_NAME}:3451`);
});
