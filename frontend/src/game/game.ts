document.addEventListener("DOMContentLoaded", () => 
	{
	const leftBtn = document.getElementById("left-button-game") as HTMLButtonElement;
	const rightBtn = document.getElementById("right-button-game") as HTMLButtonElement;
	const playBtn = document.getElementById("game-play-button") as HTMLButtonElement;
	const gameModeDiv = document.getElementById("game-mode") as HTMLDivElement;

	const modes = ["LOCAL", "MULTI", "AI", "TOURNAMENTS"];
	let currentIndex = 0;

	function updateDisplay()
	{
	const mode = modes[currentIndex];
	gameModeDiv.textContent = mode;

	if (mode === "LOCAL")
	{
		playBtn.onclick = () => window.location.href = "src/game/pong.html";
	}
	else if (mode === "MULTI")
	{
		playBtn.onclick = () => window.location.href = "src/game/multiplayer.html";
	}
	else if (mode === "AI")
	{
		playBtn.onclick = () => window.location.href = "src/game/AI.html";
	}
	else if (mode === "TOURNAMENTS")
	{
		playBtn.onclick = () => window.location.href = "src/game/tournaments.html";
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
