import { Router } from 'express';
import { getDb_user } from '../database.js';

const router = Router();

router.post('/global', async (req, res) => {
    const { userId } = req.body;

    try {
        const db = await getDb_user();
        const rows = await db.all(`
            SELECT 
                s.game_playeds,
                s.wins,
                s.loses,
                s.total_points,
            FROM stats s
            WHERE s.id_player = ?
        `, [userId]);

        const formatted = rows.map(row => ({
            game_playeds: row.game_playeds,
            wins: row.wins,
            loses: row.loses,
            total_points: row.total_points,
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

export default router;
