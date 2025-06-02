import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initCreateTournament from '../tournament/create_tournament';
import initJoinTournament from '../tournament/join_tournament';
import initPrivateChat from '../chat/friendchat';

export default async function initHome() {
	initChooseGame();
	initChat();
	initPrivateChat();
	await initsearch();
	initCreateTournament();
	initJoinTournament();
}
