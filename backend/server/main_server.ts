import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import router from './game_router.js';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";

const app = express();

https.createServer(credentials, app).listen(4000, '0.0.0.0', () =>
{
	console.log(`🔐 HTTPS Master server running at https://${IP_NAME}:4000`);
});

app.use(cors());
app.use(express.json());

app.use('/game', router);
