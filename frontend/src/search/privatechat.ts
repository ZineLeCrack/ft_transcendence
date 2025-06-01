import { sendMessage }  from '../chat/chat.js';

export default async function initPrivateChat(username?: string) {

	const chatBtn = document.getElementById('chat-btn') as HTMLButtonElement;
	const chatPopup = document.getElementById('chat-popup') as HTMLDivElement;
	const closeChat = document.getElementById('close-chat') as HTMLButtonElement;
	const nameHeader = document.getElementById('name-header');

	if (username && nameHeader) {
		nameHeader.innerHTML = `
		<span class="mr-2 text-[#FF2E9F]">⚡</span>
		CHAT://${username}
		<span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>
	 `;
	}

	chatBtn.addEventListener('click', () => {
		if (chatPopup.classList.contains('hidden')) {
			chatPopup.classList.remove('hidden');
			chatPopup.classList.add('flex');
			chatBtn.textContent = 'Close Chat';
		}
		else {
			chatPopup.classList.add('hidden');
			chatPopup.classList.remove('flex');
			chatBtn.textContent = 'Chat With Me !';
		}
	});

	closeChat.addEventListener('click', () => {
		chatBtn.textContent = 'Chat With Me !';
		chatPopup.classList.add('hidden');
		chatPopup.classList.remove('flex');
	});

	const input = document.getElementById("private-chat-input") as HTMLInputElement;
	const sendBtn = document.getElementById("private-chat-send") as HTMLButtonElement;
	const pongBtn = document.getElementById("private-pong-send") as HTMLButtonElement;
	const messageBox = document.getElementById("private-chat-messages") as HTMLDivElement;

	sendBtn.addEventListener("click", () => {
		sendMessage("username", input.value, messageBox); // Replace "username" with the actual username
	});

	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			sendMessage("username", input.value, messageBox); // Replace "username" with the actual username
		}
	});

	pongBtn.addEventListener("click", () => {
		sendMessage("username", "" , messageBox, true); // Replace "username" with the actual username
	});
}	//ajouter fetch et websocket pour envoyer les messages privés 
