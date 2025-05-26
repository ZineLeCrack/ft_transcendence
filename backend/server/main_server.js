"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const game_router_js_1 = __importDefault(require("./game_router.js"));
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";
const app = (0, express_1.default)();
https_1.default.createServer(credentials, app).listen(4000, '0.0.0.0', () => {
    console.log(`🔐 HTTPS Master server running at https://${IP_NAME}:4000`);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/game', game_router_js_1.default);
