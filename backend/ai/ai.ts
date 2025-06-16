import Fastify from 'fastify';

const fastify = Fastify();

export function getAIMove(
	paddlePosition: number,
	ballPosition: { x: number; y: number },
	ballDirection: { x: number; y: number }
) {
	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 600;
	const BALL_SIZE = 10;
	const PADDLE_HEIGHT = 100;
	const PADDLE_SPEED = 10;

	let direction: string = 'none';
	let duration: number = 0;

	if (ballDirection.x > 0) {
		let simX = ballPosition.x;
		let simY = ballPosition.y;
		let simVX = ballDirection.x;
		let simVY = ballDirection.y;

		while (simX < GAME_WIDTH - BALL_SIZE) {
			simX += simVX;
			simY += simVY;

			if (simY <= 0 || simY >= GAME_HEIGHT - BALL_SIZE) {
				simVY = -simVY;
				simY = Math.max(0, Math.min(GAME_HEIGHT - BALL_SIZE, simY));
			}
		}
		const target = simY - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
		const delta = target - paddlePosition;

		if (Math.abs(delta) > 8) {
			direction = delta > 0 ? 'down' : 'up';
			duration = Math.min(1000, Math.max(10, Math.abs(delta / PADDLE_SPEED) * 12));
		}
	} else {
		const target = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
		const delta = target - paddlePosition;
		if (Math.abs(delta) > 10) {
			direction = delta > 0 ? 'down' : 'up';
			duration = Math.min(1000, Math.max(10, Math.abs(delta / PADDLE_SPEED) * 12));
		}
	}

	return { direction, duration };
}

export default fastify;
