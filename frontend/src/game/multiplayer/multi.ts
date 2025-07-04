import { loadRoutes } from "../../main.js";
import initError from "../../error.js";
import { getWebSocket, initWebSocket } from "../../websocket.js";
import { translate } from "../../i18n.js";
import { initLanguageSelector } from "../../language.js";

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
	let response1;
	try {
		response1 = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});

		if (!response1.ok) {
			initError(translate('Error_co'));
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return ;
		}
	} catch (err) {
		console.error('Error verifying user:', err);
		return ;
	}

	const info = await response1.json();

	initWebSocket(info.original);
	await initLanguageSelector();

	let keys: { [key: string]: boolean } = {
		ArrowUp: false,
		ArrowDown: false
	};

	let gameOver = false;

	const gameId = sessionStorage.getItem("gameId");
	if (!gameId) {
		initError(translate('Error_co'));
		setTimeout(async () => {
			history.pushState(null, '', '/home');
			await loadRoutes('/home');
		}, 1000);
		return ;
	}

	let response2;
	try {
	response2 = await fetch('/api/multi/game/which_player', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ gameId: gameId }),
		credentials: 'include',
	})
	} catch (err) {
		console.error('Error getting player:', err);
		return ;
	}

	const data = await response2.json();
	const player = data.player;

	if (!player) {
		initError(translate('err_co'));
		setTimeout(async () => {
			history.pushState(null, '', '/home');
			await loadRoutes('/home');
		}, 1000);
		return ;
	}

	const SERVER_URL = `/api/multi/game/${gameId}`;

	const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const topCanvas = document.getElementById("topCanvas") as HTMLCanvasElement;
	const game = gameCanvas.getContext("2d")!;
	const score = topCanvas.getContext("2d")!;

	score.font = "40px 'Caveat'";
	game.font = "80px 'Caveat'";

	function draw() {
		game.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		score.clearRect(0, 0, topCanvas.width, topCanvas.height);

		game.fillStyle = "#FFFFFF";
		game.shadowColor = "#FFFFFF";
		game.shadowBlur = 10;
		let new_message;
		if (message === 'waiting') {
			new_message = translate(message);
		}
		else if (message === "1_win")
		{
			new_message = `${translate("1_lwin")}`
		}
		else if (message === "2_win")
		{
			new_message = `${translate("2_lwin")}`
		}
		else {
			new_message = message;
		}
		game.fillText(new_message, 400 - (new_message.length * 14), 150);

		for (let i = 0; i < 600; i += 18.9)
			game.fillRect(399, i, 2, 15);

		game.fillStyle = "#00FFFF";
		game.shadowColor = "#00FFFF";
		game.shadowBlur = 10;
		game.fillRect(5, leftPaddleY, paddleWidth, paddleHeight);

		game.fillStyle = "#FF007A";
		game.shadowColor = "#FF007A";
		game.shadowBlur = 10;
		game.fillRect(gameCanvas.width - paddleWidth - 5, rightPaddleY, paddleWidth, paddleHeight);

		game.beginPath();
		game.arc(ballX + 5, ballY + 5, 5, 0, Math.PI * 2);
		game.fillStyle = "#FFFFFF";
		game.shadowColor = "#FFFFFF";
		game.shadowBlur = 10;
		game.fill();

		score.fillStyle = "#00FFFF";
		score.shadowColor = "#00FFFF";
		score.shadowBlur = 10;
		score.fillText(leftScore.toString(), 20, 50);

		score.fillStyle = "#FF007A";
		score.shadowColor = "#FF007A";
		score.shadowBlur = 10;
		score.fillText(rightScore.toString(), topCanvas.width - 50, 50);
	}

	const h1player1 = document.getElementById('name-player1') as HTMLHeadingElement;
	const h1player2 = document.getElementById('name-player2') as HTMLHeadingElement;

	try {
		const getname = await fetch(`${SERVER_URL}/getname`, { method: 'POST'});
		const name = await getname.json();
		if (!name.player2 || !name.player1) {
			initError(translate('failed_id'));
			return ;
		}
		h1player1.textContent = name.player1.name && name.player1.name !== '' ? `${name.player1.name}` : translate('player_1_trad');
		h1player2.textContent = name.player2.name && name.player2.name !== '' ? `${name.player2.name}` : translate('player_2_trad');
	} catch (err) {
		initError(translate('failed_id'));
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
							const res1 = await fetch(`/api/multi/tournament/next_game`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ tournamentId: gameStat.tournamentId })
							});
							const results = await res1.json();
							const res2 = await fetch(`/api/tournament/results`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(results)
							});
							const is_last = await res2.json();
							const ws = getWebSocket();
							if (is_last.last) {
								ws?.send(JSON.stringify({ type: 'tournament_end', id: gameStat.tournamentId, winner: results.winner }));
							} else {
								ws?.send(JSON.stringify({ type: 'tournament_next_game', next_player1: results.next_player1, next_player2: results.next_player2, id: gameStat.tournamentId }));
							}
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

	async function onKeyDown(e: KeyboardEvent) {
		if (e.key in keys) keys[e.key] = true;
	}

	async function onKeyUp(e: KeyboardEvent) {
		if (e.key in keys) keys[e.key] = false;
	}

	document.addEventListener("keydown", onKeyDown);

	document.addEventListener("keyup", onKeyUp);

	const interval1 = setInterval(async () => {
		if (gameOver) return ;
		try {
			await fetch(`${SERVER_URL}/${player}move`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ keys })
			});
		} catch (err) {
			console.error('Error sending moves:', err);
		}
	}, 16);

	const interval2 = setInterval(fetchState, 16);

	async function cleanUp() {
		sessionStorage.removeItem("gameId");
		if (interval1) clearInterval(interval1);
		if (interval2) clearInterval(interval2);
		document.removeEventListener("keydown", onKeyDown);
		document.removeEventListener("keyup", onKeyUp);
		try {
			await fetch(`/api/multi/game/disconnection`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gameId: gameId })
			});
		} catch (err) {
			console.error('Error disconnecting player:', err);
		}
		window.removeEventListener("popstate", cleanUp);
	}

	window.addEventListener('popstate', cleanUp);
}
