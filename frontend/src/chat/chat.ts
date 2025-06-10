import { getWebSocket } from '../websocket';
import { loadRoutes } from '../main.ts';
import initError from '../error.ts';
import { translate } from '../i18n.ts';
import { loadProfilePicture } from '../profile/editinfo.ts';

let original_name:string;

export async function sendMessage(username: string, content: string, pong?: boolean, targetUser: string = "global", friendRequest?: boolean, pongGame? : boolean, requestDecline?: boolean) {

	const messageWrapper = targetUser === "global" ?  document.getElementById('chat-messages-global')
	: document.getElementById(`chat-messages-${targetUser}`);

	if (!messageWrapper)
		return;

	const target = username;
	const tokenID = sessionStorage.getItem('token');
	const res = await fetch("/api/isblock", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tokenID, target })
	});
	const data = await res.json();
	if (data.status === 1)
		return;

	if (pongGame === true)
	{
		const oldContainer = document.getElementById('container-pong-game-join');
		if (oldContainer)
		{
			oldContainer.remove();
		}

		const container = document.createElement("div");
		container.id = "container-pong-game-join";
		container.className = "flex flex-col items-center space-y-2 my-4";

		const msg = document.createElement("div");
		msg.id = "pong-game-join";
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		
		if (username === original_name) {
			const invitationText = translate('pong_game_accepted_you');
			msg.textContent = `${targetUser} ${invitationText}`;
		}
		else {
			const invitationText = translate('pong_game_accepted_other');
			msg.textContent = `${invitationText}`;
		}
		
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "flex gap-4 mt-2";
		
		const JoinBtn = document.createElement("button");
		JoinBtn.id = 'join-button-pong';
		JoinBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
		const joinText = translate('join_button');
		JoinBtn.textContent = `${joinText}`;

		JoinBtn.addEventListener('click', async () => {
			const token = sessionStorage.getItem('token');
			console.log("partie rejointe");
		});

		container.appendChild(msg);
		container.appendChild(JoinBtn);
		container.appendChild(buttonsDiv);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		return;
	}

	if (pong === true) {
		
		const oldContainer = document.getElementById('container-pong-request');
		if (oldContainer)
		{
			oldContainer.remove();
		}

		const container = document.createElement("div");
		container.id = "container-pong-request";
		container.className = "flex flex-col items-center space-y-2 my-4";

		const msg = document.createElement("div");
		msg.id = "pong-request";
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		const requestText = translate('pong_request_message');
		msg.textContent = `${username} ${requestText}`;
		
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "flex gap-4 mt-2";
		
		const acceptBtn = document.createElement("button");
		acceptBtn.id = 'accept-button-pong';
		acceptBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
		const acceptText = translate('accept_button');
		acceptBtn.textContent = `${acceptText}`;
		
		const declineBtn = document.createElement("button");
		declineBtn.id = 'decline-button-pong';
		declineBtn.className = "bg-transparent border-2 border-[#FF007A] px-6 py-2 rounded-xl text-[#FF007A] font-bold hover:bg-[#FF007A]/20 transition duration-200 shadow-[0_0_10px_#FF007A]";
		const declineText = translate('decline_button');
		declineBtn.textContent = `${declineText}`;

		acceptBtn.addEventListener('click', async () => {
			const token = sessionStorage.getItem('token');
			await fetch("/api/reply-pong", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, target: targetUser, answer: 1 })
			});
			msg.remove();
			acceptBtn.remove();
			declineBtn.remove();
			container.remove();
			const ws = getWebSocket();
			const targetUsername = targetUser;
			let chatdata = { type: 'new_private_message', token, content : "" , targetUsername, pongRequest: 2};
			ws?.send(JSON.stringify(chatdata));
		});

		declineBtn.addEventListener('click', async () => {
			const token = sessionStorage.getItem('token');
			await fetch("/api/reply-pong", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, target: targetUser, answer: 0 })
			});
			msg.remove();
			acceptBtn.remove();
			declineBtn.remove();
			container.remove();
			const ws = getWebSocket();
			const targetUsername = targetUser;
			let chatdata = { type: 'new_private_message', token, content : "" , targetUsername, pongRequest: 3};
			ws?.send(JSON.stringify(chatdata));
		});

		container.appendChild(msg);
		container.appendChild(acceptBtn);
		container.appendChild(declineBtn);
		container.appendChild(buttonsDiv);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		return;
	}

	if (requestDecline === true)
	{
		const container = document.createElement("div");
		container.id = "container-pong-request-decline";
		container.className = "flex flex-col items-center space-y-2 my-4";

		const msg = document.createElement("div");
		msg.id = "Request-decline";
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		const requestText = translate('request_declined_message');
		msg.textContent = `${requestText}`;

		container.appendChild(msg);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		return;
	}

	if (friendRequest === true) {

		const container = document.createElement("div");
		container.className = "flex flex-col items-center space-y-2 my-4";

		messageWrapper.className = "flex flex-col items-center space-y-2 my-4";
		
		const msg = document.createElement("div");
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		const friendText = translate('friend_request_message');
		msg.textContent = `${targetUser} ${friendText}`;
	
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "flex gap-4 mt-2";

		const acceptBtn = document.createElement("button");
		acceptBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
		const acceptText = translate('accept_button');
		acceptBtn.textContent = `${acceptText}`;
		
		const declineBtn = document.createElement("button");
		declineBtn.className = "bg-transparent border-2 border-[#FF007A] px-6 py-2 rounded-xl text-[#FF007A] font-bold hover:bg-[#FF007A]/20 transition duration-200 shadow-[0_0_10px_#FF007A]";
		const declineText = translate('decline_button');
		declineBtn.textContent = `${declineText}`;

		acceptBtn.addEventListener('click', async () => {
			const tokenID = sessionStorage.getItem('token');
			const target = targetUser; 
			const res = await fetch("/api/replyrequest", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tokenID, target , answer: 1})
				});
			const data = await res.json();
			window.location.reload();
		});
		
		declineBtn.addEventListener('click', async () => {
			const tokenID = sessionStorage.getItem('token');
			const target = targetUser; 
			const res = await fetch("/api/replyrequest", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tokenID, target , answer: 0})
				});
			const data = await res.json();
			window.location.reload();
		});
		
		container.appendChild(msg);
		container.appendChild(acceptBtn);
		container.appendChild(declineBtn);
		container.appendChild(buttonsDiv);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		return;
	}

	if (content === "") return;

	const messageContainer = document.createElement("div");
	messageContainer.className = original_name === username ? 
		"flex flex-col items-end gap-1" : 
		"flex flex-col items-start gap-1";

	const usernameDiv = document.createElement("a");
	const msg = document.createElement("div");
	if (original_name === username) {
		usernameDiv.className = "text-[#0f9292] font-mono text-sm hover:underline cursor-pointer";
		msg.className = "font-mono text-[#00FFFF] px-4 py-2 w-fit max-w-[80%] break-words border border-[#0f9292] bg-black/40 rounded-md shadow-[0_0_5px_#0f9292]";
	} else {
		usernameDiv.className = "text-[#FF007A] font-mono text-sm hover:underline cursor-pointer";
		msg.className = "font-mono text-[#00FFFF] px-4 py-2 w-fit max-w-[80%] break-words border border-[#FF007A] bg-black/40 rounded-md shadow-[0_0_5px_#FF007A]";
	}

	usernameDiv.textContent = username;
	usernameDiv.href = `/users/${username}`;
	msg.textContent = content;
	
	messageContainer.appendChild(usernameDiv);
	messageContainer.appendChild(msg);
	messageWrapper.appendChild(messageContainer);
	const chatContainer = document.getElementById('chat-containers');
	if (chatContainer) {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
}

