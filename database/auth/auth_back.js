"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_js_1 = require("../database.js");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
async function authRoutes(fastify) {
    fastify.post('/submit', async (request, reply) => {
        const { username, email, password } = request.body;
        if (!username || !email || !password) {
            reply.status(400).send('Incomplete data');
            return;
        }
        try {
            const db = await (0, database_js_1.getDb_user)();
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const uniqueFilename = `uploads/${(0, uuid_1.v4)()}.png`;
            fs_1.default.copyFileSync('uploads/default.png', uniqueFilename);
            await db.run(`INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)`, [username, email, hashedPassword, uniqueFilename]);
            reply.status(200).send('User created');
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Error');
        }
    });
    fastify.post('/login', async (request, reply) => {
        const { required, login, password } = request.body;
        if (!login || !password || (required !== 'email' && required !== 'name')) {
            reply.status(400).send('Incomplete or invalid data');
            return;
        }
        try {
            const db = await (0, database_js_1.getDb_user)();
            const user = await db.get(`SELECT * FROM users WHERE ${required} = ?`, [login]);
            if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
                reply.status(401).send('Invalid credentials');
                return;
            }
            reply.status(200).send({ id: user.id, name: user.name, profile_pic: user.profile_pic });
        }
        catch (err) {
            console.error(err);
            reply.status(500).send('Error');
        }
    });
}
