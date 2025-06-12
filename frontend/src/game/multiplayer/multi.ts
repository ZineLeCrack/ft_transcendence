import { draw } from "./drawmap_multi.js";
import { loadRoutes } from "../../main.js";
import initError from "../../error.js";
import { getWebSocket, initWebSocket } from "../../websocket.js";
import { translate } from "../../i18n.js";

export let ballX = 400;
export let ballY = 300;
export let leftPaddleY = 250;
export let rightPaddleY = 250;
export let leftScore = 0;
export let rightScore = 0;
export const paddleWidth = 8;
export const paddleHeight = 100;
export let message = "";

export default async function initMultiplayer() {

	const token = sessionStorage.getItem('token');
	const response1 = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token })
	});
	if (!response1.ok) {
		initError(translate('Please Sign in or Sign up !'));
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return ;
	}
	const info = await response1.json();

	initWebSocket(info.original);
	
	let keys: { [key: string]: boolean } = {
		ArrowUp: false,
		ArrowDown: false
	};
	
	let gameOver = false;
	
	const gameId = sessionStorage.getItem("gameId");
	if (!gameId) {
		initError('You are not in a game');
		return ;
	}
	
	const response2 = await fetch('/api/multi/game/which_player', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: token, gameId: gameId })
	})

	const data = await response2.json();
	const player = data.player;

	if (!player) {
		initError('Error connecting to the game');
		return ;
	}

	const SERVER_URL = `/api/multi/game/${gameId}`;
	
	const h1player1 = document.getElementById('name-player1') as HTMLHeadingElement;
	const h1player2 = document.getElementById('name-player2') as HTMLHeadingElement;

	try {
		const getname = await fetch(`${SERVER_URL}/getname`, { method: 'POST'});	
		const name = await getname.json();
		if (!name.player2 || !name.player1) {
			initError('Failed to load player ids');
			return ;
		}
		if (player === 'player1')
		{
			h1player1.textContent = `${info.original}`;
			h1player2.textContent = `${name.player2.name}`;
		} else {
			h1player1.textContent = `${name.player1.name}`;
			h1player2.textContent = `${info.original}`;	
		}
	} catch (err) {
		initError('Failed to load player ids');
		return ;
	}

	async function fetchState() {
		if (gameOver) return ;
		try {
			const res = await fetch(`${SERVER_URL}/state`);
			const data = await res.json();
			if (data.end) {
				gameOver = true;
				setTimeout(async () => {
					if (player === "player1") {
						const response = await fetch(`${SERVER_URL}/end`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ id: data.id })
						});
						const gameStat = await response.json();
						await fetch(`/api/addhistory`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(gameStat)
						});
						if (gameStat.tournament) {
							const res = await fetch(`/api/multi/tournament/next_game`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ tournamentId: gameStat.tournamentId })
							});
							const results = await res.json();
							await fetch(`/api/tournament/results`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(results)
							});
							const ws = getWebSocket();
							ws?.send(JSON.stringify({ type: 'tournament_next_game', next_player1: results.next_player1, next_player2: results.next_player2, id: gameStat.tournamentId }));
						} else if (gameStat.private) {
							await fetch('/api/private_game/end', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ username1: gameStat.username1, username2: gameStat.username2 })
							});
						}
					}
					sessionStorage.removeItem("gameId");
					history.pushState(null, '', '/home');
					await loadRoutes('/home');
				}, 1000);
			}
			ballX = data.ballX;
			ballY = data.ballY;
			leftPaddleY = data.leftPaddleY;
			rightPaddleY = data.rightPaddleY;
			leftScore = data.leftScore;
			rightScore = data.rightScore;
			message = data.message;
			draw();
		} catch (error) {
			console.error("Erreur de fetchState:", error);
		}
	}

	document.addEventListener("keydown", (e) => {
		if (e.key in keys) keys[e.key] = true;
	});

	document.addEventListener("keyup", (e) => {
		if (e.key in keys) keys[e.key] = false;
	});

	const interval1 = setInterval(() => {
		if (gameOver) return ;
		fetch(`${SERVER_URL}/${player}move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ keys })
		}).catch(err => console.error("Erreur POST /move:", err));
	}, 16);

	const interval2 = setInterval(fetchState, 16);

	window.addEventListener('popstate', async () => {
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		await fetch(`/api/multi/game/disconnection`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId: gameId })
		});
	});
}
