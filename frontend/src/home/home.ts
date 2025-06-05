import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initCreateTournament from '../tournament/create_tournament';
import initJoinTournament from '../tournament/join_tournament';
import initInTournament from '../tournament/in_tournament';
import initFriendChat from '../chat/friendchat';
import { initWebSocket } from '../websocket.js';

export default async function initHome() {
	
	const token = sessionStorage.getItem('token');
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	const info = await response.json();
	initWebSocket(info.original);

	initChooseGame();
	initChat();
	initFriendChat();
	await initsearch();
	
	const res = await fetch('/api/tournament/is_in', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: sessionStorage.getItem('token') })
	});

	if (!res.ok)
	{
		console.error(`Failed to load tournament`);
		return ;
	}

	const data = await res.json();

	if (data.tournamentId === '0')
	{
		initCreateTournament();
		initJoinTournament();
	}
	else
		initInTournament(data.tournamentId);
}
