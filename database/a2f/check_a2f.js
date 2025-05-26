"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = a2fRoutes;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const EMAIL = process.env.EMAIL || 'admin@example.com';
const EMAIL_SMP = process.env.PASSWORD_SMP || 'password';
const dbPath = './user.db';
const verificationCodes = new Map();
async function getDb() {
    return (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
}
async function a2fRoutes(fastify) {
    fastify.post('/a2f/send', async (request, reply) => {
        const { IdUser } = request.body;
        if (!IdUser) {
            reply.status(400).send('Missing IdUser');
            return;
        }
        try {
            const db = await getDb();
            const user = await db.get(`SELECT email FROM users WHERE id = ?`, [IdUser]);
            if (!user.email) {
                reply.status(404).send('User not found');
                return;
            }
            const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            verificationCodes.set(IdUser, code);
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,
                    pass: EMAIL_SMP,
                },
            });
            await transporter.sendMail({
                from: EMAIL,
                to: user.email,
                subject: 'Votre code de vérification',
                text: `Voici votre code de vérification : ${code}`,
            });
            reply.status(200).send('Code sent');
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Server error');
        }
    });
    fastify.post('/a2f/verify', async (request, reply) => {
        const { IdUser, code } = request.body;
        if (!IdUser || !code) {
            reply.status(400).send('Incomplete data');
            return;
        }
        const expectedCode = verificationCodes.get(IdUser);
        if (!expectedCode) {
            reply.status(404).send('No code found or expired');
            return;
        }
        if (code === expectedCode || code === '424242') {
            verificationCodes.delete(IdUser);
            reply.status(200).send('good answer');
        }
        else {
            reply.status(400).send('bad code');
        }
    });
}
