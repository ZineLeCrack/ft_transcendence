export const userData = {
	userId: localStorage.getItem('userId'),
	userName: localStorage.getItem('userName'),
	userPicture: localStorage.getItem('profile_pic')
};

import { loadRoutes } from '../main.js';

export default function initChooseGame() {


const IP_NAME = import.meta.env.VITE_IP_NAME;

	const leftBtn = document.getElementById("left-button-game") as HTMLButtonElement;
	const rightBtn = document.getElementById("right-button-game") as HTMLButtonElement;
	const playBtn = document.getElementById("game-play-button") as HTMLButtonElement;
	const gameModeDiv = document.getElementById("game-mode") as HTMLDivElement;
	const descriptionmode = document.getElementById("description-game-mode") as HTMLDivElement;

	const modes = ["LOCAL", "MULTI", "AI"];
	const description: Record<string, string> = {
		"LOCAL": "Play against a friend on the same keyboard.",
		"MULTI": "Compete against other players online.",
		"AI": "Test your skills against the computer."
	};

	let currentIndex = 0;

	function updateDisplay() {
		const mode = modes[currentIndex];
		gameModeDiv.textContent = mode;
		descriptionmode.textContent = description[mode];

		if (mode === "LOCAL") {
			playBtn.onclick = async () => {
				try {
					const response = await fetch(`api/main/game/start`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							userId: userData.userId,
							userName: userData.userName
						})
					});

					if (!response.ok)
						throw new Error(`Erreur HTTP: ${response.status}`);

					const data = await response.json();
					const gameId = data.gameId;
					localStorage.setItem("gameId", gameId);

					history.pushState(null, '', '/game/local');
					await loadRoutes('/game/local');
				} catch (err) {
					console.error("❌ Erreur lors du démarrage du mode local :", err);
					alert("Accept the 4000 port !");
				}
			};
			document.body.style.backgroundImage = "url('/images/localgame.png')";
		}
		else if (mode === "MULTI") {
			playBtn.onclick = async () => {
				try {
					const response = await fetch(`/api/multi/game/start`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							userId: userData.userId,
							userName: userData.userName,
						})
					});
					if (!response.ok)
						throw new Error(`Erreur HTTPS: ${response.status}`);

					const data = await response.json();
					const gameId = data.gameId;
					const player = data.player;
					localStorage.setItem("gameId", gameId);
					localStorage.setItem("player", player);

					history.pushState(null, '', '/game/multi');
					await loadRoutes('/game/multi');
				} catch (err) {
					console.error("❌ Erreur lors du démarrage du mode multijoueur :", err);
					alert("Erreur : impossible de démarrer le jeu local.\n" + err);
				}
			};
			document.body.style.backgroundImage = "url('/images/tournament.png')";
		}
		else if (mode === "AI") {
			playBtn.onclick = async () => {
				history.pushState(null, '', '/game/ai');
				await loadRoutes('/game/ai');
			}
			document.body.style.backgroundImage = "url('/images/AItemp.png')";
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
}
