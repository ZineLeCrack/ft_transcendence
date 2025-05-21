"use strict";
exports.__esModule = true;
exports.draw = void 0;
var pong_js_1 = require("./pong.js");
/* ------------------------------- STAT PART ---------------------------------------- */
var leftCanvas = document.getElementById("statPlayer1");
var rightCanvas = document.getElementById("statPlayer2");
var left = leftCanvas.getContext("2d");
var right = rightCanvas.getContext("2d");
left.font = "40px 'Caveat'";
right.font = "40px 'Caveat'";
/* ------------------------------- GAME PART ---------------------------------------- */
var gameCanvas = document.getElementById("gameCanvas");
var topCanvas = document.getElementById("topCanvas");
var game = gameCanvas.getContext("2d");
var score = topCanvas.getContext("2d");
var gameDiv = document.getElementById('gameDiv');
// position et score par défaut
score.font = "40px 'Caveat'";
game.font = "80px 'Caveat'";
function draw() {
    game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    score.clearRect(0, 0, topCanvas.width, topCanvas.height);
    game.fillStyle = "#FFFFFF";
    game.shadowColor = "#FFFFFF";
    game.shadowBlur = 10;
    game.fillText(pong_js_1.message, 400 - (pong_js_1.message.length * 14), 150);
    for (var i = 0; i < 600; i += 18.9)
        game.fillRect(404, i, 2, 15);
    game.fillStyle = "#00FFFF";
    game.shadowColor = "#00FFFF";
    game.shadowBlur = 10;
    game.fillRect(5, pong_js_1.leftPaddleY, pong_js_1.paddleWidth, pong_js_1.paddleHeight);
    game.fillStyle = "#FF007A";
    game.shadowColor = "#FF007A";
    game.shadowBlur = 10;
    game.fillRect(gameCanvas.width - pong_js_1.paddleWidth - 5, pong_js_1.rightPaddleY, pong_js_1.paddleWidth, pong_js_1.paddleHeight);
    game.fillStyle = "#FFFFFF";
    game.shadowColor = "#FFFFFF";
    game.shadowBlur = 10;
    game.fillRect(pong_js_1.ballX, pong_js_1.ballY, 10, 10);
    score.fillStyle = "#00FFFF";
    score.shadowColor = "#00FFFF";
    score.shadowBlur = 10;
    score.fillText(pong_js_1.leftScore.toString(), 20, 50);
    score.fillStyle = "#FF007A";
    score.shadowColor = "#FF007A";
    score.shadowBlur = 10;
    score.fillText(pong_js_1.rightScore.toString(), topCanvas.width - 50, 50);
}
exports.draw = draw;
