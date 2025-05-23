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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && zz(!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fastify_1 = require("fastify");
var cors_1 = require("@fastify/cors");
var fs_1 = require("fs");
var httpsPort = 4242;
var privateKey = fs_1["default"].readFileSync('/certs/transcend.key', 'utf8');
var certificate = fs_1["default"].readFileSync('/certs/transcend.crt', 'utf8');
var IP_NAME = process.env.IP_NAME || "10.12.200.0";
var fastify = (0, fastify_1["default"])({
    logger: true,
    https: {
        key: privateKey,
        cert: certificate
    }
});
await fastify.register(cors_1["default"], {
    origin: true,
    credentials: true
});
var ballX = 400;
var ballY = 300;
var ballSpeedX = 0;
var ballSpeedY = 0;
var leftPaddleY = 250;
var rightPaddleY = 250;
var leftScore = 0;
var rightScore = 0;
var newSpeedX = 0;
var newSpeedY = 0;
var gameStarted = false;
var message = "Press space to start !";
fastify.get('/state', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, { ballX: ballX, ballY: ballY, leftPaddleY: leftPaddleY, rightPaddleY: rightPaddleY, leftScore: leftScore, rightScore: rightScore, message: message }];
    });
}); });
fastify.get('/start', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, { gameStarted: gameStarted }];
    });
}); });
fastify.post('/start', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!gameStarted) {
            message = "";
            gameStarted = true;
            ballSpeedX = 5;
            ballSpeedY = 5;
            leftScore = 0;
            rightScore = 0;
        }
        reply.code(200).send();
        return [2 /*return*/];
    });
}); });
fastify.post('/move', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var keys;
    return __generator(this, function (_a) {
        keys = request.body.keys;
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
        reply.code(200).send();
        return [2 /*return*/];
    });
}); });
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
fastify.post('/ai/ai.php', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, paddlePosition, ballPosition, paddleY, ballY, direction;
    return __generator(this, function (_b) {
        _a = request.body, paddlePosition = _a.paddlePosition, ballPosition = _a.ballPosition;
        paddleY = paddlePosition;
        ballY = ballPosition.y;
        direction = 'none';
        if (ballY < paddleY)
            direction = 'up';
        else if (ballY > paddleY + 100)
            direction = 'down';
        reply.send({ direction: direction, duration: 200 });
        return [2 /*return*/];
    });
}); });
fastify.listen({ port: httpsPort, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log("HTTPS Fastify server running at https://".concat(IP_NAME, ":").concat(httpsPort));
    updateGame();
});
