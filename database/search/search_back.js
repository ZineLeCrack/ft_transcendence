"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = searchRoutes;
const database_js_1 = require("../database.js");
async function searchRoutes(fastify) {
    fastify.post('/search', async (request, reply) => {
        const { username } = request.body;
        if (!username) {
            reply.status(400).send({ exists: false, error: "No username provided" });
            return;
        }
        try {
            const db = await (0, database_js_1.getDb_user)();
            const user = await db.get(`SELECT * FROM users WHERE name = ?`, [username]);
            const exists = user;
            reply.status(200).send({ exists });
        }
        catch (err) {
            console.error("DB error:", err);
            reply.status(500).send({ exists: false, error: "Internal server error" });
        }
    });
}
