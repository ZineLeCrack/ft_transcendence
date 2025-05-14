/* ------------------------------- STAT PART ---------------------------------------- */

const leftCanvas = document.getElementById("statPlayer1") as HTMLCanvasElement;
const rightCanvas = document.getElementById("statPlayer2") as HTMLCanvasElement;
const left = leftCanvas.getContext("2d")!;
const right = rightCanvas.getContext("2d")!;

left.font = "40px 'Caveat'";
right.font = "40px 'Caveat'";

left.fillText("⬆️: up", 0, 40, leftCanvas.width);
left.fillText("⬇️: down", 0, 85, leftCanvas.width);
right.fillText("W: up", 0, 40, rightCanvas.width);
right.fillText("S: down", 0, 85, rightCanvas.width);

/* ------------------------------- GAME PART ---------------------------------------- */

const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

// position et score par défaut
let ballX = 400;
let ballY = 300;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;
const paddleWidth = 10;
const paddleHeight = 100;

// Dictionnaire pour stocker les touches pressées
let keys: { [key: string]: boolean } = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false
};

let gameStarted = false;
let message = "";

score.font = "40px 'Caveat'";
game.font = "80px 'Caveat'";

// 🔐 Mettre ici l'adresse du serveur HTTPS
const SERVER_URL = 'https://10.12.200.35:3000';

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

// Dessin sur canvas
function draw() {
	game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	score.clearRect(0, 0, topCanvas.width, topCanvas.height);

	game.fillStyle = "black";
	game.fillText(message, 400 - (message.length * 14), 150);

	for (let i = 0; i < 600; i += 18.9)
		game.fillRect(404, i, 2, 15);

	game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	game.fillRect(ballX, ballY, 10, 10);

	score.fillStyle = "black";
	score.fillText(leftScore.toString(), 20, 50);
	score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}

// Envoi des touches 100x par seconde
setInterval(() => {
	fetch(`${SERVER_URL}/move`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	}).catch(err => console.error("Erreur POST /move:", err));
}, 10);

setInterval(fetchState, 10);
