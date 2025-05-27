"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
class GameInstance {
    constructor(userId, userName) {
        this.player1 = { id: "", name: "" };
        this.player2 = { id: "", name: "" };
        this.full = false;
        this.ballX = 400;
        this.ballY = 300;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.leftPaddleY = 250;
        this.rightPaddleY = 250;
        this.leftScore = 0;
        this.rightScore = 0;
        this.message = "Waiting for new player...";
        this.gameStarted = false;
        this.leftOldY = 250;
        this.rightOldY = 250;
        this.newSpeedX = 0;
        this.newSpeedY = 0;
        this.interval = null;
        this.player1.id = userId;
        this.player1.name = userName;
        this.startLoop();
    }
    startLoop() {
        this.interval = setInterval(() => this.update(), 16);
    }
    update() {
        if (this.full && this.gameStarted) {
            if (this.leftScore === 5 || this.rightScore === 5) {
                this.gameStarted = false;
                this.message = this.leftScore === 5 ? `${this.player1.name} win !` : `${this.player2.name} win !`;
                /*
                    METTRE ICI LE CODE POUR METTRE DANS LA BDD L'HISTORIQUE DE CETTE PARTIE !!!!!!!!!!!!!!!!!!!!!!!
                */
            }
            this.ballX += this.ballSpeedX;
            this.ballY += this.ballSpeedY;
            if (this.ballY <= 0 || this.ballY >= 590)
                this.ballSpeedY = -this.ballSpeedY;
            this.handleCollisions();
            if (this.ballX <= 0) {
                this.rightScore++;
                this.resetBall();
            }
            else if (this.ballX >= 800) {
                this.leftScore++;
                this.resetBall();
            }
        }
    }
    stop() {
        if (this.interval)
            clearInterval(this.interval);
    }
    handleCollisions() {
        const collision = (paddleY, ballY) => {
            if (ballY < paddleY + 34)
                return -2;
            if (ballY > paddleY + 66)
                return 2;
            return 0;
        };
        if (this.ballSpeedX < 0 && this.ballX <= 15 && this.ballY >= this.leftPaddleY && this.ballY <= this.leftPaddleY + 100) {
            this.ballSpeedX = -this.ballSpeedX;
            if (this.ballSpeedX < 10)
                this.ballSpeedX += 0.5;
            this.ballSpeedY += collision(this.leftPaddleY, this.ballY);
        }
        else if (this.ballSpeedX > 0 && this.ballX >= 775 && this.ballY >= this.rightPaddleY && this.ballY <= this.rightPaddleY + 100) {
            this.ballSpeedX = -this.ballSpeedX;
            if (this.ballSpeedX < 10)
                this.ballSpeedX += 0.5;
            this.ballSpeedY += collision(this.rightPaddleY, this.ballY);
        }
    }
    resetBall() {
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
    move_left(keys) {
        this.leftOldY = this.leftPaddleY;
        if (keys.ArrowUp)
            this.leftPaddleY -= 10;
        if (keys.ArrowDown)
            this.leftPaddleY += 10;
        this.leftPaddleY = Math.max(0, Math.min(500, this.leftPaddleY));
    }
    move_right(keys) {
        this.rightOldY = this.rightPaddleY;
        if (keys.ArrowUp)
            this.rightPaddleY -= 10;
        if (keys.ArrowDown)
            this.rightPaddleY += 10;
        this.rightPaddleY = Math.max(0, Math.min(500, this.rightPaddleY));
    }
    startGame() {
        if (this.full && !this.gameStarted) {
            this.message = "5";
            setTimeout(() => this.message = "4", 1000);
            setTimeout(() => this.message = "3", 2000);
            setTimeout(() => this.message = "2", 3000);
            setTimeout(() => this.message = "1", 4000);
            setTimeout(() => {
                this.message = "";
                this.gameStarted = true;
                this.ballSpeedX = 5;
                this.ballSpeedY = 5;
                this.leftScore = 0;
                this.rightScore = 0;
            }, 5000);
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
exports.GameInstance = GameInstance;
