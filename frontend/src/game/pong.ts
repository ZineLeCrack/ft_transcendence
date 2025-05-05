const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;

const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;

let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballSize = 10;

const paddleWidth = 10;
const paddleHeight = 100;

let leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
let rightPaddleY = canvasHeight / 2 - paddleHeight / 2;
const paddleSpeed = 7;

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;
let	keyPressed = false;

let leftScore = 0;
let rightScore = 0;

score.font = "40px 'Caveat'";

document.fonts.ready.then(() =>
{
	draw();
});
	
game.font = "40px 'Caveat'";

document.addEventListener("keydown", (e) =>
{
	if (e.key === "ArrowUp") upPressed = true, keyPressed = true;
	if (e.key === "ArrowDown") downPressed = true, keyPressed = true;
	if (e.key === "w") wPressed = true, keyPressed = true;
	if (e.key === "s") sPressed = true, keyPressed = true;
});

document.addEventListener("keyup", (e) =>
{
	if (e.key === "ArrowUp") upPressed = false;
	if (e.key === "ArrowDown") downPressed = false;
	if (e.key === "w") wPressed = false;
	if (e.key === "s") sPressed = false;
});

function gameLoop()
{
	if (rightScore === 5 || leftScore === 5)
	{
		game.fillText(rightScore === 5 ? "Player 2 win": "Player 1 win", canvasWidth / 2 - 70, canvasHeight / 2);
		rightScore = 0;
		leftScore = 0;
	}
	if (keyPressed)
	{
		update();
		draw();
	}
	requestAnimationFrame(gameLoop);
}

function update()
{
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballY < 0 || ballY > canvasHeight - ballSize)
		ballSpeedY *= -1;

	if (ballX < paddleWidth &&
		ballY > leftPaddleY &&
		ballY < leftPaddleY + paddleHeight)
	{
		if (ballY < leftPaddleY + (paddleHeight / 3))
		{
			if (ballSpeedY < 0)
			{
				if (ballSpeedY > -7)
					ballSpeedY -= 2;
			}
			else
			{
				if (ballSpeedY > 3)
					ballSpeedY -= 2;
			}
		}
		else if (ballY > leftPaddleY + (2 * paddleHeight / 3))
		{
			if (ballSpeedY < 0)
			{
				if (ballSpeedY < -3)
					ballSpeedY += 2;
			}
			else
			{
				if (ballSpeedY < 7)
					ballSpeedY += 2;
			}
		}
		if (-10 < ballSpeedX && ballSpeedX < 10)
		{
			if (ballSpeedX > 0)
				ballSpeedX += 0.5;
			else
				ballSpeedX -= 0.5;
		}
		ballSpeedX *= -1;
	}

	if (ballX > canvasWidth - paddleWidth - ballSize &&
		ballY > rightPaddleY &&
		ballY < rightPaddleY + paddleHeight)
	{
		if (ballY < rightPaddleY + (paddleHeight / 3))
		{
			if (ballSpeedY < 0)
			{
				if (ballSpeedY > -7)
					ballSpeedY -= 2;
			}
			else
			{
				if (ballSpeedY > 3)
					ballSpeedY -= 2;
			}
		}
		else if (ballY > rightPaddleY + (2 * paddleHeight / 3))
		{
			if (ballSpeedX < 0)
			{
				if (ballSpeedY < -3)
					ballSpeedY += 2;
			}
			else
			{
				if (ballSpeedY < 7)
					ballSpeedY += 2;
			}
		}
		if (-10 < ballSpeedX && ballSpeedX < 10)
		{
			if (ballSpeedX > 0)
				ballSpeedX += 0.5;
			else
				ballSpeedX -= 0.5;
		}
		ballSpeedX *= -1;
	}

	if (upPressed && rightPaddleY > 0)
		rightPaddleY -= paddleSpeed;

	if (downPressed && rightPaddleY < canvasHeight - paddleHeight)
		rightPaddleY += paddleSpeed;

	if (wPressed && leftPaddleY > 0)
		leftPaddleY -= paddleSpeed;

	if (sPressed && leftPaddleY < canvasHeight - paddleHeight)
		leftPaddleY += paddleSpeed;

	if (ballX < 0)
	{
		keyPressed = false;
		ballX = canvasWidth / 2;
		ballY = canvasHeight / 2;
		ballSpeedY = 5;
		if (ballSpeedX > 0)
			ballSpeedX = 5;
		else
			ballSpeedX = -5;
		ballSpeedX *= -1;
		rightScore++;
	}

	if (ballX > canvasWidth)
	{
		keyPressed = false;
		ballX = canvasWidth / 2;
		ballY = canvasHeight / 2;
		ballSpeedY = 5;
		if (ballSpeedX > 0)
			ballSpeedX = 5;
		else
			ballSpeedX = -5;
		ballSpeedX *= -1;
		leftScore++;
	}
}

function draw()
{
	score.clearRect(0, 0, topCanvas.width, topCanvas.height);
	game.clearRect(0, 0, canvasWidth, canvasHeight);

	score.fillStyle = "black";
	game.fillStyle = "black";

	score.fillText(leftScore.toString(), 20, 50);
	score.fillText(rightScore.toString(), 260, 50);
	
	game.fillRect(canvasWidth / 2 + 4, 0, 2, 600);
	game.fillRect(ballX, ballY, ballSize, ballSize);

	game.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	game.fillRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

gameLoop();
