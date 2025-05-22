import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb_user } from './database.js';

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
		await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);
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

		res.status(200).json({ id: user.id, name: user.name });
	} catch (err) {
		console.error(err);
		res.status(500).send('Error');
	}
});

export default router;
