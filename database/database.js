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
const bcrypt_1 = __importDefault(require("bcrypt"));
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";
const app = (0, express_1.default)();
const dbPath = './user.db';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/submit', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).send('Incomplete data');
        return;
    }
    try {
        const db = await getDb();
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);
        res.status(200).send('User created');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
app.post('/login', async (req, res) => {
    const { required, login, password } = req.body;
    if (!login || !password || (required !== 'email' && required !== 'name')) {
        res.status(400).send('Incomplete or invalid data');
        return;
    }
    try {
        const db = await getDb();
        const query = `SELECT * FROM users WHERE ${required} = ?`;
        const user = await db.get(query, [login]);
        if (!user) {
            res.status(401).send('Invalid credentials');
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send('Invalid credentials');
            return;
            return;
        }
        console.log('User log in:', user);
        res.status(200).json({ id: user.id, name: user.name });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
async function getDb() {
    return (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
}
https_1.default.createServer(credentials, app).listen(3451, '0.0.0.0', () => {
    console.log(`HTTPS database server running at https://${IP_NAME}:3451`);
});
