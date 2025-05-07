import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let ballX = 400;
let ballY = 300;
let ballSpeedX = 5;
let ballSpeedY = 5;
let leftPaddleY = 250;
let rightPaddleY = 250;
let leftScore = 0;
let rightScore = 0;

app.get('/state', (req, res) =>
{
	res.json({ ballX, ballY, leftPaddleY, rightPaddleY, leftScore, rightScore });
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
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballY <= 0 || ballY >= 600)
		ballSpeedY = -ballSpeedY;

	if (ballX <= 30 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100)
		ballSpeedX = -ballSpeedX;

	if (ballX >= 770 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100)
		ballSpeedX = -ballSpeedX;

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

	setTimeout(updateGame, 10);
}

function resetBall()
{
	ballX = 400;
	ballY = 300;
	ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
	ballSpeedY = 5;
}

app.listen(port, () =>
{
	console.log("Server running on http://localhost:${port}");
	updateGame();
});
