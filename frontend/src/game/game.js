var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const userData = {
    userId: localStorage.getItem('userId'),
    userName: localStorage.getItem('userName'),
};
const IP_NAME = process.env.IP_NAME || "10.12.200.0";
document.addEventListener("DOMContentLoaded", () => {
    const leftBtn = document.getElementById("left-button-game");
    const rightBtn = document.getElementById("right-button-game");
    const playBtn = document.getElementById("game-play-button");
    const gameModeDiv = document.getElementById("game-mode");
    const descriptionmode = document.getElementById("description-game-mode");
    const modes = ["LOCAL", "MULTI", "AI"];
    const description = {
        "LOCAL": "Joue contre un ami sur le même clavier.",
        "MULTI": "Affronte d'autres joueurs en ligne.",
        "AI": "Teste tes compétences contre l'ordinateur."
    };
    let currentIndex = 0;
    function updateDisplay() {
        const mode = modes[currentIndex];
        gameModeDiv.textContent = mode;
        descriptionmode.textContent = description[mode];
        if (mode === "LOCAL") {
            try {
                playBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    const response = yield fetch("https://${IP_NAME}:4000/start", {
                        method: 'POST'
                    });
                    const data = yield response.json();
                    const gameUrl = data.url;
                    localStorage.setItem("pongServerPort", new URL(gameUrl).port);
                    window.location.href = "src/game/pong.html";
                });
            }
            catch (err) {
                console.error("❌ Erreur lors du démarrage du serveur local :", err);
                alert("Erreur : impossible de démarrer le serveur local.\n" + err);
            }
            document.body.style.backgroundImage = "url('/src/images/localgame.png')";
        }
        else if (mode === "MULTI") {
            playBtn.onclick = () => window.location.href = "src/game/multiplayer.html";
            document.body.style.backgroundImage = "url('/src/images/tournament.png')";
        }
        else if (mode === "AI") {
            playBtn.onclick = () => window.location.href = "src/game/AI/AI.html";
            document.body.style.backgroundImage = "url('/src/images/AItemp.png')";
        }
    }
    rightBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % modes.length;
        updateDisplay();
    });
    leftBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + modes.length) % modes.length;
        updateDisplay();
    });
    updateDisplay();
});
