"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_back_js_1 = __importDefault(require("./auth/auth_back.js"));
const history_back_js_1 = __importDefault(require("./stats/history_back.js"));
const stats_back_js_1 = __importDefault(require("./stats/stats_back.js"));
const websocket_chat_js_1 = require("./chat/websocket_chat.js");
const chat_back_js_1 = __importDefault(require("./chat/chat_back.js"));
dotenv_1.default.config();
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || '10.12.200.0';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_back_js_1.default);
app.use(history_back_js_1.default);
app.use(stats_back_js_1.default);
app.use(chat_back_js_1.default);
const httpsServer = https_1.default.createServer(credentials, app);
(0, websocket_chat_js_1.setupWebSocket)(httpsServer); // 👈 ici on branche le WebSocket
httpsServer.listen(3451, '0.0.0.0', () => {
    console.log(`HTTPS server running at https://${IP_NAME}:3451`);
});
