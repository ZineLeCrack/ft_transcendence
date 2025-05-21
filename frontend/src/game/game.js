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
document.addEventListener("DOMContentLoaded", function () {
    var leftBtn = document.getElementById("left-button-game");
    var rightBtn = document.getElementById("right-button-game");
    var playBtn = document.getElementById("game-play-button");
    var gameModeDiv = document.getElementById("game-mode");
    var descriptionmode = document.getElementById("description-game-mode");
    var modes = ["LOCAL", "MULTI", "AI"];
    var description = {
        "LOCAL": "Joue contre un ami sur le même clavier.",
        "MULTI": "Affronte d'autres joueurs en ligne.",
        "AI": "Teste tes compétences contre l'ordinateur."
    };
    var currentIndex = 0;
    function updateDisplay() {
        var _this = this;
        var mode = modes[currentIndex];
        gameModeDiv.textContent = mode;
        descriptionmode.textContent = description[mode];
        if (mode === "LOCAL") {
            try {
                playBtn.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                    var response, data, gameUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("https://10.12.200.87:4000/start", {
                                    method: 'POST'
                                })];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 2:
                                data = _a.sent();
                                gameUrl = data.url;
                                localStorage.setItem("pongServerPort", new URL(gameUrl).port);
                                window.location.href = "src/game/pong.html";
                                return [2 /*return*/];
                        }
                    });
                }); };
            }
            catch (err) {
                console.error("❌ Erreur lors du démarrage du serveur local :", err);
                alert("Erreur : impossible de démarrer le serveur local.\n" + err);
            }
            document.body.style.backgroundImage = "url('/src/images/localgame.png')";
        }
        else if (mode === "MULTI") {
            playBtn.onclick = function () { return window.location.href = "src/game/multiplayer.html"; };
            document.body.style.backgroundImage = "url('/src/images/tournament.png')";
        }
        else if (mode === "AI") {
            playBtn.onclick = function () { return window.location.href = "src/game/AI/AI.html"; };
            document.body.style.backgroundImage = "url('/src/images/AItemp.png')";
        }
    }
    rightBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % modes.length;
        updateDisplay();
    });
    leftBtn.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + modes.length) % modes.length;
        updateDisplay();
    });
    updateDisplay();
});
