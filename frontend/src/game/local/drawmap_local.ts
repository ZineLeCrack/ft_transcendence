import { ballX, ballY, rightPaddleY, rightScore, leftPaddleY, leftScore, message, paddleHeight, paddleWidth } from "./local.js";

/* ------------------------------- GAME PART ---------------------------------------- */

const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
const game = gameCanvas.getContext("2d")!;
const score = topCanvas.getContext("2d")!;

score.font = "40px 'Caveat'";
game.font = "80px 'Caveat'";

export function draw() {
	game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	score.clearRect(0, 0, topCanvas.width, topCanvas.height);

	game.fillStyle = "#FFFFFF";
	game.shadowColor = "#FFFFFF";
	game.shadowBlur = 10;
	game.fillText(message, 400 - (message.length * 14), 150);

	for (let i = 0; i < 600; i += 18.9)
		game.fillRect(404, i, 2, 15);
	
	game.fillStyle = "#00FFFF";
	game.shadowColor = "#00FFFF";
	game.shadowBlur = 10;
	game.fillRect(5, leftPaddleY, paddleWidth, paddleHeight);
	
	game.fillStyle = "#FF007A";
	game.shadowColor = "#FF007A";
	game.shadowBlur = 10;
	game.fillRect(gameCanvas.width - paddleWidth - 5, rightPaddleY, paddleWidth, paddleHeight);

	game.fillStyle = "#FFFFFF";
	game.shadowColor = "#FFFFFF";
	game.shadowBlur = 10;

	game.fillRect(ballX, ballY, 10, 10);
	
	score.fillStyle = "#00FFFF";
	score.shadowColor = "#00FFFF";
	score.shadowBlur = 10;
	score.fillText(leftScore.toString(), 20, 50);
	
	score.fillStyle = "#FF007A";
	score.shadowColor = "#FF007A";
	score.shadowBlur = 10;
	score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
}
