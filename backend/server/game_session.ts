// GameSession.ts
export class GameSession {
	ballX = 400;
	ballY = 300;
	ballSpeedX = 0;
	ballSpeedY = 0;
	leftPaddleY = 250;
	rightPaddleY = 250;
	leftScore = 0;
	rightScore = 0;
	leftOldY = 250;
	rightOldY = 250;
	newSpeedX = 0;
	newSpeedY = 0;
	gameStarted = false;
	countDown = 0;
	message = "Press space to start !";

	constructor(public id: string) {
		this.loop();
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

	private loop() {
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

			if (this.ballSpeedX < 0 && this.ballX <= 15 && this.ballY >= this.leftPaddleY && this.ballY <= this.leftPaddleY + 100) {
				this.ballSpeedX = -this.ballSpeedX;
				if (this.ballSpeedX < 10) this.ballSpeedX += 0.5;
				this.adjustBallDirection(this.leftPaddleY);
			} else if (this.ballSpeedX > 0 && this.ballX >= 775 && this.ballY >= this.rightPaddleY && this.ballY <= this.rightPaddleY + 100) {
				if (this.ballSpeedX < 10) this.ballSpeedX += 0.5;
				this.ballSpeedX = -this.ballSpeedX;
				this.adjustBallDirection(this.rightPaddleY);
			}

			if (this.ballX <= 0) {
				this.rightScore++;
				this.resetBall();
			} else if (this.ballX >= 800) {
				this.leftScore++;
				this.resetBall();
			}
		}

		if (this.rightOldY === this.rightPaddleY && this.leftOldY === this.leftPaddleY) {
			this.countDown++;
			if (this.countDown > 2000) {
				this.message = "TIMEOUT";
				// Optionally: mark session as expired
			}
		} else {
			this.countDown = 0;
		}

		setTimeout(() => this.loop(), 16);
	}

	private adjustBallDirection(paddleY: number) {
		if (this.ballSpeedY < 0) {
			if (this.ballY < paddleY + 34) {
				if (this.ballSpeedY > -7) this.ballSpeedY -= 2;
			} else if (this.ballY > paddleY + 66) {
				if (this.ballSpeedY < -3) this.ballSpeedY += 2;
			}
		} else {
			if (this.ballY < paddleY + 34) {
				if (this.ballSpeedY > 3) this.ballSpeedY -= 2;
			} else if (this.ballY > paddleY + 66) {
				if (this.ballSpeedY < 7) this.ballSpeedY += 2;
			}
		}
	}

	private resetBall() {
		this.ballX = 400;
		this.ballY = 300;
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
}
