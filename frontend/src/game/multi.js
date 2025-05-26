var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { draw } from "./drawmap_multi.js";
const player = localStorage.getItem("player");
export let ballX = 400;
export let ballY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export let leftScore = 0;
export let rightScore = 0;
export const paddleWidth = 8;
export const paddleHeight = 100;
export let message = "";
let keys = {
    ArrowUp: false,
    ArrowDown: false
};
let gameStarted = false;
const gameId = localStorage.getItem("gameId");
const SERVER_URL = `https://10.12.200.81:4001/game/${gameId}`;
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
document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key in keys)
        keys[e.key] = false;
});
setInterval(() => {
    fetch(`${SERVER_URL}/${player}move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    }).catch(err => console.error("Erreur POST /move:", err));
}, 16);
setInterval(fetchState, 16);
