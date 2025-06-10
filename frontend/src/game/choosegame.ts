import initError from '../error.js';

export const userData = {
	userId: sessionStorage.getItem('userId'),
	userName: sessionStorage.getItem('userName'),
	userPicture: sessionStorage.getItem('profile_pic'),
	token: sessionStorage.getItem('token')
};

import { loadRoutes } from '../main.js';
import { translate } from '../i18n.js';

let currentUpdateDisplay: (() => void) | null = null;
;

export default function initChooseGame() {


	const leftBtn = document.getElementById("left-button-game") as HTMLButtonElement;
	const rightBtn = document.getElementById("right-button-game") as HTMLButtonElement;
	const playBtn = document.getElementById("game-play-button") as HTMLButtonElement;
	const gameModeDiv = document.getElementById("game-mode") as HTMLDivElement;
	const descriptionmode = document.getElementById("description-game-mode") as HTMLDivElement;

	 const modeTranslationKeys: Record<string, string> = {
        "LOCAL": "game_mode_local",
        "MULTI": "game_mode_multi",
        "AI": "game_mode_ai"
    };

	const modes = ["LOCAL", "MULTI", "AI"];
	const description: Record<string, string> = {
		"LOCAL": "game_mode_local_description",
		"MULTI": "game_mode_multi_description",
		"AI": "game_mode_ai_description"
	};

	let currentIndex = 0;

	function updateDisplay() {
		const mode = modes[currentIndex];
		gameModeDiv.textContent = translate(modeTranslationKeys[mode]);
		descriptionmode.textContent = translate(description[mode]);

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
					sessionStorage.setItem("gameId", gameId);

					history.pushState(null, '', '/game/local');
					await loadRoutes('/game/local');
					//window.location.reload();
				} catch (err) {
					console.error("❌ Erreur lors du démarrage du mode local :", err);
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
							token : userData.token,
						})
					});
					if (!response.ok)
						throw new Error(`Erreur HTTPS: ${response.status}`);

					const data = await response.json();
					const gameId = data.gameId;
					const player = data.player;
					sessionStorage.setItem("gameId", gameId);
					sessionStorage.setItem("player", player);

					history.pushState(null, '', '/game/multi');
					await loadRoutes('/game/multi');
					//window.location.reload();
				} catch (err) {
					initError("Error : Local game can't start.\n" + err);
				}
			};
			document.body.style.backgroundImage = "url('/images/tournament.png')";
		}
		else if (mode === "AI") {
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
					sessionStorage.setItem("gameId", gameId);

					history.pushState(null, '', '/game/ai');
					await loadRoutes('/game/ai');
					//window.location.reload();
				} catch (err) {
					console.error("❌ Erreur lors du démarrage du mode ai :", err);
				}
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

	currentUpdateDisplay = updateDisplay;
}

export function refreshGameModeDisplay()
{
	 if (currentUpdateDisplay) {
        currentUpdateDisplay();
    }
}
