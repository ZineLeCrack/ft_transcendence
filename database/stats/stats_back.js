"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../database.js");
const router = (0, express_1.Router)();
router.post('/global', async (req, res) => {
    const { userId } = req.body;
    try {
        const db = await (0, database_js_1.getDb_user)();
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
exports.default = router;
