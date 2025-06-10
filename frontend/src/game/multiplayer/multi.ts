import { draw } from "./drawmap_multi.js";
import { loadRoutes } from "../../main.js";
import initError from "../../error.js";
import { getWebSocket, initWebSocket } from "../../websocket.js";

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
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	if (!response.ok) {
		initError('Please Sign in or Sign up !');
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return ;
	}
	const info = await response.json();
					
	initWebSocket(info.original);

	const player = sessionStorage.getItem("player");
	
	const h1player1 = document.getElementById('name-player1') as HTMLHeadingElement;
	const h1player2 = document.getElementById('name-player2') as HTMLHeadingElement;

	if (player === 'player1')
	{
		h1player1.textContent = `${info.original}`;
	}
	else
	{
		h1player2.textContent = `${info.original}`;	
	}

	let keys: { [key: string]: boolean } = {
		ArrowUp: false,
		ArrowDown: false
	};

	let gameOver = false;

	const gameId = sessionStorage.getItem("gameId");
	const SERVER_URL = `/api/multi/game/${gameId}`;

	async function fetchState() {
		if (gameOver)
			return ;
		try {
			const res = await fetch(`${SERVER_URL}/state`);
			const data = await res.json();
			if (data.end)
			{
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
						}
						const ws = getWebSocket();
						ws?.send(JSON.stringify({ type: 'tournament_new_player', token: sessionStorage.getItem('token'), id: gameStat.tournamentId }));
					}
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

	setInterval(() => {
		if (gameOver)
			return ;
		fetch(`${SERVER_URL}/${player}move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ keys })
		}).catch(err => console.error("Erreur POST /move:", err));
	}, 16);

	setInterval(fetchState, 16);
}
