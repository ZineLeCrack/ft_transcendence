var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { draw } from "./drawmap.js";
export let ballX = 400;
export let ballY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export let leftScore = 0;
export let rightScore = 0;
export const paddleWidth = 8;
export const paddleHeight = 100;
export let message = "";
// Dictionnaire pour stocker les touches pressées
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
let gameStarted = false;
const port = localStorage.getItem("pongServerPort");
// 🔐 Mettre ici l'adresse du serveur HTTPS
const SERVER_URL = `https://10.12.200.65:${port}`;
function fetchState() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${SERVER_URL}/state`);
            const data = yield res.json();
            ballX = data.ballX;
            ballY = data.ballY;
            leftPaddleY = data.leftPaddleY;
            rightPaddleY = data.rightPaddleY;
            leftScore = data.leftScore;
            rightScore = data.rightScore;
            message = data.message;
            draw();
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
setInterval(() => {
    fetch(`${SERVER_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    }).catch(err => console.error("Erreur POST /move:", err));
}, 16);
setInterval(fetchState, 16);
