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
// fonction qui reload les positions des pads et de la balle ainsi que les
// scores et dessine
function fetchState() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('http://localhost:3000/state');
        const data = yield res.json();
        ballX = data.ballX;
        ballY = data.ballY;
        leftPaddleY = data.leftPaddleY;
        rightPaddleY = data.rightPaddleY;
        leftScore = data.leftScore;
        rightScore = data.rightScore;
        draw();
    });
}
// evenement de touche pressee
document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key] = true;
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
    game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    game.fillRect(ballX, ballY, 10, 10);
    score.fillStyle = "black";
    score.fillText(leftScore.toString(), 20, 50);
    score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}
// envoie l'etat des touches 100x par seconde
setInterval(() => {
    fetch('http://localhost:3000/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys })
    });
}, 10);
// recupere toutes les valeurs et dessine avec 100 fps
setInterval(fetchState, 10);
