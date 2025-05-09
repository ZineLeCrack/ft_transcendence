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
        var mode = modes[currentIndex];
        gameModeDiv.textContent = mode;
        descriptionmode.textContent = description[mode];
        if (mode === "LOCAL") {
            playBtn.onclick = function () { return window.location.href = "src/game/pong.html"; };
        }
        else if (mode === "MULTI") {
            playBtn.onclick = function () { return window.location.href = "src/game/multiplayer.html"; };
        }
        else if (mode === "AI") {
            playBtn.onclick = function () { return window.location.href = "src/game/AI/AI.html"; };
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
