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

	let keys: { [key: string]: boolean } = {
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false
	};

	let gameStarted = false;
	const gameId = sessionStorage.getItem("gameId");
	const SERVER_URL = `/api/main/game/${gameId}`;

	const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
	const game = gameCanvas.getContext("2d")!;
	const score = topCanvas.getContext("2d")!;

	score.font = "40px 'Caveat'";
	game.font = "80px 'Caveat'";

	function draw_ai() {
		game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		score.clearRect(0, 0, topCanvas.width, topCanvas.height);

		game.fillStyle = "#FFFFFF";
		game.shadowColor = "#FFFFFF";
		game.shadowBlur = 10;

		let new_message;
		if (message === "to_start") {
			new_message = translate(message);
		}
		else if (message === "1_win")
		{
			new_message = `${info.original} ${translate("1_win")}`;
		} 
		else if (message === "2_win") {
			new_message = translate("ai_win");
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

	async function onKeyDown(e: KeyboardEvent) {
		if (e.key === "w" || e.key === "s") return;
		if (e.key === "ArrowUp") keys["w"] = true;
		if (e.key === "ArrowDown") keys["s"] = true;
		if (e.key === " ") {
			await fetch(`${SERVER_URL}/start`, { method: "POST" });
			gameStarted = true;
		}
	}

	async function onKeyUp(e: KeyboardEvent) {
		if (e.key === "w" || e.key === "s") return;
		if (e.key === "ArrowUp") keys["w"] = false;
		if (e.key === "ArrowDown") keys["s"] = false;
	}

	document.addEventListener("keydown", onKeyDown);

	document.addEventListener("keyup", onKeyUp);

	const interval1 = setInterval(async () => {
		await fetch(`${SERVER_URL}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ keys })
		}).catch(err => console.error("Erreur POST /move:", err));
	}, 16);

	const interval2 = setInterval(callAI, 1000);
	const interval3 = setInterval(fetchState, 16);

	async function cleanUp() {
		sessionStorage.removeItem("gameId");
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		if (interval3) clearInterval(interval3);
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("keyup", onKeyUp);
		await fetch(`/api/main/game/end`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId: gameId })
		});
		window.removeEventListener("popstate", cleanUp);
	}

	window.addEventListener('popstate', cleanUp);
}
