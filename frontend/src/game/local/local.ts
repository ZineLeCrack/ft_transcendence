import { draw } from "./drawmap_local.js";
import { initWebSocket } from '../../websocket';
import { initLanguageSelector } from "../../language.js";
import { loadRoutes } from "../../main.js";
import initError from "../../error.js";
import { translate } from "../../i18n.js";

export let ballX = 400;
export let ballY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export let leftScore = 0;
export let rightScore = 0;
export const paddleWidth = 8;
export const paddleHeight = 100;
export let message = "";


export default async function initPong() {
	const token = sessionStorage.getItem('token');
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});
		const info = await response.json();
					
	initWebSocket(info.original);
	await initLanguageSelector();

	let keys: { [key: string]: boolean } = {
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false
	};

	let gameStarted = false;
	const gameId = sessionStorage.getItem("gameId");

	if (!gameId) {
		initError(translate('not_in_game'));
		setTimeout(async () => {
			history.pushState(null, '', '/home');
			await loadRoutes('/home');
		}, 1000);
		return ;
	}

	const SERVER_URL = `/api/main/game/${gameId}`;

	async function fetchState() {
		try {
			const res = await fetch(`${SERVER_URL}/state`);
			const data = await res.json();
			ballX = data.ballX;
			ballY = data.ballY;
			leftPaddleY = data.leftPaddleY;
			rightPaddleY = data.rightPaddleY;
			leftScore = data.leftScore;
			rightScore = data.rightScore;
			message = data.message;
			draw();
		} catch (error) {
			console.error("Erreur de fetchState:", error);
		}
	}

	document.addEventListener("keydown", async (e) => {
		if (e.key in keys) keys[e.key] = true;
		if (e.key === " ") {
			await fetch(`${SERVER_URL}/start`, { method: "POST" });
			gameStarted = true;
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.key in keys) keys[e.key] = false;
	});

	const interval1 = setInterval(async () => {
		await fetch(`${SERVER_URL}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ keys })
		}).catch(err => console.error("Erreur POST /move:", err));
	}, 16);

	const interval2 = setInterval(fetchState, 16);

	window.addEventListener('popstate', async () => {
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		await fetch(`/api/main/game/end`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId: gameId })
		});
	});
}
