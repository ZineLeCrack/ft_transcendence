"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var fs_1 = require("fs");
var https_1 = require("https");
var app = (0, express_1["default"])();
var httpsPort = parseInt(process.argv[2], 10);
var privateKey = fs_1["default"].readFileSync('/certs/transcend.key', 'utf8');
var certificate = fs_1["default"].readFileSync('/certs/transcend.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
app.use((0, cors_1["default"])({ origin: true, credentials: true }));
app.use(express_1["default"].json());
var ballX = 400;
var ballY = 300;
var ballSpeedX = 0;
var ballSpeedY = 0;
var leftPaddleY = 250;
var rightPaddleY = 250;
var leftScore = 0;
var rightScore = 0;
var countDown = 0;
var newSpeedX = 0;
var newSpeedY = 0;
var gameStarted = false;
var leftOldY = leftPaddleY;
var rightOldY = rightPaddleY;
var message = "Press space to start !";
app.get('/state', function (req, res) {
    res.json({ ballX: ballX, ballY: ballY, leftPaddleY: leftPaddleY, rightPaddleY: rightPaddleY, leftScore: leftScore, rightScore: rightScore, message: message });
});
app.get('/start', function (req, res) {
    res.json({ gameStarted: gameStarted });
});
app.post('/start', function (req, res) {
    if (!gameStarted) {
        message = "";
        gameStarted = true;
        ballSpeedX = 5;
        ballSpeedY = 5;
        leftScore = 0;
        rightScore = 0;
    }
    res.sendStatus(200);
});
app.post('/move', function (req, res) {
    var keys = req.body.keys;
    leftOldY = leftPaddleY;
    rightOldY = rightPaddleY;
    if (keys.ArrowUp)
        rightPaddleY -= 10;
    if (keys.ArrowDown)
        rightPaddleY += 10;
    if (keys.w)
        leftPaddleY -= 10;
    if (keys.s)
        leftPaddleY += 10;
    rightPaddleY = Math.max(0, Math.min(500, rightPaddleY));
    leftPaddleY = Math.max(0, Math.min(500, leftPaddleY));
    res.sendStatus(200);
});
function updateGame() {
    if (gameStarted) {
        if (leftScore === 5 || rightScore === 5) {
            gameStarted = false;
            message = leftScore === 5 ? "Player 1 win !" : "Player 2 win !";
            setTimeout(function () {
                if (!gameStarted) {
                    leftScore = 0;
                    rightScore = 0;
                    message = "Press space to start !";
                }
            }, 5000);
        }
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if (ballY <= 0 || ballY >= 590)
            ballSpeedY = -ballSpeedY;
        if (ballSpeedX < 0) {
            if (ballX <= 15 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100) {
                ballSpeedX = -ballSpeedX;
                if (ballSpeedX < 10)
                    ballSpeedX += 0.5;
                if (ballSpeedY < 0) {
                    if (ballY < leftPaddleY + 34) {
                        if (ballSpeedY > -7)
                            ballSpeedY -= 2;
                    }
                    else if (ballY > leftPaddleY + 66) {
                        if (ballSpeedY < -3)
                            ballSpeedY += 2;
                    }
                }
                else {
                    if (ballY < leftPaddleY + 34) {
                        if (ballSpeedY > 3)
                            ballSpeedY -= 2;
                    }
                    else if (ballY > leftPaddleY + 66) {
                        if (ballSpeedY < 7)
                            ballSpeedY += 2;
                    }
                }
            }
        }
        else {
            if (ballX >= 775 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100) {
                if (ballSpeedX < 10)
                    ballSpeedX += 0.5;
                ballSpeedX = -ballSpeedX;
                if (ballSpeedY < 0) {
                    if (ballY < rightPaddleY + 34) {
                        if (ballSpeedY > -7)
                            ballSpeedY -= 2;
                    }
                    else if (ballY > rightPaddleY + 66) {
                        if (ballSpeedY < -3)
                            ballSpeedY += 2;
                    }
                }
                else {
                    if (ballY < rightPaddleY + 34) {
                        if (ballSpeedY > 3)
                            ballSpeedY -= 2;
                    }
                    else if (ballY > rightPaddleY + 66) {
                        if (ballSpeedY < 7)
                            ballSpeedY += 2;
                    }
                }
            }
        }
        if (ballX <= 0) {
            rightScore++;
            resetBall();
        }
        else if (ballX >= 800) {
            leftScore++;
            resetBall();
        }
    }
    if (rightOldY === rightPaddleY && leftOldY === leftPaddleY) {
        countDown++;
        if (countDown > 2000) {
            message = "TIMEOUT";
            setTimeout(function () {
                process.exit(0);
            }, 100);
        }
    }
    else
        countDown = 0;
    setTimeout(updateGame, 16);
}
function resetBall() {
    ballX = 400;
    ballY = 300;
    newSpeedX = ballSpeedX < 0 ? 5 : -5;
    newSpeedY = ballSpeedY < 0 ? 5 : -5;
    ballSpeedX = 0;
    ballSpeedY = 0;
    if (leftScore != 5 && rightScore != 5) {
        message = "3";
        setTimeout(function () {
            message = "2";
        }, 1000);
        setTimeout(function () {
            message = "1";
        }, 2000);
        setTimeout(function () {
            ballSpeedX = newSpeedX;
            ballSpeedY = newSpeedY;
            message = "";
        }, 3000);
    }
}
https_1["default"].createServer(credentials, app).listen(httpsPort, '0.0.0.0', function () {
    console.log("HTTPS server running at https://10.12.200.87:".concat(httpsPort));
    updateGame();
});
