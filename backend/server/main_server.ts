import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import https from 'https';
import fs from 'fs';
import net from 'net';

const privateKey = fs.readFileSync('serv.key', 'utf8');
const certificate = fs.readFileSync('serv.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
const baseGamePort = 3000;
let nextPort = baseGamePort;

https.createServer(credentials, app).listen(4000, () =>
{
	console.log('🔐 HTTPS Master server running at https://localhost:4000');
});

app.use(cors());
app.use(express.json());

app.post('/start', async (req, res) =>
{
	let port = baseGamePort;
	while (!(await isPortFree(port)))
		port++;
	const child = spawn('node', ['server.js', port.toString()],
	{
		stdio: 'inherit',
	});
	console.log(`🎮 Game server starting on port ${port}`);
	res.json({ url: `https://localhost:${port}` });
});

function isPortFree(port: number): Promise<boolean>
{
	return new Promise((resolve) =>
	{
		const tester = net.createServer()
			.once('error', () => resolve(false))
			.once('listening', () =>
			{
				tester.close();
				resolve(true);
			})
			.listen(port);
	});
}

app.listen(4000, () =>
{
	console.log('🌐 Master server running on https://localhost:4000');
});
