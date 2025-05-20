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

https.createServer(credentials, app).listen(3451, '0.0.0.0', () =>
{
	console.log('HTTPS database server running at https://10.12.200.81:3451');
});

app.use(cors());
app.use(express.json());

app.post('/submit', async (req, res) =>
{
	const { username, email, password } = req.body;

	if (!username || !email || !password)
	{
		res.status(400).send('Incomplete data');
		return ;
	}

	try
	{
		const db = await getDb();
		await db.run(
			`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
			[username, email, password]
		);
		res.status(200).send('User created');
	}
	catch (err)
	{
		console.error(err);
		res.status(500).send('Error');
	}
});

app.post('/login', async (req, res) =>
{
	const { required, login, password } = req.body;

	if (!login || !password)
	{
		res.status(400).send('Incomplete data');
		return ;
	}

	try
	{
		const db = await getDb();
		const response = await db.run(
			`SELECT * FROM users WHERE ${required}=${login} AND password=${password}`
		)
		console.log(response);
		res.status(200).send('Connection success');
	}
	catch (err)
	{
		console.error(err);
		res.status(500).send('Error');
	}
});

async function getDb()
{
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}
