import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import { getDb_chat } from '../database.js';
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

import { validateUsername, validateEmail, validatePassword } from './../utils.js';
import { access } from 'fs';

export default async function editRoutes(fastify: FastifyInstance) {

	fastify.post('/edit', async (request, reply) => {
		const { current, newpass} = request.body as { current: string, newpass: string};
		if (!newpass || !current) {
			reply.status(400).send('incomplete data');
			return ;
		}

		if (!validatePassword(newpass)) {
			reply.status(400).send('Invalid password');
			return ;
		}
		let IdUser;
		try {
			const token_cookie = request.cookies.accessToken!;
			const decoded = jwt.verify(token_cookie, JWT_SECRET);
			IdUser = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return ;
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
				reply.status(200).send("invalid mdp");
			}
		} catch (error) {
			console.log(error);
			reply.status(500).send(error);
		}
	});

	fastify.post('/info', async (request, reply) => {
		const { username, email} = request.body as { username: string, email: string};
		if (!username && !email) {
			reply.status(400).send('incomplete data');
			return ;
		}

		if (username && !validateUsername(username)) {
			reply.status(400).send('Invalid username');
			return ;
		}

		if (email && !validateEmail(email)) {
			reply.status(400).send('Invalid email');
			return ;
		}

		try {
			const db = await getDb_user();
			const dbchat = await getDb_chat();
			let IdUser;
			try {
				const token = request.cookies.accessToken!;  
				const decoded = jwt.verify(token, JWT_SECRET);
				IdUser = (decoded as { userId: string }).userId;
			} catch (err) {
				reply.status(401).send('Invalid token');
				return ;
			}

			const original = await db.get('SELECT name FROM users WHERE id = ?', [IdUser]);
			const original_name = original.name;

			if (username && email) {
				const existingUser = await db.get('SELECT * FROM users WHERE name = ? OR email = ?', [username, email]);
				if (existingUser) {
					reply.status(200).send('User already exists');
					return ;
				}
				await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [username, email, IdUser]);
				await dbchat.run('UPDATE chat SET username = ? WHERE username = ?', [username, original_name]);
				console.log("info edit success");
				reply.status(200).send("nice");
			} else if (username) {
				const existingUser = await db.get('SELECT * FROM users WHERE name = ?', [username]);
				if (existingUser) {
					reply.status(200).send('User already exists');
					return ;
				}
				await db.run('UPDATE users SET name = ? WHERE id = ?', [username, IdUser]);
				await dbchat.run('UPDATE chat SET username = ? WHERE username = ?', [username, original_name]);
				console.log("username edit success");
				reply.status(200).send("nice");
			} else if (email) {
				const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
				if (existingUser) {
					reply.status(200).send('User already exists');
					return ;
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
		const fileData = await request.file();
		const authHeader = request.headers['authorization'];
		const start = Date.now();
		console.log(`All parts processed in ${Date.now() - start} ms`);
		if (!fileData) {
			reply.status(200).send('Please select a picture');
			return ;
		}
		let IdUser;
		try {
			const token = request.cookies.accessToken!
			const decoded = jwt.verify(token, JWT_SECRET);
			IdUser = (decoded as { userId: string }).userId;
		} catch (err) {
			reply.status(401).send('Invalid token');
			return ;
		}

		const chunks: Buffer[] = [];
		for await (const chunk of fileData.file) {
			chunks.push(Buffer.from(chunk));
		}
		const originalBuffer = Buffer.concat(chunks);

		let jpegBuffer: Buffer;
		try {
			jpegBuffer = await sharp(originalBuffer).png().toBuffer();
		} 
		catch (err) {
			console.error('Image conversion failed:', err);
			reply.status(200).send('Please a valid image (PNG, JPG, WEBP, ...)');
			return ;
		}

		try {
			const db = await getDb_user();
			await db.run('UPDATE users SET profile_pic = ? WHERE id = ?', [jpegBuffer, IdUser]);
			console.log("picture update success");

			reply.status(200).header('Content-Type', 'image/png').send(jpegBuffer);
		} catch (err) {
			console.error(err);
			reply.status(500).send('Database error');
		}
	});
	fastify.get('/picture', async (request, reply) => {
		const authHeader = request.headers['authorization'] as any;
		const name = authHeader?.split(' ')[2];

		let userId;
		try {
			const token = request.cookies.accessToken!
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = (decoded as { userId: string }).userId;
		} 
		catch {
			return reply.status(401).send('Invalid token');
		}
		try {
			let result;
			const db = await getDb_user();
			if (name === "l")
			{
				result = await db.get('SELECT profile_pic FROM users WHERE id = ?', [userId]);
			}
			else
			{
				result = await db.get('SELECT profile_pic FROM users WHERE name = ?', [name]);
			}
			if (!result || !result.profile_pic) {
			return reply.status(404).send('Image not found');
		}
			reply.header('Content-Type', 'image/png').send(result.profile_pic);
		} 
		catch (err) {
			console.error(err);
			reply.status(500).send('Database error');
	}
	});
}
