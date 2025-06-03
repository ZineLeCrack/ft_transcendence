import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';
import initsearch from '../search/search';
import initCreateTournament from '../tournament/create_tournament';
import initJoinTournament from '../tournament/join_tournament';
import initInTournament from '../tournament/in_tournament';
import initFriendChat from '../chat/friendchat';

export default async function initHome() {
	initChooseGame();
	initChat();
	initFriendChat();
	await initsearch();
	initCreateTournament();
	initJoinTournament();
	initInTournament();
}
