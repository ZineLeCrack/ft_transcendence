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
var gameCanvas = document.getElementById("gameCanvas");
var topCanvas = document.getElementById("topCanvas");
var game = gameCanvas.getContext("2d");
var score = topCanvas.getContext("2d");
// position et score par defaut
var ballX = 400;
var ballY = 300;
var leftPaddleY = 250;
var rightPaddleY = 250;
var leftScore = 0;
var rightScore = 0;
var paddleWidth = 10;
var paddleHeight = 100;
// Dictionnaire pour stocker les touches pressees ou non
var keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};
var gameStarted = false;
score.font = "40px 'Caveat'";
// fonction qui reload les positions des pads et de la balle ainsi que les
// scores et dessine
function fetchState() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('http://localhost:3000/state')];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    ballX = data.ballX;
                    ballY = data.ballY;
                    leftPaddleY = data.leftPaddleY;
                    rightPaddleY = data.rightPaddleY;
                    leftScore = data.leftScore;
                    rightScore = data.rightScore;
                    draw();
                    return [2 /*return*/];
            }
        });
    });
}
// evenement de touche pressee
document.addEventListener("keydown", function (e) {
    if (e.key in keys)
        keys[e.key] = true;
    if (e.key === " " && !gameStarted) {
        fetch("http://localhost:3000/start", { method: "POST" });
        gameStarted = true;
    }
});
// evenement de touche relachee
document.addEventListener("keyup", function (e) {
    if (e.key in keys)
        keys[e.key] = false;
});
// fonction qui dessine dans le canvas
function draw() {
    game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    score.clearRect(0, 0, topCanvas.width, topCanvas.height);
    game.fillStyle = "black";
    for (var i = 0; i < 600; i += 18.9)
        game.fillRect(404, i, 2, 15);
    game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    game.fillRect(ballX, ballY, 10, 10);
    score.fillStyle = "black";
    score.fillText(leftScore.toString(), 20, 50);
    score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}
// envoie l'etat des touches 100x par seconde
setInterval(function () {
    fetch('http://localhost:3000/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: keys })
    });
}, 10);
// recupere toutes les valeurs et dessine avec 100 fps
setInterval(fetchState, 10);
