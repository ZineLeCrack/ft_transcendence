"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const websocket_chat_js_1 = require("./chat/websocket_chat.js");
const auth_back_js_1 = __importDefault(require("./auth/auth_back.js"));
const history_back_js_1 = __importDefault(require("./stats/history_back.js"));
const chat_back_js_1 = __importDefault(require("./chat/chat_back.js"));
const check_a2f_js_1 = __importDefault(require("./a2f/check_a2f.js"));
dotenv_1.default.config();
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const IP_NAME = process.env.IP_NAME || '10.12.200.0';
async function main() {
    const app = (0, fastify_1.default)({
        logger: false,
        https: {
            key: privateKey,
            cert: certificate,
        },
    });
    await app.register(cors_1.default, { origin: true });
    await app.register(auth_back_js_1.default);
    await app.register(history_back_js_1.default);
    await app.register(chat_back_js_1.default);
    await app.register(check_a2f_js_1.default);
    await app.listen({ port: 3451, host: '0.0.0.0' });
    // Récupérer le serveur HTTP natif après le démarrage
    const server = app.server; // <- voilà ce qu'il te faut pour `WebSocketServer`
    (0, websocket_chat_js_1.setupWebSocket)(server); // Connecte ton WebSocket ici
    console.log(`HTTPS server running at https://${IP_NAME}:3451`);
}
main();
