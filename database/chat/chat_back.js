"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chatRoutes;
const database_js_1 = require("../database.js");
async function chatRoutes(fastify) {
    fastify.post('/sendinfo', async (request, reply) => {
        const { username, content } = request.body;
        if (!username || !content) {
            reply.status(400).send('Incomplete data');
            return;
        }
        try {
            const db = await (0, database_js_1.getDb_chat)();
            await db.run(`INSERT INTO chat (username, content) VALUES (?, ?)`, [username, content]);
            reply.status(200).send({ username, content });
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Server error');
        }
    });
    fastify.post('/getmessages', async (_request, reply) => {
        try {
            const db = await (0, database_js_1.getDb_chat)();
            const messages = await db.all(`SELECT * FROM chat`);
            reply.status(200).send({ tab: messages });
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Server error');
        }
    });
}
