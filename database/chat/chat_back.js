"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../database.js");
const router = (0, express_1.Router)();
router.post('/sendinfo', async (req, res) => {
    const { username, content } = req.body;
    if (!username || !content) {
        res.status(400).send('Incomplete data');
        return;
    }
    try {
        const db = await (0, database_js_1.getDb_chat)();
        await db.run(`INSERT INTO chat (username, content) VALUES (?, ?)`, [username, content]);
        res.status(200).json({ username, content });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
router.post('/getmessages', async (req, res) => {
    try {
        const db = await (0, database_js_1.getDb_chat)();
        const messages = await db.all(`SELECT * FROM chat`);
        res.status(200).json({ tab: messages });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.default = router;
