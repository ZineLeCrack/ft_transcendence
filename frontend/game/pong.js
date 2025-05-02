"use strict";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballSize = 10;
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
let rightPaddleY = canvasHeight / 2 - paddleHeight / 2;
const paddleSpeed = 7;
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;
let keyPressed = false;
let leftScore = 0;
let rightScore = 0;
ctx.font = "32px Arial";
draw();
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp")
        upPressed = true, keyPressed = true;
    if (e.key === "ArrowDown")
        downPressed = true, keyPressed = true;
    if (e.key === "w")
        wPressed = true, keyPressed = true;
    if (e.key === "s")
        sPressed = true, keyPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp")
        upPressed = false;
    if (e.key === "ArrowDown")
        downPressed = false;
    if (e.key === "w")
        wPressed = false;
    if (e.key === "s")
        sPressed = false;
});
function gameLoop() {
    if (rightScore === 5 || leftScore === 5) {
        ctx.fillText(rightScore === 5 ? "Player 2 win" : "Player 1 win", canvasWidth / 2 - 70, canvasHeight / 2);
        rightScore = 0;
        leftScore = 0;
    }
    if (keyPressed) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY < 0 || ballY > canvasHeight - ballSize)
        ballSpeedY *= -1;
    if (ballX < paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight) {
        if (ballY < leftPaddleY + (paddleHeight / 3)) {
            if (ballSpeedY < 0) {
                if (ballSpeedY > -7)
                    ballSpeedY -= 2;
            }
            else {
                if (ballSpeedY > 3)
                    ballSpeedY -= 2;
            }
        }
        else if (ballY > leftPaddleY + (2 * paddleHeight / 3)) {
            if (ballSpeedY < 0) {
                if (ballSpeedY < -3)
                    ballSpeedY += 2;
            }
            else {
                if (ballSpeedY < 7)
                    ballSpeedY += 2;
            }
        }
        ballSpeedX *= -1;
    }
    if (ballX > canvasWidth - paddleWidth - ballSize &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight) {
        if (ballY < rightPaddleY + (paddleHeight / 3)) {
            if (ballSpeedY < 0) {
                if (ballSpeedY > -7)
                    ballSpeedY -= 2;
            }
            else {
                if (ballSpeedY > 3)
                    ballSpeedY -= 2;
            }
        }
        else if (ballY > rightPaddleY + (2 * paddleHeight / 3)) {
            if (ballSpeedX < 0) {
                if (ballSpeedY < -3)
                    ballSpeedY += 2;
            }
            else {
                if (ballSpeedY < 7)
                    ballSpeedY += 2;
            }
        }
        ballSpeedX *= -1;
    }
    if (upPressed && rightPaddleY > 0)
        rightPaddleY -= paddleSpeed;
    if (downPressed && rightPaddleY < canvasHeight - paddleHeight)
        rightPaddleY += paddleSpeed;
    if (wPressed && leftPaddleY > 0)
        leftPaddleY -= paddleSpeed;
    if (sPressed && leftPaddleY < canvasHeight - paddleHeight)
        leftPaddleY += paddleSpeed;
    if (ballX < 0) {
        keyPressed = false;
        ballX = canvasWidth / 2;
        ballY = canvasHeight / 2;
        ballSpeedY = 5;
        ballSpeedX *= -1;
        rightScore++;
    }
    if (ballX > canvasWidth) {
        keyPressed = false;
        ballX = canvasWidth / 2;
        ballY = canvasHeight / 2;
        ballSpeedY = 5;
        ballSpeedX *= -1;
        leftScore++;
    }
}
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillText(leftScore.toString(), 200, 25);
    ctx.fillText(rightScore.toString(), 600, 25);
    ctx.fillRect(canvasWidth / 2 + 4, 0, 2, 600);
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}
gameLoop();
