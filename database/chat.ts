import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const dbPath = './chat.db';

https.createServer(credentials, app).listen(3452, '0.0.0.0', () =>
{
    console.log('HTTPS database server running at https://10.12.200.81:3452');
});

app.use(cors());
app.use(express.json());

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

async function getDb()
{
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}