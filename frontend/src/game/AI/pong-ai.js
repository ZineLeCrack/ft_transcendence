var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { draw_ai } from './drawmap-ai.js';
// position et score par defaut
let ballVX = 0;
let ballVY = 0;
export let ballX = 400;
export let ballY = 300;
export let leftScore = 0;
export let rightScore = 0;
let oldBallX = 400;
let oldBallY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export const paddleWidth = 10;
export const paddleHeight = 100;
let gameStarted = false;
export let message = "";
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
const SERVER_URL = 'https://localhost:3000';
// scores et dessine
function FetchState() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${SERVER_URL}/state`);
            const data = yield res.json();
            ballVX = data.ballX - ballX;
            ballVY = data.ballY - ballY;
            oldBallX = ballX;
            oldBallY = ballY;
            ballX = data.ballX;
            ballY = data.ballY;
            leftPaddleY = data.leftPaddleY;
            rightPaddleY = data.rightPaddleY;
            leftScore = data.leftScore;
            rightScore = data.rightScore;
            message = data.message;
            if (ballVX == 0)
                ballVX = 5;
            draw_ai();
        }
        catch (error) {
            console.error("Erreur de fetchState:", error);
        }
    });
}
let aiAction = 'none';
let aiTimeout = null;
function callAI() {
    return __awaiter(this, void 0, void 0, function* () {
        //if (!gameStarted) return;
        try {
            const res = yield fetch("http://localhost:8000/ai_second.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paddlePosition: rightPaddleY,
                    ballPosition: { x: ballX, y: ballY },
                    ballDirection: { x: ballVX, y: ballVY }
                })
            });
            const data = yield res.json();
            // Annule toute action précédente si elle existe
            if (aiTimeout !== null) {
                clearTimeout(aiTimeout);
                aiTimeout = null;
            }
            // Réinitialise les touches IA
            keys["ArrowUp"] = false;
            keys["ArrowDown"] = false;
            // Applique la direction pour la durée spécifiée
            if (data.direction === "up") {
                keys["ArrowUp"] = true;
                aiAction = "up";
            }
            else if (data.direction === "down") {
                keys["ArrowDown"] = true;
                aiAction = "down";
            }
            else {
                aiAction = "none";
            }
            // Définir le timeout pour relâcher la touche après `duration` ms
            if (data.direction !== "none" && data.duration > 0) {
                aiTimeout = window.setTimeout(() => {
                    if (data.direction === "up")
                        keys["ArrowUp"] = false;
                    if (data.direction === "down")
                        keys["ArrowDown"] = false;
                    aiAction = "none";
                    aiTimeout = null;
                }, data.duration / 2);
            }
        }
        catch (e) {
            console.error("Erreur IA:", e);
        }
    });
}
// evenement de touche pressee
document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key] = true;
    if (e.key === " ") {
        fetch(`${SERVER_URL}/start`, { method: "POST" });
        gameStarted = true;
    }
});
// evenement de touche relachee
document.addEventListener("keyup", (e) => {
    if (e.key in keys)
        keys[e.key] = false;
});
setInterval(callAI, 1000);
// setInterval(callAI_second, 100);
// envoie l'etat des touches 100x par seconde
setInterval(() => {
    fetch(`${SERVER_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    });
}, 10);
// recupere toutes les valeurs et dessine avec 100 fps
setInterval(FetchState, 10);
