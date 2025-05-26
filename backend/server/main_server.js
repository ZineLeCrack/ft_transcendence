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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const game_router_js_1 = __importDefault(require("./game_router.js")); // ton routeur de jeu en mode plugin Fastify
dotenv_1.default.config();
const privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
const IP_NAME = process.env.IP_NAME || '10.12.200.0';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, fastify_1.default)({
            logger: false,
            https: {
                key: privateKey,
                cert: certificate,
            },
        });
        // 🔓 Autoriser les requêtes cross-origin
        yield app.register(cors_1.default, { origin: true });
        // 🕹️ Routes du jeu multijoueur
        yield app.register(game_router_js_1.default, { prefix: '/game' });
        // 🚀 Lancer le serveur
        yield app.listen({ port: 4000, host: '0.0.0.0' });
        console.log(`🔐 HTTPS Master Game Server running at https://${IP_NAME}:4000`);
    });
}
main().catch(err => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
});
