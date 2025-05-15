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
exports.message = exports.paddleHeight = exports.paddleWidth = exports.rightScore = exports.leftScore = exports.rightPaddleY = exports.leftPaddleY = exports.ballY = exports.ballX = void 0;
const drawmap_js_1 = require("./drawmap.js");
exports.ballX = 400;
exports.ballY = 300;
exports.leftPaddleY = 250;
exports.rightPaddleY = 250;
exports.leftScore = 0;
exports.rightScore = 0;
exports.paddleWidth = 10;
exports.paddleHeight = 100;
exports.message = "";
// Dictionnaire pour stocker les touches pressées
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
let gameStarted = false;
// 🔐 Mettre ici l'adresse du serveur HTTPS
const SERVER_URL = 'https://10.12.200.35:3000';
function fetchState() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${SERVER_URL}/state`);
            const data = yield res.json();
            exports.ballX = data.ballX;
            exports.ballY = data.ballY;
            exports.leftPaddleY = data.leftPaddleY;
            exports.rightPaddleY = data.rightPaddleY;
            exports.leftScore = data.leftScore;
            exports.rightScore = data.rightScore;
            exports.message = data.message;
            (0, drawmap_js_1.draw)();
        }
        catch (error) {
            console.error("Erreur de fetchState:", error);
        }
    });
}
// Événement touche pressée
document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key] = true;
    if (e.key === " ") {
        fetch(`${SERVER_URL}/start`, { method: "POST" });
        gameStarted = true;
    }
});
// Événement touche relâchée
document.addEventListener("keyup", (e) => {
    if (e.key in keys)
        keys[e.key] = false;
});
// Dessin sur canvas
// Envoi des touches 100x par seconde
setInterval(() => {
    fetch(`${SERVER_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    }).catch(err => console.error("Erreur POST /move:", err));
}, 10);
setInterval(fetchState, 10);
