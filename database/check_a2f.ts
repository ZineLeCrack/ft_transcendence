import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";
const EMAIL = process.env.EMAIL || "10.12.200.0";
const EMAIL_SMP = process.env.PASSWORD_SMP || "10.12.200.0";
const app = express();

const dbPath = './user.db';

app.use(cors());
app.use(express.json());

app.post('/a2f', async (req, res) => {
	const { code, IdUser } = req.body;

	if (!code || !IdUser) {
		res.status(400).send('Incomplete data');
		return;
	}

	try {
		const db = await getDb();
		const user = await db.get(`SELECT email FROM users WHERE id = ?`, [IdUser]);

		if (!user || !user.email) {
			res.status(404).send('User not found');
			return;
		}

		const realcode = Math.floor(Math.random() * 1000000)
			.toString()
			.padStart(6, '0');

		// Envoie du code par email
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL,
				pass: EMAIL_SMP,
			}
		});

		await transporter.sendMail({
			from: '"Transcend Auth" <your_email@example.com>',
			to: user.email,
			subject: "Votre code de vérification",
			text: `Voici votre code de vérification : ${realcode}`,
		});

		if (code === realcode) {
			res.status(200).send('good answer');
		} else {
			res.status(500).send('bad code');
		}
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

https.createServer(credentials, app).listen(3534, '0.0.0.0', () =>
{
	console.log(`HTTPS ${EMAIL} ${EMAIL_SMP}database server running at https://${IP_NAME}:3534`);
});

