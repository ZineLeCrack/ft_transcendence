const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

let ballX = 400;
let ballY = 300;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;

const paddleWidth = 10;
const paddleHeight = 100;

let keys: { [key: string]: boolean } =
{
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false
};

async function sendKey(key: string, pressed: boolean)
{
	await fetch('http://localhost:3000/move',
	{
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ key, pressed })
	});
}

async function fetchState()
{
	const res = await fetch('http://localhost:3000/state');
	const data = await res.json();
	ballX = data.ballX;
	ballY = data.ballY;
	leftPaddleY = data.leftPaddleY;
	rightPaddleY = data.rightPaddleY;
	leftScore = data.leftScore;
	rightScore = data.rightScore;
	draw();
}

document.addEventListener("keydown", (e) =>
{
	if (e.key in keys) keys[e.key] = true;
});

document.addEventListener("keyup", (e) =>
{
	if (e.key in keys) keys[e.key] = false;
});

function draw()
{
	game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	score.clearRect(0, 0, topCanvas.width, topCanvas.height);

	game.fillStyle = "black";
	game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	game.fillRect(gameCanvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
	game.fillRect(ballX, ballY, 10, 10);

	score.fillStyle = "black";
	score.fillText(leftScore.toString(), 20, 50);
	score.fillText(rightScore.toString(), gameCanvas.width - 50, 50);
}

setInterval(() =>
{
	fetch('http://localhost:3000/move',
	{
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keys })
	});
}, 16);

setInterval(fetchState, 16);
