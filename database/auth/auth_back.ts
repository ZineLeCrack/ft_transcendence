import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb_user } from '../database.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/submit', async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password)
    {
        res.status(400).send('Incomplete data');
        return;
    }

	try {
		const db = await getDb_user();
		const hashedPassword = await bcrypt.hash(password, 10);

		// Générer un nom unique pour l’image de profil
		const uniqueFilename = `uploads/${uuidv4()}.png`;
		fs.copyFileSync('uploads/default.png', uniqueFilename);

		await db.run(
			`INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)`,
			[username, email, hashedPassword, uniqueFilename]
		);

		res.status(200).send('User created');
	} catch (err) {
		console.error(err);
		res.status(500).send('Error');
	}
});


router.post('/login', async (req, res) => {
	const { required, login, password } = req.body;
	if (!login || !password || (required !== 'email' && required !== 'name'))
    {
        res.status(400).send('Incomplete or invalid data');
        return;
    }

	try {
		const db = await getDb_user();
		const user = await db.get(`SELECT * FROM users WHERE ${required} = ?`, [login]);

		if (!user || !(await bcrypt.compare(password, user.password)))
        {
			res.status(401).send('Invalid credentials');
            return;
        }

		res.status(200).json({ id: user.id, name: user.name, profile_pic: user.profile_pic });

	} catch (err) {
		console.error(err);
		res.status(500).send('Error');
	}
});

export default router;
