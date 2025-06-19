import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initCreateTournament from '../tournament/create_tournament';
import initJoinTournament from '../tournament/join_tournament';
import initInTournament from '../tournament/in_tournament';
import initFriendChat, { initSwitchChat } from '../chat/friendchat';
import { initWebSocket } from '../websocket.js';
import initError from '../error.js'
import { loadRoutes } from '../main.js';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';
import { loadProfilePicture } from '../profile/editinfo.js';

export default async function initHome() {
	await initLanguageSelector();

	try {
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});

		if (!response.ok)
		{
			initError(translate('Error_co'))
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return ;
		}
		const info = await response.json();

		initWebSocket(info.original);
		initChooseGame();
		initChat();
		await initFriendChat();
		initSwitchChat();
		await initsearch();

		const res = await fetch('/api/tournament/is_in', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});

		if (!res.ok)
		{
			console.error(`Failed to load tournament`);
			return ;
		}

		loadProfilePicture("profileBtn", "l");
		const data = await res.json();

		if (data.tournamentId === '0')
		{
			initCreateTournament();
			initJoinTournament();
		}
		else
			initInTournament(data.tournamentId);
	} catch (err) {
		console.error('Error initializing home:', err);
	}
}
