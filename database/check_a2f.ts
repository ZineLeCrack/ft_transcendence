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

const verificationCodes = new Map()

app.post('/a2f/send', async (req, res) => {
	const { IdUser } = req.body;

	if (!IdUser) {
		 res.status(400).send('Missing IdUser');
		 return;
	}

	try {
		const db = await getDb();
		const user = await db.get(`SELECT email FROM users WHERE id = ?`, [IdUser]);

		if (!user || !user.email) {
			 res.status(404).send('User not found');
			 return;
		}

		const realcode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

		verificationCodes.set(IdUser, realcode);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL,
				pass: EMAIL_SMP,
			}
		});

		await transporter.sendMail({
			from: EMAIL,
			to: user.email,
			subject: "Votre code de vérification",
			text: `Voici votre code de vérification : ${realcode}`,
		});

		res.status(200).send('Code sent');
	} catch (err) {
		console.error(err);
		res.status(500).send('Error sending code');
	}
});


app.post('/a2f/verify', (req, res) => {
	const { code, IdUser } = req.body;

	if (!code || !IdUser) {
		res.status(400).send('Incomplete data');
		return;
	}

	const expectedCode = verificationCodes.get(IdUser);

	if (!expectedCode) {
		res.status(404).send('No code found or expired');
		return;
	}

	if (code === expectedCode) {
		verificationCodes.delete(IdUser);
		res.status(200).send('good answer');
		return;
	}
	else {
		res.status(400).send('bad code');
		return;
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

