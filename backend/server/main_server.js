"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const child_process_1 = require("child_process");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const net_1 = __importDefault(require("net"));
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = (0, express_1.default)();
const baseGamePort = 3000;
let nextPort = baseGamePort;
https_1.default.createServer(credentials, app).listen(4000, '0.0.0.0', () => {
    console.log('🔐 HTTPS Master server running at https://10.12.200.87:4000');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/start', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let port = baseGamePort;
    while (!(yield isPortFree(port)))
        port++;
    if (port > 3050) {
        console.log(`Cannot start game server, all ports are used`);
        return;
    }
    const child = (0, child_process_1.spawn)('node', ['server/server.js', port.toString()], {
        stdio: 'inherit',
    });
    console.log(`🎮 Game server starting on port ${port}`);
    res.json({ url: `https://10.12.200.87:${port}` });
}));
function isPortFree(port) {
    return new Promise((resolve) => {
        const tester = net_1.default.createServer()
            .once('error', () => resolve(false))
            .once('listening', () => {
            tester.close();
            resolve(true);
        })
            .listen(port);
    });
}
// app.listen(4000, () =>
// {
// 	console.log('🌐 Master server running on https://10.12.200.65:4000');
// });
