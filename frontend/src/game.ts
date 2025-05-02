const playButton = document.getElementById("local game button") as HTMLButtonElement;

if (playButton) {
  playButton.addEventListener("click", () => {
    window.location.href = "game/pong.html";
  });
}
