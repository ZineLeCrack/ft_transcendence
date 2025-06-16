import { draw_ai } from "./drawmap-ai.js";
import initError from "../../error.js";
import { loadRoutes} from "../../main.js";
import { initWebSocket } from '../../websocket';
import { translate } from "../../i18n.js";
import { initLanguageSelector } from "../../language.js";

export let ballX = 400;
export let ballY = 300;
let ballVX = 0;
let ballVY = 0;
let oldBallX = 400;
let oldBallY = 300;
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

	if (!response.ok)
	{
		initError(translate('Error_co'));
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return;
	}

	const info = await response.json();
	initWebSocket(info.original);
	await initLanguageSelector();

	const h1player1 = document.getElementById('name-player1') as HTMLHeadingElement;
	const h1player2 = document.getElementById('name-player2') as HTMLHeadingElement;
	h1player1.textContent = `${info.original}`;
	const AIText = translate('game_mode_ai');
	h1player2.textContent = `${AIText}`;

	let keys: { [key: string]: boolean } =  {
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false
	};

	let gameStarted = false;
	const gameId = sessionStorage.getItem("gameId");
	const SERVER_URL = `/api/main/game/${gameId}`;

	async function fetchState() {
		try {
			const res = await fetch(`${SERVER_URL}/state`);
			const data = await res.json();
			ballVX = data.ballX - ballX;
			ballVY = data.ballY - ballY;
			oldBallX = ballX;
			oldBallY = ballY;
			ballX = data.ballX;
			ballY = data.ballY;
			leftPaddleY = data.leftPaddleY;
			rightPaddleY = data.rightPaddleY;
			leftScore = data.leftScore;
			rightScore = data.rightScore;
			message = data.message;
			draw_ai();
		} catch (error) {
			console.error("Erreur de fetchState:", error);
		}
	}

	let aiTimeout: number | null = null;

	async function callAI() {
		try {
			const res = await fetch(`${SERVER_URL}/ai`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paddlePosition: rightPaddleY,
					ballPosition: { x: ballX, y: ballY },
					ballDirection: { x: ballVX, y: ballVY }
				})
			});

			const data = await res.json();

			keys["ArrowUp"] = false;
			keys["ArrowDown"] = false;

			if (data.direction === "up") {
				keys["ArrowUp"] = true;
			} else if (data.direction === "down") {
				keys["ArrowDown"] = true;
			}

			if (aiTimeout) clearTimeout(aiTimeout);

			if (data.direction !== "none" && data.duration > 0) {
				aiTimeout = window.setTimeout(() => {
					keys["ArrowUp"] = false;
					keys["ArrowDown"] = false;
				}, data.duration);
			}
		} catch (e) {
			console.error("Erreur IA:", e);
		}
	}

	document.addEventListener("keydown", async (e) => {
		if (e.key === "w" || e.key === "s") return;
		if (e.key === "ArrowUp") keys["w"] = true;
		if (e.key === "ArrowDown") keys["s"] = true;
		if (e.key === " ") {
			await fetch(`${SERVER_URL}/start`, { method: "POST" });
			gameStarted = true;
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.key === "w" || e.key === "s") return;
		if (e.key === "ArrowUp") keys["w"] = false;
		if (e.key === "ArrowDown") keys["s"] = false;
	});

	const interval1 = setInterval(async () => {
		await fetch(`${SERVER_URL}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ keys })
		}).catch(err => console.error("Erreur POST /move:", err));
	}, 16);

	const interval2 = setInterval(callAI, 1000);
	const interval3 = setInterval(fetchState, 16);

	window.addEventListener('popstate', async () => {
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		if (interval3) clearInterval(interval3);
		await fetch(`/api/main/game/end`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId: gameId })
		});
	});
}
