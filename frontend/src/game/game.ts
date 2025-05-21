export const userData =
{
	userId: localStorage.getItem('userId'),
	userName: localStorage.getItem('userName'),	
};

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
		try
		{
			playBtn.onclick = async () =>
			{
				const response = await fetch("https://10.12.200.87:4000/start",
				{
					method: 'POST'
				});
				const data = await response.json();
				const gameUrl = data.url;
				localStorage.setItem("pongServerPort", new URL(gameUrl).port);
				window.location.href = "src/game/pong.html";
			};
		}
		catch (err)
		{
			console.error("❌ Erreur lors du démarrage du serveur local :", err);
			alert("Erreur : impossible de démarrer le serveur local.\n" + err);
		}
		document.body.style.backgroundImage = "url('/src/images/localgame.png')";
	}
	else if (mode === "MULTI")
	{
		playBtn.onclick = () => window.location.href = "src/game/multiplayer.html";
		document.body.style.backgroundImage = "url('/src/images/tournament.png')";
	}
	else if (mode === "AI")
	{
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
