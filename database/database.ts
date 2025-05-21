import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const dbPath = './user.db';

app.use(cors());
app.use(express.json());

app.post('/submit', async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		res.status(400).send('Incomplete data');
		return;
	}

	try
	{
		const db = await getDb();
		const hashedPassword = await bcrypt.hash(password, 10);

		await db.run(
			`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
			[username, email, hashedPassword]
		);
		res.status(200).send('User created');
	}
	catch (err)
	{
		console.error(err);
		res.status(500).send('Error');
	}
});

app.post('/login', async (req, res) => {
	const { required, login, password } = req.body;

	if (!login || !password || (required !== 'email' && required !== 'name')) {
		res.status(400).send('Incomplete or invalid data');
		return;
	}

	try {
		const db = await getDb();
		const query = `SELECT * FROM users WHERE ${required} = ?`;
		const user = await db.get(query, [login]);

		if (!user) {
			res.status(401).send('Invalid credentials');
			return;
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(401).send('Invalid credentials');
			return;
		}

		console.log('User log in:', user);
		res.status(200).json({ id: user.id, name: user.name });
	} catch (err) {
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

https.createServer(credentials, app).listen(3451, '0.0.0.0', () =>
{
	console.log('HTTPS database server running at https://10.12.200.35:3451');
});
