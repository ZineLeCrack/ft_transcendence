import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import fs from 'fs';
import https from 'https';
import http from 'http';
=======
import https from 'https';
import fs from 'fs';
>>>>>>> origin/rlebaill

const privateKey = fs.readFileSync('serv.key', 'utf8');
const certificate = fs.readFileSync('serv.crt', 'utf8');
const app = express();
const httpsPort = 3000;
const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const corsOptions = {

  origin: 'https://localhost:443',
  credentials: true,
};

app.use(cors({ origin: true, credentials: true }));
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
	
	if (keys.ArrowUp) rightPaddleY -= 10;
	if (keys.ArrowDown) rightPaddleY += 10;
	if (keys.w) leftPaddleY -= 10;
	if (keys.s) leftPaddleY += 10;
	
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
			message = leftScore === 5 ? "Player 1 win !" : "Player 2 win !";
			setTimeout(() =>
			{
				if (!gameStarted)
				{
					leftScore = 0;
					rightScore = 0;
					message = "Press space to start !";
				}
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
				if (ballSpeedX < 10)
					ballSpeedX += 0.5;
				if (ballSpeedY < 0)
				{
					if (ballY < leftPaddleY + 34)
					{
						if (ballSpeedY > -7)
							ballSpeedY -= 2;
					}
					else if (ballY > leftPaddleY + 66)
					{
						if (ballSpeedY < -3)
							ballSpeedY += 2;
					}
				}
				else
				{
					if (ballY < leftPaddleY + 34)
					{
						if (ballSpeedY > 3)
							ballSpeedY -= 2;
					}
					else if (ballY > leftPaddleY + 66)
					{
						if (ballSpeedY < 7)
							ballSpeedY += 2;
					}
				}
			}
		}
		else
		{
			if (ballX >= 785 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100)
			{
				if (ballSpeedX < 10)
					ballSpeedX += 0.5;
				ballSpeedX = -ballSpeedX;
				if (ballSpeedY < 0)
				{
					if (ballY < rightPaddleY + 34)
					{
						if (ballSpeedY > -7)
							ballSpeedY -= 2;
					}
					else if (ballY > rightPaddleY + 66)
					{
						if (ballSpeedY < -3)
							ballSpeedY += 2;
					}
				}
				else
				{
					if (ballY < rightPaddleY + 34)
					{
						if (ballSpeedY > 3)
							ballSpeedY -= 2;
					}
					else if (ballY > rightPaddleY + 66)
					{
						if (ballSpeedY < 7)
							ballSpeedY += 2;
					}
				}
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
	newSpeedX = ballSpeedX < 0 ? 5 : -5;
	newSpeedY = ballSpeedY < 0 ? 5 : -5;
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

<<<<<<< HEAD
https.createServer(credentials, app).listen(httpsPort, '0.0.0.0' ,() => {
	console.log(`HTTPS server running at https://localhost:${httpsPort}`);
	updateGame();
=======
https.createServer({ key: privateKey, cert: certificate }, app)
	.listen(port, () => {
		console.log(`HTTPS server running on https://localhost:${port}`);
		updateGame();
>>>>>>> origin/rlebaill
});
