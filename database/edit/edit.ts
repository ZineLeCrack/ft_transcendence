import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import { getDb_chat } from '../database.js';
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

import { validateUsername, validateEmail, validatePassword } from './../utils.js';

export default async function editRoutes(fastify: FastifyInstance) {

	fastify.post('/edit', async (request, reply) => {
		const { current, newpass, token } = request.body as { current: string, newpass: string, token: string };
		if (!newpass || !current) {
			reply.status(400).send('incomplete data');
			return;
		}

		if (!validatePassword(newpass)) {
			reply.status(400).send('Invalid password');
			return;
		}

		let IdUser;
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			IdUser = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}

		try {
			const db = await getDb_user();
			const mypass = await db.get('SELECT password FROM users WHERE id = ?', [IdUser]);
			const match = await bcrypt.compare(current, mypass.password);
			if (match) {
				const newhash = await bcrypt.hash(newpass.toString(), 10);
				await db.run('UPDATE users SET password = ? WHERE id = ?', [newhash, IdUser]);
				console.log("password edit success");
				reply.status(200).send("nice");
			} else {
				reply.status(401).send("invalid mdp");
			}
		} catch (error) {
			console.log(error);
			reply.status(500).send(error);
		}
	});

	fastify.post('/info', async (request, reply) => {
		const { username, email, token } = request.body as { username: string, email: string, token: string };
		if (!username && !email) {
			reply.status(400).send('incomplete data');
			return;
		}

		if (username && !validateUsername(username)) {
			reply.status(400).send('Invalid username');
			return;
		}

		if (email && !validateEmail(email)) {
			reply.status(400).send('Invalid email');
			return;
		}

		try {
			const db = await getDb_user();
			const dbchat = await getDb_chat();
			let IdUser;
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				IdUser = (decoded as { userId: string }).userId;
			} catch (err) {
				reply.status(401).send('Invalid token');
				return;
			}

			const original = await db.get('SELECT name FROM users WHERE id = ?', [IdUser]);
			const original_name = original.name;

			if (username && email) {
				const existingUser = await db.get('SELECT * FROM users WHERE name = ? OR email = ?', [username, email]);
				if (existingUser) {
					reply.status(400).send('User already exists');
					return;
				}
				await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [username, email, IdUser]);
				await dbchat.run('UPDATE chat SET username = ? WHERE username = ?', [username, original_name]);
				console.log("info edit success");
				reply.status(200).send("nice");
			} else if (username) {
				const existingUser = await db.get('SELECT * FROM users WHERE name = ?', [username]);
				if (existingUser) {
					reply.status(400).send('User already exists');
					return;
				}
				await db.run('UPDATE users SET name = ? WHERE id = ?', [username, IdUser]);
				await dbchat.run('UPDATE chat SET username = ? WHERE username = ?', [username, original_name]);
				console.log("username edit success");
				reply.status(200).send("nice");
			} else if (email) {
				const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
				if (existingUser) {
					reply.status(400).send('User already exists');
					return;
				}
				await db.run('UPDATE users SET email = ? WHERE id = ?', [email, IdUser]);
				console.log("email edit success");
				reply.status(200).send("nice");
			}
		} catch (error) {
			console.log(error);
			reply.status(500).send(error);
		}
	});

	fastify.post('/picture', async (request, reply) => {
		const parts = request.parts();
		const data = await request.file();
		let token: any;
		const start = Date.now();
		for await (const part of parts) {
			const partStartTime = Date.now();
			if (part.type === 'field' && part.fieldname === 'token') {
				token = part.value;
				console.log(`Token part processed in ${Date.now() - partStartTime} ms`);
			}
		}
		console.log(`All parts processed in ${Date.now() - start} ms`);
		if (!data || !token) {
			reply.status(400).send('Missing image or token');
			return;
		}

		let IdUser;
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			IdUser = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}

		const chunks: Buffer[] = [];
		for await (const chunk of data.file) {
			chunks.push(Buffer.from(chunk));
		}
		const originalBuffer = Buffer.concat(chunks);
		let jpegBuffer: Buffer;
		try {
			jpegBuffer = await sharp(originalBuffer).png().toBuffer();
		} catch (err) {
			console.error('Image conversion failed:', err);
			reply.status(500).send('Image conversion error');
			return;
		}

		try {
			const db = await getDb_user();
			await db.run('UPDATE users SET profile_pic = ? WHERE id = ?', [jpegBuffer, IdUser]);
			console.log("picture update success");

			reply.status(200).header('Content-Type', 'image/jpeg').send(jpegBuffer);
		}
		catch (err) {
			console.error(err);
			reply.status(500).send('Database error');
		}
	});
}
