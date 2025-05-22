import { Router } from 'express';
import { getDb_user } from './database.js';

const router = Router();

router.post('/history', async (req, res) => {
	const { userId } = req.body;

	try {
		const db = await getDb_user();
		const rows = await db.all(`
			SELECT h.point_player1, h.point_player2, h.game_date,
				   u1.name AS usernameplayer1, u2.name AS usernameplayer2
			FROM history h
			JOIN users u1 ON h.id_player1 = u1.id
			JOIN users u2 ON h.id_player2 = u2.id
			WHERE u1.id = ? OR u2.id = ?
			ORDER BY h.game_date DESC
		`, [userId, userId]);

		const formatted = rows.map(row => ({
			imageplayer1: "/src/images/pdp_cle-berr.png",
			imageplayer2: "/src/images/pdp_rlebaill.jpeg",
			usernameplayer1: row.usernameplayer1,
			usernameplayer2: row.usernameplayer2,
			pointplayer1: row.point_player1,
			pointplayer2: row.point_player2,
			date: row.game_date,
			result: row.point_player1 > row.point_player2 ? 'win' : 'lose',
		}));

		res.json(formatted);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error');
	}
});

export default router;
