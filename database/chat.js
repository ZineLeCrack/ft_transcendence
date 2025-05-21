"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = (0, express_1.default)();
const dbPath = './chat.db';
https_1.default.createServer(credentials, app).listen(3452, '0.0.0.0', () => {
    console.log('HTTPS database server running at https://10.12.200.81:3452');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/sendinfo', async (req, res) => {
    const { username, content } = req.body;
    if (!username || !content) {
        res.status(400).send('Incomplete data');
        return;
    }
    try {
        const db = await getDb();
        await db.run(`INSERT INTO chat (username, content) VALUES (?, ?)`, [username, content]);
        res.status(200).json({ username: username, content: content });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.post('/getmessages', async (req, res) => {
    try {
        const db = await getDb();
        const messages = await db.all(`SELECT * FROM chat`);
        res.status(200).json({ tab: messages });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
async function getDb() {
    return (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
}
