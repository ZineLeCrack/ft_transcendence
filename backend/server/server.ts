import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let ballX = 400;
let ballY = 300;
let ballSpeedX = 0;
let ballSpeedY = 0;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;

let newSpeedX = 0;
let newSpeedY = 0;

let gameStarted = false;

let message = "Press space to start !";

app.get('/state', (req, res) =>
{
	res.json({ ballX, ballY, leftPaddleY, rightPaddleY, leftScore, rightScore, message });
});

app.get('/start', (req, res) =>
{
	res.json({ gameStarted });
});

app.post('/start', (req, res) =>
{
	if (!gameStarted)
	{
		message = "";
		gameStarted = true;
		ballSpeedX = 5;
		ballSpeedY = 5;
		leftScore = 0;
		rightScore = 0;
	}
	res.sendStatus(200);
});

app.post('/move', (req, res) =>
{
	const { keys } = req.body;
	
	if (keys.ArrowUp) rightPaddleY -= 5;
	if (keys.ArrowDown) rightPaddleY += 5;
	if (keys.w) leftPaddleY -= 5;
	if (keys.s) leftPaddleY += 5;
	
	rightPaddleY = Math.max(0, Math.min(500, rightPaddleY));
	leftPaddleY = Math.max(0, Math.min(500, leftPaddleY));
	
	res.sendStatus(200);
});

function updateGame()
{
	if (gameStarted)
	{
		if (leftScore === 5 || rightScore === 5)
		{
			gameStarted = false;
			message = leftScore === 5 ? "Player 1 win !": "Player 2 win !";
			setTimeout(() =>
			{
				leftScore = 0;
				rightScore = 0;
				message = "Press space to start !";
			}, 5000);
		}
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		if (ballY <= 0 || ballY >= 600)
			ballSpeedY = -ballSpeedY;

		if (ballSpeedX < 0)
		{
			if (ballX <= 15 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100)
			{
				ballSpeedX = -ballSpeedX;
				ballSpeedX += 0.5;
			}
		}
		else
		{
			if (ballX >= 785 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100)
			{
				ballSpeedX += 0.5;
				ballSpeedX = -ballSpeedX;
			}
		}

		if (ballX <= 0)
		{
			rightScore++;
			resetBall();
		}
		else if (ballX >= 800)
		{
			leftScore++;
			resetBall();
		}
	}
	setTimeout(updateGame, 16);
}

function resetBall()
{
	ballX = 400;
	ballY = 300;
	newSpeedX = ballSpeedX < 0 ? 5: -5;
	newSpeedY = ballSpeedY < 0 ? 5: -5;
	ballSpeedX = 0;
	ballSpeedY = 0;

	if (leftScore != 5 && rightScore != 5)
	{
		message = "3";
		setTimeout(() =>
		{
			message = "2";
		}, 1000);

		setTimeout(() =>
		{
			message = "1";
		}, 2000);
		setTimeout(() =>
		{
			ballSpeedX = newSpeedX;
			ballSpeedY = newSpeedY;
			message = "";
		}, 3000);
	}
}

app.listen(port, () =>        
{
	console.log(`Server running on http://localhost:${port}`);
	updateGame();
});
