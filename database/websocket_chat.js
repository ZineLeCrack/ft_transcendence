"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = require("ws");
const database_js_1 = require("./database.js");
const clients = new Set();
function setupWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('Client connecté via WebSocket');
        clients.add(ws);
        ws.on('close', () => {
            console.log('Client déconnecté');
            clients.delete(ws);
        });
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                const { username, content } = data;
                if (!username || !content)
                    return;
                const db = await (0, database_js_1.getDb_chat)();
                await db.run(`INSERT INTO chat (username, content) VALUES (?, ?)`, [username, content]);
                for (const client of clients) {
                    if (client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({ username, content }));
                    }
                }
            }
            catch (err) {
                console.error('Erreur WebSocket :', err);
            }
        });
    });
}
