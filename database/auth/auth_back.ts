import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) 
{
  fastify.post('/submit', async (request, reply) => {
	const { username, email, password } = request.body as { username: string, email: string, password: string };
	if (!username || !email || !password) {
	  reply.status(400).send('Incomplete data');
	  return;
	}

	try {
	  const db = await getDb_user();
	  const hashedPassword = await bcrypt.hash(password, 10);

	  const uniqueFilename = `uploads/${uuidv4()}.png`;
	  fs.copyFileSync('uploads/default.png', uniqueFilename);

	  await db.run(
		`INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)`,
		[username, email, hashedPassword, uniqueFilename]
	  );

	  reply.status(200).send('User created');
	} catch (err) {
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
		reply.status(401).send('Invalid credentials');
		return;
	  }

	  reply.status(200).send({ id: user.id, name: user.name, profile_pic: user.profile_pic });

	} catch (err) {
	  console.error(err);
	  reply.status(500).send('Error');
	}
  });
}
