import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initCreateTournament from '../tournament/create_tournament';
import initJoinTournament from '../tournament/join_tournament';

export default async function initHome() {
	await initChooseGame();
	await initChat();
	await initsearch();
	initCreateTournament();
	initJoinTournament();
}
