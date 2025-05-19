import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const privateKey = fs.readFileSync('serv.key', 'utf8');
const certificate = fs.readFileSync('serv.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const dbPath = './user.db';

https.createServer(credentials, app).listen(3451, '0.0.0.0', () =>
{
	console.log('HTTPS database server running at https://10.12.200.65:3451');
});

app.use(cors());
app.use(express.json());


app.post('/submit', async (req, res) =>
{
	const { userData } = req.body;

	if (!userData.username || !userData.email || !userData.password)
	{
		res.status(400).send('Incomplete data');
		return ;
	}

	try {
		const db = await getDb();
		await db.run(
			`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
			[userData.username, userData.email, userData.password]
		);
		res.status(200).send('User created');
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

