const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

// position et score par defaut
let ballX = 400;
let ballY = 300;
let ballVX = ballX
let ballVY = ballY
let previousBallX = ballX;
let previousBallY = ballY;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;
const paddleWidth = 10;
const paddleHeight = 100;

// Dictionnaire pour stocker les touches pressees ou non
let keys: { [key: string]: boolean } =
{
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false
};

let gameStarted = false;
let message = "";

score.font = "40px 'Caveat'";
game.font = "80px 'Caveat'";

// fonction qui reload les positions des pads et de la balle ainsi que les
// scores et dessine
async function fetchState()
{
	const res = await fetch('http://localhost:3000/state');
	const data = await res.json();
	ballX = data.ballX;
	ballY = data.ballY;
	ballVX = data.ballX - previousBallX;
	ballVY = data.ballY - previousBallY;
	previousBallX = data.ballX;
	previousBallY = data.ballY;
	leftPaddleY = data.leftPaddleY;
	rightPaddleY = data.rightPaddleY;
	leftScore = data.leftScore;
	rightScore = data.rightScore;
	message = data.message;
	draw();
}

// evenement de touche pressee
document.addEventListener("keydown", (e) =>
{
	if (e.key in keys) keys[e.key] = true;
	if (e.key === " ") {
        fetch("http://localhost:3000/start", { method: "POST" });
        gameStarted = true;
    }
});

// evenement de touche relachee
document.addEventListener("keyup", (e) =>
{
	if (e.key in keys) keys[e.key] = false;
});

// fonction qui dessine dans le canvas
function draw()
{
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

async function askAI() {
	try {
		const response = await fetch("http://localhost:8000/ai.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				paddlePosition: rightPaddleY,
				ballPosition: { x: ballX, y: ballY },
				ballDirection: { x: ballVX, y: ballVY }, // ces valeurs doivent être calculées
			}),
		});
		const data = await response.json();

		if (data.direction === "up") {
			keys["ArrowUp"] = true;
			keys["ArrowDown"] = false;
		} else if (data.direction === "down") {
			keys["ArrowDown"] = true;
			keys["ArrowUp"] = false;
		} else {
			keys["ArrowUp"] = false;
			keys["ArrowDown"] = false;
		}
	} catch (e) {
		console.error("Erreur dans l'appel à l'IA :", e);
	}
}


// envoie l'etat des touches 100x par seconde
setInterval(() => {
	fetchState();
	askAI(); // Appel de l'IA toutes les 10ms
}, 10);


// recupere toutes les valeurs et dessine avec 100 fps
setInterval(fetchState, 14);
