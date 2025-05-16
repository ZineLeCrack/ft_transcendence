"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const app = (0, express_1.default)();
const httpsPort = 3000;
const privateKey = fs_1.default.readFileSync('serv.key', 'utf8');
const certificate = fs_1.default.readFileSync('serv.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const corsOptions = {
    origin: 'https://localhost:443',
    credentials: true,
};
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
let ballX = 400;
let ballY = 300;
let ballSpeedX = 0;
let ballSpeedY = 0;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;
let newSpeedX = 0;
let newSpeedY = 0;
let gameStarted = false;
let message = "Press space to start !";
app.get('/state', (req, res) => {
    res.json({ ballX, ballY, leftPaddleY, rightPaddleY, leftScore, rightScore, message });
});
app.get('/start', (req, res) => {
    res.json({ gameStarted });
});
app.post('/start', (req, res) => {
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
app.post('/move', (req, res) => {
    const { keys } = req.body;
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
        if (leftScore === 5000 || rightScore === 5000) {
            gameStarted = false;
            message = leftScore === 5000 ? "Player 1 win !" : "Player 2 win !";
            setTimeout(() => {
                if (!gameStarted) {
                    leftScore = 0;
                    rightScore = 0;
                    message = "Press space to start !";
                }
            }, 5000);
        }
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        // IA basique : la raquette gauche suit la balle parfaitement
        leftPaddleY = ballY - 50;
        leftPaddleY = Math.max(0, Math.min(500, leftPaddleY)); // Pour rester dans les limites
        if (ballY <= 0 || ballY >= 600)
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
            if (ballX >= 785 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100) {
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
    setTimeout(updateGame, 16);
}
function resetBall() {
    ballX = 400;
    ballY = 300;
    newSpeedX = ballSpeedX < 0 ? 5 : -5;
    newSpeedY = ballSpeedY < 0 ? 5 : -5;
    ballSpeedX = 0;
    ballSpeedY = 0;
    if (leftScore != 5000 && rightScore != 5000) {
        message = "3";
        setTimeout(() => {
            message = "2";
        }, 1000);
        setTimeout(() => {
            message = "1";
        }, 2000);
        setTimeout(() => {
            ballSpeedX = newSpeedX;
            ballSpeedY = newSpeedY;
            message = "";
        }, 3000);
    }
}
https_1.default.createServer(credentials, app).listen(httpsPort, '0.0.0.0', () => {
    console.log(`HTTPS server running at https://localhost:${httpsPort}`);
    updateGame();
});
