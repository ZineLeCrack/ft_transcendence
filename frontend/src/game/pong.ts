import { draw } from "./drawmap.js";

export let ballX = 400;
export let ballY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export let leftScore = 0;
export let rightScore = 0;
export const paddleWidth = 8;
export const paddleHeight = 100;
export let message = "";

// Dictionnaire pour stocker les touches pressées
let keys: { [key: string]: boolean } = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false
};

let gameStarted = false;

const sessionId = localStorage.getItem("pongSessionId");

// 🔐 Mettre ici l'adresse du serveur HTTPS
const SERVER_URL = `https://10.12.200.81/game/local/${sessionId}`;

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

// Événement touche pressée
document.addEventListener("keydown", (e) => {
	if (e.key in keys) keys[e.key] = true;
	if (e.key === " ") {
		fetch(`${SERVER_URL}/start`, { method: "POST" });
		gameStarted = true;
	}
});

// Événement touche relâchée
document.addEventListener("keyup", (e) => {
	if (e.key in keys) keys[e.key] = false;
});


setInterval(() => {
	fetch(`${SERVER_URL}/move`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	}).catch(err => console.error("Erreur POST /move:", err));
}, 16);

setInterval(fetchState, 16);
