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
	let response;
	try {
		const token = sessionStorage.getItem('token');
		response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
			credentials: 'include',
		});
	} catch (err) {
		console.log('Error verifying user:', err);
		return ;
	}
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

	const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
	const game = gameCanvas.getContext("2d")!;
	const score = topCanvas.getContext("2d")!;

	score.font = "40px 'Caveat'";
	game.font = "80px 'Caveat'";

	function draw() {
		game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		score.clearRect(0, 0, topCanvas.width, topCanvas.height);

		game.fillStyle = "#FFFFFF";
		game.shadowColor = "#FFFFFF";
		game.shadowBlur = 10;

		let new_message;
		if (message === "to_start" || message === "1_win" || message === "2_win") {
			new_message = translate(message);
		} else {
			new_message = message;
		}
		game.fillText(new_message, 400 - (new_message.length * 14), 150);

		for (let i = 0; i < 600; i += 18.9)
			game.fillRect(399, i, 2, 15);

		game.fillStyle = "#00FFFF";
		game.shadowColor = "#00FFFF";
		game.shadowBlur = 10;
		game.fillRect(5, leftPaddleY, paddleWidth, paddleHeight);

		game.fillStyle = "#FF007A";
		game.shadowColor = "#FF007A";
		game.shadowBlur = 10;
		game.fillRect(gameCanvas.width - paddleWidth - 5, rightPaddleY, paddleWidth, paddleHeight);

		game.beginPath();
		game.arc(ballX + 5, ballY + 5, 5, 0, Math.PI * 2);
		game.fillStyle = "#FFFFFF";
		game.shadowColor = "#FFFFFF";
		game.shadowBlur = 10;
		game.fill();

		score.fillStyle = "#00FFFF";
		score.shadowColor = "#00FFFF";
		score.shadowBlur = 10;
		score.fillText(leftScore.toString(), 20, 50);

		score.fillStyle = "#FF007A";
		score.shadowColor = "#FF007A";
		score.shadowBlur = 10;
		score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
	}

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

	async function onKeyDown(e: KeyboardEvent) {
		if (e.key in keys) keys[e.key] = true;
		if (e.key === " ") {
			try {
				await fetch(`${SERVER_URL}/start`, { method: "POST" });
				gameStarted = true;
			} catch (err) {
				console.log('Error starting local game:', err);
			}
		}
	}

	async function onKeyUp(e: KeyboardEvent) {
		if (e.key in keys) keys[e.key] = false;
	}

	document.addEventListener("keydown", onKeyDown);

	document.addEventListener("keyup", onKeyUp);

	const interval1 = setInterval(async () => {
		try {
			await fetch(`${SERVER_URL}/move`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ keys })
			});
		} catch (err) {
			console.log('Error sending moves:', err);
		}
	}, 16);

	const interval2 = setInterval(fetchState, 16);

	async function cleanUp() {
		sessionStorage.removeItem("gameId");
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("keyup", onKeyUp);
		try {
			await fetch(`/api/main/game/end`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gameId: gameId })
			});
		} catch (err) {
			console.log('Error ending local game:', err);
		}
		window.removeEventListener("popstate", cleanUp);
	}

	window.addEventListener('popstate', cleanUp);
}
