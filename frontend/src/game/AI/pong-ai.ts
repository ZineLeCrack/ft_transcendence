import { draw_ai } from './drawmap-ai.js';
const IP_NAME = '10.12.200.86';

// position et score par defaut
let ballVX = 0;
let ballVY = 0;
export let ballX = 400;
export let ballY = 300;
export let leftScore = 0;
export let rightScore = 0;
let oldBallX = 400;
let oldBallY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export const paddleWidth = 8;
export const paddleHeight = 100;

let gameStarted = false;
export let message = "";

let keys: { [key: string]: boolean } = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false
};

const SERVER_URL = `https://${IP_NAME}/app2/`;

// scores et dessine
async function FetchState()
{
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
		if (ballVX == 0)
			ballVX = 5
		draw_ai();
	} catch (error) {
		console.error("Erreur de fetchState:", error);
	}
}

let aiAction: 'up' | 'down' | 'none' = 'none';
let aiTimeout: number | null = null;

async function callAI() {
	//if (!gameStarted) return;
	try {
		const res = await fetch(`https://${IP_NAME}:4242/app2/ai/ai.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				paddlePosition: rightPaddleY,
				ballPosition: { x: ballX, y: ballY },
				ballDirection: { x: ballVX, y: ballVY }
			})			
		});

		const data = await res.json();

		// Annule toute action précédente si elle existe
		if (aiTimeout !== null) {
			clearTimeout(aiTimeout);
			aiTimeout = null;
		}

		// Réinitialise les touches IA
		keys["ArrowUp"] = false;
		keys["ArrowDown"] = false;

		// Applique la direction pour la durée spécifiée
		if (data.direction === "up") {
			keys["ArrowUp"] = true;
			aiAction = "up";
		} else if (data.direction === "down") {
			keys["ArrowDown"] = true;
			aiAction = "down";
		} else {
			aiAction = "none";
		}

		// Définir le timeout pour relâcher la touche après `duration` ms
		if (data.direction !== "none" && data.duration > 0) {
			aiTimeout = window.setTimeout(() => {
				if (data.direction === "up") keys["ArrowUp"] = false;
				if (data.direction === "down") keys["ArrowDown"] = false;
				aiAction = "none";
				aiTimeout = null;
			}, data.duration / 2);
		}

	} catch (e) {
		console.error("Erreur IA:", e);
	}
}


// evenement de touche pressee
document.addEventListener("keydown", (e) =>
	{
		if (e.key === "ArrowUp" || e.key === "ArrowDown") return; // ← bloque ces touches
		if (e.key in keys) keys[e.key] = true;
		if (e.key === " ") {
			fetch(`${SERVER_URL}/start`, { method: "POST" });
			gameStarted = true;
		}
	});
	
document.addEventListener("keyup", (e) =>
{
	if (e.key === "ArrowUp" || e.key === "ArrowDown") return; // ← bloque aussi ici
	if (e.key in keys) keys[e.key] = false;
});
	

setInterval(callAI, 1000);

// setInterval(callAI_second, 100);

// envoie l'etat des touches 100x par seconde
setInterval(() =>
{
	fetch(`${SERVER_URL}/move`,
	{
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	});
}, 10);

// recupere toutes les valeurs et dessine avec 100 fps
setInterval(FetchState, 10);

