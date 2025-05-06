document.addEventListener("DOMContentLoaded", () => 
	{
	const leftBtn = document.getElementById("left-button-game") as HTMLButtonElement;
	const rightBtn = document.getElementById("right-button-game") as HTMLButtonElement;
	const playBtn = document.getElementById("game-play-button") as HTMLButtonElement;
	const gameModeDiv = document.getElementById("game-mode") as HTMLDivElement;
	const descriptionmode = document.getElementById("description-game-mode") as HTMLDivElement;

	const modes = ["LOCAL", "MULTI", "AI"];
	const description: Record<string, string> = {
		"LOCAL": "Joue contre un ami sur le même clavier.",
		"MULTI": "Affronte d'autres joueurs en ligne.",
		"AI": "Teste tes compétences contre l'ordinateur."
	};

	let currentIndex = 0;

	function updateDisplay()
	{
	const mode = modes[currentIndex];
	gameModeDiv.textContent = mode;
	descriptionmode.textContent = description[mode];

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
