// gameRouter.ts
import { Router } from 'express';
import { GameInstance } from './server.js';

const router = Router();
const games = new Map<string, GameInstance>();

function generateGameId(): string {
	return Math.random().toString(36).substring(2, 10);
}

router.post('/start', (req, res) => {
	const id = generateGameId();
	const game = new GameInstance();
	games.set(id, game);
	console.log(`🎮 Partie créée : ${id}`);
	res.json({ gameId: id });
});

router.get('/:id/state', (req, res) => {
	const game = games.get(req.params.id);
	if (!game)
    {
        res.status(404).json({ error: "Game not found" });
        return ;
    }
	res.json(game.getState());
});

router.post('/:id/start', (req, res) => {
	const game = games.get(req.params.id);
	if (!game)
    {
        res.status(404).json({ error: "Game not found" });
        return ;
    }
	game.startGame();
	res.sendStatus(200);
});

router.post('/:id/move', (req, res) => {
	const game = games.get(req.params.id);
	if (!game)
    {
        res.status(404).json({ error: "Game not found" });
        return ;
    }
	game.move(req.body.keys);
	res.sendStatus(200);
});

export default router;
