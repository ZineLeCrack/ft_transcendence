import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_longue';

import { validateUsername , validateEmail, validatePassword } from './../utils.js';

export default async function editRoutes(fastify: FastifyInstance)
{
	fastify.post('/edit', async (request, reply) => {
		const {current, newpass , token} = request.body as {current: string, newpass: string, token: string};
		if (!newpass || !current)
		{
			reply.status(400).send('imcomplete data');
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
		} 
		catch (err) {
			reply.status(401).send('Invalid token');
			return;
		}
		try {
			const db = await getDb_user();
			const mypass =  await db.get('SELECT password FROM users WHERE id = ?', [IdUser]);
			const match = await bcrypt.compare(current, mypass.password);
			if (match)
			{
				try {
					const newhash = await bcrypt.hash(newpass.toString(), 10);
					await db.run('UPDATE users SET password = ? WHERE id = ?', [newhash, IdUser]);
				} 
				catch (error) {
					reply.status(500).send("erreur co database");
					console.log(error);
				}
				console.log("password edit sucess");
				reply.status(200).send("nice");
			}
			else {
				reply.status(401).send("invalid mdp");
			}
		} 
		catch (error) {
			console.log(error);
			reply.status(500).send(error);
		}
	});
	
	fastify.post('/info', async (request, reply) => {
		const {username, email , IdUser} = request.body as {username: string, email: string, IdUser: string};
		if (!username && !email)
		{
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
			if (username && email)
			{
				try {
					
					const existingUser = await db.get('SELECT * FROM users WHERE name = ? OR email = ?', [username, email]);
					if (existingUser) {
						reply.status(400).send('User already exists');
						return;
					}
					
				   await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [username, email, IdUser]);
				}
				catch (error) {
					reply.status(500).send("erreur co database");
					console.log(error);
				}
				console.log("info edit sucess");
				reply.status(200).send("nice");
			}
			else if (username && !email) {
				try {

					const existingUser = await db.get('SELECT * FROM users WHERE name = ?', [username]);
					if (existingUser) {
						reply.status(400).send('User already exists');
						return;
					}
				   await db.run('UPDATE users SET name = ? WHERE id = ?', [username, IdUser]);
				} 
				catch (error) {
					reply.status(500).send("erreur co database");
					console.log(error);
				}
				console.log("username edit sucess");
				reply.status(200).send("nice");
			}
			else if (!username && email)
			{
				try {

					const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
					if (existingUser) {
						reply.status(400).send('User already exists');
						return;
					}
				   await db.run('UPDATE users SET email = ? WHERE id = ?', [email, IdUser]);
				} 
				catch (error) {
					reply.status(500).send("erreur co database");
					console.log(error);
				}
				console.log("email edit sucess");
				reply.status(200).send("nice");
			}
		} 
		catch (error) {
			console.log(error);
			reply.status(500).send(error);
		}
	});
}
