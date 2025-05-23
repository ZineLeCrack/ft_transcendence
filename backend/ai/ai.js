"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify = (0, fastify_1.default)();
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BALL_SIZE = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 10;
function getMovementInfo(paddlePos, targetPos, paddleSpeed, framesUntilBall) {
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
fastify.options('/ai', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    reply
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type')
        .code(200)
        .send();
}));
fastify.post('/ai', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    reply
        .header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type');
    const { paddlePosition, ballPosition, ballDirection } = request.body;
    if (typeof paddlePosition !== 'number' ||
        !ballPosition || typeof ballPosition.x !== 'number' || typeof ballPosition.y !== 'number' ||
        !ballDirection || typeof ballDirection.x !== 'number' || typeof ballDirection.y !== 'number') {
        reply.code(400).send({
            error: 'Données invalides. Format attendu: { paddlePosition: number, ballPosition: { x: number, y: number }, ballDirection: { x: number, y: number } }'
        });
        return;
    }
    let direction = 'none';
    let duration = 0;
    if (ballDirection.x < 0) {
        const target = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
        const delta = target - paddlePosition;
        if (Math.abs(delta) > 10) {
            direction = delta > 0 ? 'down' : 'up';
            duration = Math.min(500, Math.max(10, Math.abs(delta / PADDLE_SPEED) * 10));
        }
    }
    else {
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
}));
exports.default = fastify;