export default function initChat() {
	const input = document.getElementById("chat-input") as HTMLInputElement;
	const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;
	const messageBox = document.getElementById("chat-messages-global") as HTMLDivElement;

	const ws = getWebSocket();

	(async () => {
		const token = sessionStorage.getItem('token');
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});
		if (!response.ok)
		{
			initError('Please Sign in or Sign out !');
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
		}
		const data = await response.json();
		original_name = data.original;

		async function displayAllMessages() {
			try {
				const response = await fetch(`/api/getmessages`, {
					method: 'POST',
				});
				const data = await response.json();
				const tab = data.tab;
				messageBox.innerHTML = "";
				for (let i = 0; i < tab.length; i++) {
					const message = { ...tab[i], isHistoryMessage: true };
					await sendMessage(message.username, message.content);
				}
			} catch (err) {
				console.error("Erreur lors de la récupération des messages :", err);
			}
		}

		sendBtn.addEventListener("click", async () => {
			const token = sessionStorage.getItem('token');
			const content = input.value.trim();
			if (content === "") return;
			let chatdata;
			if (document.getElementById("chat-messages-global"))
			{
				chatdata = { type: 'new_message', token, content };
			}
			else
			{
				const BoxTarget = document.querySelector('[id^="chat-messages-"]');
				const targetUsername = BoxTarget?.id.split('-').pop();
				chatdata = { type: 'new_private_message', token, content , targetUsername};
			}
			ws?.send(JSON.stringify(chatdata));
			input.value = "";
		});

		input.addEventListener("keydown", async (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				const token = sessionStorage.getItem('token');
				const content = input.value.trim();
				if (content === "") return;
				let chatdata;
				if (document.getElementById("chat-messages-global"))
				{
					chatdata = { type: 'new_message', token, content };
				}
				else
				{
					const BoxTarget = document.querySelector('[id^="chat-messages-"]');
					const targetUsername = BoxTarget?.id.split('-').pop();
					chatdata = { type: 'new_private_message', token, content , targetUsername, pongRequest: 0};
				}
				ws?.send(JSON.stringify(chatdata));
				input.value = "";
			}
		});

		displayAllMessages();
	})();
	loadProfilePicture("profileBtn", "l");
}

