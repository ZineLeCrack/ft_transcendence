"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addhistoryRoutes;
const database_js_1 = require("../database.js");
async function addhistoryRoutes(fastify) {
    fastify.post('/addhistory', async (request, reply) => {
        const { Id1, Id2, score1, score2 } = request.body;
        try {
            const db = await (0, database_js_1.getDb_user)();
            const rows = await db.all(`
        INSERT INTO history (id_player1, id_player2, point_player1, point_player2, game_date) values (?, ?, ?, ?, '27/05/25 17:48');
        `, [Id1, Id2, score1, score2] // DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATE AAAAAA CHANGEEEEEEEEEEEEEEEEEEEEEEEEEER
            );
            reply.send({ success: true });
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Error');
        }
    });
}
