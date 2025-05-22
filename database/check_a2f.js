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
const nodemailer_1 = __importDefault(require("nodemailer"));
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";
const EMAIL = process.env.EMAIL || "10.12.200.0";
const EMAIL_SMP = process.env.PASSWORD_SMP || "10.12.200.0";
const app = (0, express_1.default)();
const dbPath = './user.db';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/a2f', async (req, res) => {
    const { code, IdUser } = req.body;
    if (!code || !IdUser) {
        res.status(400).send('Incomplete data');
        return;
    }
    try {
        const db = await getDb();
        const user = await db.get(`SELECT email FROM users WHERE id = ?`, [IdUser]);
        if (!user || !user.email) {
            res.status(404).send('User not found');
            return;
        }
        const realcode = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');
        // Envoie du code par email
        const transporter = nodemailer_1.default.createTransport({
            host: 'gmail',
            auth: {
                user: EMAIL,
                pass: EMAIL_SMP,
            }
        });
        await transporter.sendMail({
            from: '"Transcend Auth" <your_email@example.com>',
            to: user.email,
            subject: "Votre code de vérification",
            text: `Voici votre code de vérification : ${realcode}`,
        });
        if (code === realcode) {
            res.status(200).send('good answer');
        }
        else {
            res.status(500).send('bad code');
        }
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
https_1.default.createServer(credentials, app).listen(3534, '0.0.0.0', () => {
    console.log(`HTTPS ${EMAIL} ${EMAIL_SMP}database server running at https://${IP_NAME}:3534`);
});
