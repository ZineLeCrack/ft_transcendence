import initChooseGame from '../game/choosegame';
import initChat from '../chat/chat';


export default async function initHome() {
	await initChooseGame();
	await initChat();
}
