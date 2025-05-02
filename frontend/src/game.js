var playButton = document.getElementById("local game button");
if (playButton) {
    playButton.addEventListener("click", function () {
        window.location.href = "game/pong.html";
    });
}
