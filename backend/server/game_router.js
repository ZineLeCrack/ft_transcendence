"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// gameRouter.ts
const express_1 = require("express");
const server_js_1 = require("./server.js");
const gameRouter = (0, express_1.Router)();
const games = new Map();
function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}
gameRouter.post('/start', (req, res) => {
    const id = generateGameId();
    const game = new server_js_1.GameInstance();
    games.set(id, game);
    console.log(`🎮 Partie créée : ${id}`);
    res.json({ gameId: id });
});
gameRouter.get('/:id/state', (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    res.json(game.getState());
});
gameRouter.post('/:id/start', (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    game.startGame();
    res.sendStatus(200);
});
gameRouter.post('/:id/move', (req, res) => {
    const game = games.get(req.params.id);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    game.move(req.body.keys);
    res.sendStatus(200);
});
exports.default = gameRouter;
