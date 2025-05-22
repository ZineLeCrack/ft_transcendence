import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const dbPath = './chat.db';

app.use(cors());
app.use(express.json());

const server = https.createServer(credentials, app);

server.listen(3452, '0.0.0.0', () =>
{
    console.log('HTTPS database server running at https://10.12.200.81:3452');
});

const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
    console.log('Client connecté via WebSocket');
    clients.add(ws);

    ws.on('close', () => {
        console.log('Client déconnecté');
        clients.delete(ws);
    });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            const { username, content } = data;

            if (!username || !content) return;

            const db = await getDb();
            await db.run(
                `INSERT INTO chat (username, content) VALUES (?, ?)`,
                [username, content]
            );

            // Broadcast à tous les clients
            for (const client of clients) {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({ username, content }));
                }
            }

        } catch (err) {
            console.error('Erreur WebSocket :', err);
        }
    });
});

app.post('/sendinfo', async (req, res) => {
    const { username, content } = req.body;
    
    if (!username || !content)
    {
        res.status(400).send('Incomplete data');
        return;
    }

    try {
        const db = await getDb();
        await db.run(
            `INSERT INTO chat (username, content) VALUES (?, ?)`,
            [username, content]
        );
        res.status(200).json({username: username, content: content});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/getmessages', async (req, res) => {
    try {
        const db = await getDb();
        const messages = await db.all(`SELECT * FROM chat`);
        res.status(200).json({ tab: messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

async function getDb()
{
	return open({
        filename: dbPath,
		driver: sqlite3.Database,
	});
}
