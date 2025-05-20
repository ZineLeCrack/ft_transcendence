"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const game_session_1 = require("./game_session");
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
const sessions = new Map();
// Start a new game session
app.post('/start', (req, res) => {
    const id = (0, uuid_1.v4)();
    const session = new game_session_1.GameSession(id);
    sessions.set(id, session);
    res.json({ id, url: `https://10.12.200.81/game/local/${id}` });
});
// Middleware to load session
app.use('/game/local/:id', (req, res, next) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        res.status(404).send('Session not found');
        return;
    }
    req.session = session;
    next();
});
// Game state endpoint
app.get('/game/local/:id/state', (req, res) => {
    const s = req.session;
    res.json({
        ballX: s.ballX,
        ballY: s.ballY,
        leftPaddleY: s.leftPaddleY,
        rightPaddleY: s.rightPaddleY,
        leftScore: s.leftScore,
        rightScore: s.rightScore,
        message: s.message,
    });
});
// Start game endpoint
app.post('/game/local/:id/start', (req, res) => {
    req.session.startGame();
    res.sendStatus(200);
});
// Paddle movement endpoint
app.post('/game/local/:id/move', (req, res) => {
    req.session.move(req.body.keys);
    res.sendStatus(200);
});
