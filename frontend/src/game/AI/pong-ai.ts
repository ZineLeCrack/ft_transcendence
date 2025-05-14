const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

// position et score par defaut
let ballX = 400;
let ballY = 300;
let ballVX = 0;
let ballVY = 0;
let oldBallX = 400;
let oldBallY = 300;
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
	draw();
}

let aiAction_second: 'up' | 'down' | 'none' = 'none';
let aiTimeout_second: number | null = null;

async function callAI_second() {
	//if (!gameStarted) return;
	try {
		const res = await fetch("http://localhost:8100/ai_second.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				paddlePosition: leftPaddleY,
				ballPosition: { x: ballX, y: ballY },
				ballDirection: { x: ballVX, y: ballVY }
			})			
		});

		const data = await res.json();

		// Annule toute action précédente si elle existe
		if (aiTimeout_second !== null) {
			clearTimeout(aiTimeout_second);
			aiTimeout_second = null;
		}

		// Réinitialise les touches IA
		keys["w"] = false;
		keys["s"] = false;

		// Applique la direction pour la durée spécifiée
		if (data.direction === "up") {
			keys["w"] = true;
			aiAction_second = "up";
		} else if (data.direction === "down") {
			keys["s"] = true;
			aiAction_second = "down";
		} else {
			aiAction_second = "none";
		}

		// Définir le timeout pour relâcher la touche après `duration` ms
		if (data.direction !== "none") {
			aiTimeout_second = window.setTimeout(() => {
				if (data.direction === "up") keys["w"] = false;
				if (data.direction === "down") keys["s"] = false;
				aiAction_second = "none";
				aiTimeout_second = null;
			}, data.duration / 2);
		}		

	} catch (e) {
		console.error("Erreur IA:", e);
	}
}

let aiAction: 'up' | 'down' | 'none' = 'none';
let aiTimeout: number | null = null;

async function callAI() {
	//if (!gameStarted) return;
	try {
		const res = await fetch("http://localhost:8000/ai.php", {
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

setInterval(callAI, 1000);

setInterval(callAI_second, 100);

// envoie l'etat des touches 100x par seconde
setInterval(() =>
{
	fetch('http://localhost:3000/move',
	{
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	});
}, 10);

// recupere toutes les valeurs et dessine avec 100 fps
setInterval(fetchState, 10);

