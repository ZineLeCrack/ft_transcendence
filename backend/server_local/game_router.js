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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = gameRouter;
const server_js_1 = require("./server.js");
const games = new Map();
function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}
function gameRouter(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // 🎮 Créer une nouvelle partie
        fastify.post('/start', (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const id = generateGameId();
            const game = new server_js_1.GameInstance();
            games.set(id, game);
            console.log(`🎮 Partie créée : ${id}`);
            reply.send({ gameId: id });
        }));
        // 📦 Récupérer l'état de la partie
        fastify.get('/:id/state', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const game = games.get(id);
            if (!game)
                return reply.status(404).send({ error: "Game not found" });
            reply.send(game.getState());
        }));
        // ▶️ Démarrer la partie
        fastify.post('/:id/start', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const game = games.get(id);
            if (!game)
                return reply.status(404).send({ error: "Game not found" });
            game.startGame();
            reply.status(200).send({ status: "started" });
        }));
        // 🎮 Déplacer les raquettes
        fastify.post('/:id/move', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const game = games.get(id);
            if (!game)
                return reply.status(404).send({ error: "Game not found" });
            const body = request.body;
            game.move(body.keys);
            reply.status(200).send({ status: "ok" });
        }));
    });
}
