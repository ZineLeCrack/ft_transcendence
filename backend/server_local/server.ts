export class GameInstance {
	ballX = 395;
	ballY = 295;
	ballSpeedX = 0;
	ballSpeedY = 0;
	leftPaddleY = 250;
	rightPaddleY = 250;
	leftScore = 0;
	rightScore = 0;
	message = "Press space to start !";
	gameStarted = false;
	leftOldY = 250;
	rightOldY = 250;
	newSpeedX = 0;
	newSpeedY = 0;
	timeout = 0;

	private interval: NodeJS.Timeout | null = null;

	constructor() {
		this.startLoop();
	}

	startLoop() {
		this.interval = setInterval(() => this.update(), 16);
	}

	update() {
		if (this.gameStarted) {
			if (this.leftScore === 5 || this.rightScore === 5) {
				this.gameStarted = false;
				this.message = this.leftScore === 5 ? "Player 1 win !" : "Player 2 win !";
				setTimeout(() => {
					if (!this.gameStarted) {
						this.leftScore = 0;
						this.rightScore = 0;
						this.message = "Press space to start !";
					}
				}, 5000);
			}

			this.ballX += this.ballSpeedX;
			this.ballY += this.ballSpeedY;

			if (this.ballY <= 0 || this.ballY >= 590)
				this.ballSpeedY = -this.ballSpeedY;

			this.handleCollisions();

			if (this.ballX <= -10) {
				this.rightScore++;
				this.resetBall();
			} else if (this.ballX >= 800) {
				this.leftScore++;
				this.resetBall();
			}
		}
	}

	stop() {
		if (this.interval) clearInterval(this.interval);
	}

	handleCollisions() {
		const collision = (paddleY: number, ballY: number) => {
			if (ballY < paddleY + 34) return -2;
			if (ballY > paddleY + 66) return 2;
			return 0;
		};

		if (this.ballSpeedX < 0 && this.ballX <= 15 && this.ballY >= this.leftPaddleY && this.ballY <= this.leftPaddleY + 100) {
			this.ballSpeedX = -this.ballSpeedX;
			if (this.ballSpeedX < 10) this.ballSpeedX += 0.5;
			this.ballSpeedY += collision(this.leftPaddleY, this.ballY);
		}
		else if (this.ballSpeedX > 0 && this.ballX >= 775 && this.ballY >= this.rightPaddleY && this.ballY <= this.rightPaddleY + 100) {
			this.ballSpeedX = -this.ballSpeedX;
			if (this.ballSpeedX > -10) this.ballSpeedX -= 0.5;
			this.ballSpeedY += collision(this.rightPaddleY, this.ballY);
		}
	}

	resetBall() {
		this.ballX = 395;
		this.ballY = 295;
		this.newSpeedX = this.ballSpeedX < 0 ? 5 : -5;
		this.newSpeedY = this.ballSpeedY < 0 ? 5 : -5;
		this.ballSpeedX = 0;
		this.ballSpeedY = 0;

		if (this.leftScore !== 5 && this.rightScore !== 5) {
			this.message = "3";
			setTimeout(() => this.message = "2", 1000);
			setTimeout(() => this.message = "1", 2000);
			setTimeout(() => {
				this.ballSpeedX = this.newSpeedX;
				this.ballSpeedY = this.newSpeedY;
				this.message = "";
			}, 3000);
		}
	}

	move(keys: any) {
		this.leftOldY = this.leftPaddleY;
		this.rightOldY = this.rightPaddleY;

		if (keys.ArrowUp) this.rightPaddleY -= 10;
		if (keys.ArrowDown) this.rightPaddleY += 10;
		if (keys.w) this.leftPaddleY -= 10;
		if (keys.s) this.leftPaddleY += 10;

		this.rightPaddleY = Math.max(0, Math.min(500, this.rightPaddleY));
		this.leftPaddleY = Math.max(0, Math.min(500, this.leftPaddleY));
	}

	startGame() {
		if (!this.gameStarted) {
			this.message = "";
			this.gameStarted = true;
			this.ballSpeedX = 5;
			this.ballSpeedY = 5;
			this.leftScore = 0;
			this.rightScore = 0;
		}
	}

	getState() {
		return {
			ballX: this.ballX,
			ballY: this.ballY,
			leftPaddleY: this.leftPaddleY,
			rightPaddleY: this.rightPaddleY,
			leftScore: this.leftScore,
			rightScore: this.rightScore,
			message: this.message
		};
	}
}
