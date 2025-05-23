import Fastify from 'fastify';

const fastify = Fastify();

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BALL_SIZE = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 10;

function getMovementInfo(
    paddlePos: number,
    targetPos: number,
    paddleSpeed: number,
    framesUntilBall: number
) {
    const delta = targetPos - paddlePos;
    const distance = Math.abs(delta);
    const direction = delta > 0 ? 'down' : 'up';

    const framesNeeded = Math.ceil(distance / paddleSpeed);
    const durationMs = framesNeeded * 16;

    const canReachInTime = framesNeeded <= framesUntilBall;

    return {
        direction,
        duration: durationMs,
        canReach: canReachInTime
    };
}

fastify.options('/ai', async (request, reply) => {
    reply
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type')
        .code(200)
        .send();
});

fastify.post('/ai', async (request, reply) => {
    reply
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type');

    const { paddlePosition, ballPosition, ballDirection } = request.body as any;

    if (
        typeof paddlePosition !== 'number' ||
        !ballPosition || typeof ballPosition.x !== 'number' || typeof ballPosition.y !== 'number' ||
        !ballDirection || typeof ballDirection.x !== 'number' || typeof ballDirection.y !== 'number'
    ) {
        reply.code(400).send({
            error: 'Données invalides. Format attendu: { paddlePosition: number, ballPosition: { x: number, y: number }, ballDirection: { x: number, y: number } }'
        });
        return;
    }

    let direction: string = 'none';
    let duration: number = 0;

    if (ballDirection.x < 0) {
        const target = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
        const delta = target - paddlePosition;

        if (Math.abs(delta) > 10) {
            direction = delta > 0 ? 'down' : 'up';
            duration = Math.min(500, Math.max(10, Math.abs(delta / PADDLE_SPEED) * 10));
        }
    } else {
        const framesToRightWall = (GAME_WIDTH - BALL_SIZE - ballPosition.x) / ballDirection.x;
        let future_y = ballPosition.y;
        let dir_y = ballDirection.y;

        for (let i = 0; i < framesToRightWall; i++) {
            future_y += dir_y;
            if (future_y <= 0) {
                future_y = -future_y;
                dir_y = -dir_y;
            }
            if (future_y >= GAME_HEIGHT - BALL_SIZE) {
                future_y = 2 * (GAME_HEIGHT - BALL_SIZE) - future_y;
                dir_y = -dir_y;
            }
        }

        const target = future_y - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
        const move = getMovementInfo(paddlePosition, target, PADDLE_SPEED, framesToRightWall);

        if (move.canReach) {
            direction = move.direction;
            duration = move.duration;
        }
    }

    reply.send({ direction, duration });
});

export default fastify;