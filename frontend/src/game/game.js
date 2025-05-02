document.addEventListener("DOMContentLoaded", function () {
    var leftBtn = document.getElementById("left-button-game");
    var rightBtn = document.getElementById("right-button-game");
    var playBtn = document.getElementById("game-play-button");
    var gameModeDiv = document.getElementById("game-mode");
    var modes = ["LOCAL", "MULTI", "AI", "TOURNAMENTS"];
    var currentIndex = 0;
    function updateDisplay() {
        var mode = modes[currentIndex];
        gameModeDiv.textContent = mode;
        if (mode === "LOCAL") {
            playBtn.onclick = function () { return window.location.href = "src/game/pong.html"; };
        }
        else if (mode === "MULTI") {
            playBtn.onclick = function () { return window.location.href = "src/game/multiplayer.html"; };
        }
        else if (mode === "AI") {
            playBtn.onclick = function () { return window.location.href = "src/game/AI.html"; };
        }
        else if (mode === "TOURNAMENTS") {
            playBtn.onclick = function () { return window.location.href = "src/game/tournaments.html"; };
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
