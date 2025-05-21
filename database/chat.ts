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

const dbPath = './user.db';

https.createServer(credentials, app).listen(3452, '0.0.0.0', () =>
{
    console.log('HTTPS database server running at https://10.12.200.87:3452');
});

app.use(cors());
app.use(express.json());

// Route unique pour envoyer (POST) et récupérer (GET) les messages
app.route('/sendinfo')
    .post(async (req, res) =>
    {
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
            res.status(200).send('Info sent');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    })
    // .get(async (req, res) =>
    // {
    //     try {
    //         const db = await getDb();
    //         const rows = await db.all(`SELECT username, content FROM chat`);
    //         res.status(200).json(rows);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send('Server error');
    //     }
    // });

async function getDb()
{
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
}
