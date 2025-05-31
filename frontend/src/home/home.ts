import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initTournament from '../tournament/tournament';


export default async function initHome() {
	await initChooseGame();
	await initChat();
	await initsearch();
	initTournament();
}
