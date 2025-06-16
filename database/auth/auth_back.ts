import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import fs from 'fs';
import { FastifyInstance } from 'fastify';

import { validateUsername, validateEmail, validatePassword } from './../utils.js';

export default async function authRoutes(fastify: FastifyInstance) 
{

	fastify.post('/submit', async (request, reply) => {
		const { username, email, password } = request.body as { username: string, email: string, password: string };
		if (!username || !email || !password) {
			reply.status(400).send('Incomplete data');
			return;
		}

		if (!validateUsername(username)) {
			reply.status(400).send('Invalid username');
			return;
		}

		if (!validateEmail(email)) {
			reply.status(400).send('Invalid email');
			return;
		}

		if (!validatePassword(password)) {
			reply.status(400).send('Invalid password');
			return;
		}

		try {
			const db = await getDb_user();

			const existingUser = await db.get('SELECT * FROM users WHERE name = ? OR email = ?', [username, email]);
			if (existingUser) {
				reply.status(200).send('invalid username or email, This user already exists');
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const image = fs.readFileSync('uploads/default.png');

			const result = await db.run(
				`INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)`,
				[username, email, hashedPassword, image]
			);

			const player_id = result.lastID;

			await db.run(
				`INSERT INTO stats (games_played, wins, loses, total_points, tournaments_played, tournaments_win, tournaments_lose, id_player)
				VALUES (0, 0, 0, 0, 0, 0, 0, ?)`,
				[player_id]
			);

			reply.status(200).send('User created');
		}
		catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});

	fastify.post('/login', async (request, reply) => 
	{
		const { required, login, password } = request.body as { required: string, login: string, password: string };

		if (!login || !password || (required !== 'email' && required !== 'name'))
		{
			reply.status(400).send('Incomplete or invalid data');
	 		return;
		}

		try {
			const db = await getDb_user();
			const user = await db.get(`SELECT * FROM users WHERE ${required} = ?`, [login]);

			if (!user || !(await bcrypt.compare(password, user.password))) {
				if (required === 'email') {
					reply.status(200).send('Invalid email or password');
				}
				else {
					reply.status(200).send('Invalid username or password');
				}
				return;
			}

			reply.status(200).send({ id: user.id, name: user.name, profile_pic: user.profile_pic });

		}
		catch (err) {
			console.error(err);
			reply.status(500).send('Error');
		}
	});
}
