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
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
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
exports.message = exports.paddleHeight = exports.paddleWidth = exports.rightPaddleY = exports.leftPaddleY = exports.rightScore = exports.leftScore = exports.ballY = exports.ballX = void 0;
var drawmap_ai_js_1 = require("./drawmap-ai.js");
// position et score par defaut
var ballVX = 0;
var ballVY = 0;
exports.ballX = 400;
exports.ballY = 300;
exports.leftScore = 0;
exports.rightScore = 0;
var oldBallX = 400;
var oldBallY = 300;
exports.leftPaddleY = 250;
exports.rightPaddleY = 250;
exports.paddleWidth = 8;
exports.paddleHeight = 100;
var gameStarted = false;
exports.message = "";
var keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
var SERVER_URL = 'https://10.12.200.87:3000';
// scores et dessine
function FetchState() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(SERVER_URL, "/state"))];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    ballVX = data.ballX - exports.ballX;
                    ballVY = data.ballY - exports.ballY;
                    oldBallX = exports.ballX;
                    oldBallY = exports.ballY;
                    exports.ballX = data.ballX;
                    exports.ballY = data.ballY;
                    exports.leftPaddleY = data.leftPaddleY;
                    exports.rightPaddleY = data.rightPaddleY;
                    exports.leftScore = data.leftScore;
                    exports.rightScore = data.rightScore;
                    exports.message = data.message;
                    if (ballVX == 0)
                        ballVX = 5;
                    (0, drawmap_ai_js_1.draw_ai)();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Erreur de fetchState:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var aiAction = 'none';
var aiTimeout = null;
function callAI() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:8000/ai.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                paddlePosition: exports.rightPaddleY,
                                ballPosition: { x: exports.ballX, y: exports.ballY },
                                ballDirection: { x: ballVX, y: ballVY }
                            })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data_1 = _a.sent();
                    // Annule toute action précédente si elle existe
                    if (aiTimeout !== null) {
                        clearTimeout(aiTimeout);
                        aiTimeout = null;
                    }
                    // Réinitialise les touches IA
                    keys["ArrowUp"] = false;
                    keys["ArrowDown"] = false;
                    // Applique la direction pour la durée spécifiée
                    if (data_1.direction === "up") {
                        keys["ArrowUp"] = true;
                        aiAction = "up";
                    }
                    else if (data_1.direction === "down") {
                        keys["ArrowDown"] = true;
                        aiAction = "down";
                    }
                    else {
                        aiAction = "none";
                    }
                    // Définir le timeout pour relâcher la touche après `duration` ms
                    if (data_1.direction !== "none" && data_1.duration > 0) {
                        aiTimeout = window.setTimeout(function () {
                            if (data_1.direction === "up")
                                keys["ArrowUp"] = false;
                            if (data_1.direction === "down")
                                keys["ArrowDown"] = false;
                            aiAction = "none";
                            aiTimeout = null;
                        }, data_1.duration / 2);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Erreur IA:", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// evenement de touche pressee
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
        return; // ← bloque ces touches
    if (e.key in keys)
        keys[e.key] = true;
    if (e.key === " ") {
        fetch("".concat(SERVER_URL, "/start"), { method: "POST" });
        gameStarted = true;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
        return; // ← bloque aussi ici
    if (e.key in keys)
        keys[e.key] = false;
});
setInterval(callAI, 1000);
// setInterval(callAI_second, 100);
// envoie l'etat des touches 100x par seconde
setInterval(function () {
    fetch("".concat(SERVER_URL, "/move"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: keys })
    });
}, 10);
// recupere toutes les valeurs et dessine avec 100 fps
setInterval(FetchState, 10);
