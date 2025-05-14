"use strict";
/* ------------------------------- STAT PART ---------------------------------------- */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const leftCanvas = document.getElementById("statPlayer1");
const rightCanvas = document.getElementById("statPlayer2");
const left = leftCanvas.getContext("2d");
const right = rightCanvas.getContext("2d");
left.font = "40px 'Caveat'";
right.font = "40px 'Caveat'";
setTimeout(() => {
    left.fillText("⬆️: up", 0, 40, leftCanvas.width);
    left.fillText("⬇️: down", 0, 85, leftCanvas.width);
    right.fillText("W: up", 0, 40, rightCanvas.width);
    right.fillText("S: down", 0, 85, rightCanvas.width);
}, 100);
/* ------------------------------- GAME PART ---------------------------------------- */
const gameCanvas = document.getElementById("gameCanvas");
const topCanvas = document.getElementById("topCanvas");
const game = gameCanvas.getContext("2d");
const score = topCanvas.getContext("2d");
// position et score par defaut
let ballX = 400;
let ballY = 300;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;
const paddleWidth = 10;
const paddleHeight = 100;
// Dictionnaire pour stocker les touches pressees ou non
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
let gameStarted = false;
let message = "";
score.font = "40px 'Caveat'";
game.font = "80px 'Caveat'";
// fonction qui reload les positions des pads et de la balle ainsi que les
// scores et dessine
function fetchState() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('https://localhost:3000/state');
        const data = yield res.json();
        ballX = data.ballX;
        ballY = data.ballY;
        leftPaddleY = data.leftPaddleY;
        rightPaddleY = data.rightPaddleY;
        leftScore = data.leftScore;
        rightScore = data.rightScore;
        message = data.message;
        draw();
    });
}
// evenement de touche pressee
document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key] = true;
    if (e.key === " ") {
        fetch("https://localhost:3000/start", { method: "POST" });
        gameStarted = true;
    }
});
// evenement de touche relachee
document.addEventListener("keyup", (e) => {
    if (e.key in keys)
        keys[e.key] = false;
});
// fonction qui dessine dans le canvas
function draw() {
    game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    score.clearRect(0, 0, topCanvas.width, topCanvas.height);
    game.fillStyle = "black";
    game.fillText(message, 400 - (message.length * 14), 150);
    for (let i = 0; i < 600; i += 18.9)
        game.fillRect(404, i, 2, 15);
    game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    game.fillRect(ballX, ballY, 10, 10);
    score.fillStyle = "black";
    score.fillText(leftScore.toString(), 20, 50);
    score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}
// envoie l'etat des touches 60x par seconde
setInterval(() => {
    fetch('https://localhost:3000/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    });
}, 16);
// recupere toutes les valeurs et dessine avec 60 fps
setInterval(fetchState, 16);
