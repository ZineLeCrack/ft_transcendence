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

// Dictionnaire pour stocker les touches pressées ou non
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


async function fetchState() {
	try {
		const res = await fetch('/state');
		const data = await res.json();
		ballX = data.ballX;
		ballY = data.ballY;
		leftPaddleY = data.leftPaddleY;
		rightPaddleY = data.rightPaddleY;
		leftScore = data.leftScore;
		rightScore = data.rightScore;
		message = data.message;
		draw();
	} catch (err) {
		console.error("Erreur fetch /state :", err);
	}
}

// Événement de touche pressée
document.addEventListener("keydown", (e) => {
	if (e.key in keys) keys[e.key] = true;
	if (e.key === " ") {
		fetch("/start", { method: "POST" });
		gameStarted = true;
	}
});

// Événement de touche relâchée
document.addEventListener("keyup", (e) => {
	if (e.key in keys) keys[e.key] = false;
});

// Fonction de dessin
function draw() {
	game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	score.clearRect(0, 0, topCanvas.width, topCanvas.height);

	game.fillStyle = "black";
	game.fillText(message, 400 - (message.length * 14), 150);

	for (let i = 0; i < 600; i += 18.9) {
		game.fillRect(404, i, 2, 15);
	}

	game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	game.fillRect(ballX, ballY, 10, 10);

	score.fillStyle = "black";
	score.fillText(leftScore.toString(), 20, 50);
	score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}

// Envoie l'état des touches 100 fois/seconde
setInterval(() => {
	fetch('/move', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	}).catch(err => console.error("Erreur fetch /move :", err));
}, 10);

// Met à jour l'état du jeu 100 fois/seconde
setInterval(fetchState, 10);
