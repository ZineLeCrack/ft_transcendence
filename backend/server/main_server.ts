import express, { Request, Response } from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { GameSession } from './game_session';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const sessions = new Map<string, GameSession>();

// Extend Express Request with session
declare global {
	namespace Express {
		interface Request {
			session?: GameSession;
		}
	}
}

// Start a new game session
app.post('/start', (req: Request, res: Response) => {
	const id = uuidv4();
	const session = new GameSession(id);
	sessions.set(id, session);
	res.json({ id, url: `https://10.12.200.81/game/local/${id}` });
});

// Middleware to load session
app.use('/game/local/:id', (req, res, next) => {
	const session = sessions.get(req.params.id);
	if (!session)
	{
		res.status(404).send('Session not found');
		return ;
	}
	req.session = session;
	next();
});

// Game state endpoint
app.get('/game/local/:id/state', (req: Request, res: Response) => {
	const s = req.session!;
	res.json({
		ballX: s.ballX,
		ballY: s.ballY,
		leftPaddleY: s.leftPaddleY,
		rightPaddleY: s.rightPaddleY,
		leftScore: s.leftScore,
		rightScore: s.rightScore,
		message: s.message,
	});
});

// Start game endpoint
app.post('/game/local/:id/start', (req: Request, res: Response) => {
	req.session!.startGame();
	res.sendStatus(200);
});

// Paddle movement endpoint
app.post('/game/local/:id/move', (req: Request, res: Response) => {
	req.session!.move(req.body.keys);
	res.sendStatus(200);
});
