import { getWebSocket } from '../websocket';
import { loadRoutes } from '../main.ts';
import { translate } from '../i18n.ts';
import initError from '../error.ts';

let original_name:string;
let original_id:string;

export async function sendMessage(username: string, content: string, pong?: boolean, targetUser: string = "global", friendRequest?: boolean, pongGame? : boolean, requestDecline?: boolean, yourparty?: boolean, winner?: boolean) {

	const messageWrapper = targetUser === "global" ? document.getElementById('chat-messages-global')
	: document.getElementById(`chat-messages-${targetUser}`);

	if (!messageWrapper) return ;

	if (winner === true)
	{
		const container = document.createElement("div");
		container.id = `container-winner-tournament-pong-${content}`;
		container.className = "flex flex-col items-center space-y-2 my-4";

		const msg = document.createElement("div");
		msg.id = `winner-tournament-pong${content}`;
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		const requestText = translate('has_won_the_tournament');
		msg.textContent = `${username} ${requestText}`;

		container.appendChild(msg);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');

		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}

		return ;
	}

	if (yourparty === true)
	{
		const container = document.createElement("div");
		container.id = "container-is-your-turn";
		container.className = "flex flex-col items-center space-y-2 my-4";

		const msg = document.createElement("div");

		msg.id = "your-turn";
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		const requestText = translate('your_turn');

		msg.textContent = `${requestText}`;
		container.appendChild(msg);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');

		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		return ;
	}

	const target = username;
	try {
		const res = await fetch("/api/isblock", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ target }),
			credentials: 'include',
		});
		const data = await res.json();
		if (data.status === 1) return ;
	} catch (err) {
		console.error('Error getting player status:', err);
		return ;
	}

	if (pongGame === true) {

		const oldContainer = document.getElementById('container-pong-game-join');

		if (oldContainer) {
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
		} else {
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
			try {
				const response = await fetch('/api/multi/game/private/join', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ })
				});

				const data = await response.json();

				const ws = getWebSocket();
				ws?.send(JSON.stringify({ type: 'multi_player_join', gameId: data.gameId }));

				setTimeout(async () => {
					sessionStorage.setItem("gameId", data.gameId);
					history.pushState(null, '', '/game/multi');
					await loadRoutes('/game/multi');
				}, 100);
			} catch (err) {
				console.error('Error joining private game:', err);
			}
		});

		container.appendChild(msg);
		container.appendChild(JoinBtn);
		container.appendChild(buttonsDiv);
		messageWrapper.appendChild(container);
		const chatContainer = document.getElementById('chat-containers');

		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}

		return ;
	}

	if (pong === true) {

		const oldContainer = document.getElementById('container-pong-request');

		if (oldContainer) {
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
			try {
				await fetch("/api/private_game/reply-pong", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: 'include',
					body: JSON.stringify({ target: targetUser, answer: 1 })
				});
				msg.remove();
				acceptBtn.remove();
				declineBtn.remove();
				container.remove();
				const response = await fetch ('/api/search', {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username: targetUser })
				});
				const userData = await response.json();
				await fetch('/api/multi/game/private/create', {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ target: userData.id }),
					credentials: 'include',
				});
				const ws = getWebSocket();
				const targetUsername = targetUser;
				let chatdata = { type: 'new_private_message', content : "" , targetUsername, pongRequest: 2};
				ws?.send(JSON.stringify(chatdata));
			} catch (err) {
				console.error('Error sending reply:', err);
			}
		});

		declineBtn.addEventListener('click', async () => {
			try {
				await fetch("/api/private_game/reply-pong", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: 'include',
					body: JSON.stringify({ target: targetUser, answer: 0 })
				});
				msg.remove();
				acceptBtn.remove();
				declineBtn.remove();
				container.remove();
				const ws = getWebSocket();
				const targetUsername = targetUser;
				let chatdata = { type: 'new_private_message', content : "" , targetUsername, pongRequest: 3 };
				ws?.send(JSON.stringify(chatdata));
			} catch (err) {
				console.error('Error sending reply:', err);
			}
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

		return ;
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

		return ;
	}

	if (friendRequest === true) {

		const container = document.createElement("div");
		container.className = "flex flex-col items-center space-y-2 my-4";

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

		const ws = getWebSocket();
		acceptBtn.addEventListener('click', async () => {
			try {
				const target = targetUser;
				await fetch("/api/replyrequest", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ target , answer: 1 }),
						credentials: 'include',
					});
				let chatdata;
				chatdata = { type: 'accept_friend', targetUsername : target};
				ws?.send(JSON.stringify(chatdata));
			} catch (err) {
				console.error('Error responding to the request:', err);
			}
		});

		declineBtn.addEventListener('click', async () => {
			try {
				const target = targetUser;
				await fetch("/api/replyrequest", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: 'include',
						body: JSON.stringify({  target , answer: 0 })
					});
				let chatdata;
				chatdata = { type: 'decline_friend', targetUsername: target };
				ws?.send(JSON.stringify(chatdata));
			} catch (err) {
				console.error('Error responding to the request:', err);
			}
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

		return ;
	}

	if (content === "") return ;

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
		try {
			const response = await fetch('/api/verifuser', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ }),
				credentials: 'include',
			});

			if (!response.ok) {
				setTimeout(async () => {
					history.pushState(null, '', '/login');
					await loadRoutes('/login');
				}, 1000);
			}

			const data = await response.json();
			original_name = data.original;
			original_id = data.id_user;
		} catch (err) {
			console.error('Error verifying user:', err);
		}

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
					if (message.announceTournament === 2)
					{
						if (original_id == message.announceTournament_id1 || original_id == message.announceTournament_id2)
						{
							await sendMessage('', '', false, 'global', false, false, false, true);
						}
					}
					else if (message.announceTournament === 3)
					{
						await sendMessage(message.username, '', false, 'global', false, false, false, false, true);
					}
					else
					{
						await sendMessage(message.username, message.content);
					}
				}
			} catch (err) {
				console.error("Error getting messages:", err);
			}
		}

		sendBtn.addEventListener("click", async () => {
			const content = input.value.trim();
			if (content === "") return ;
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
			} catch (err) {
				console.error('Error verrifying user:', err);
			}
			let chatdata;

			if (document.getElementById("chat-messages-global")) {
				chatdata = { type: 'new_message', content };
			} else {
				const BoxTarget = document.querySelector('[id^="chat-messages-"]');
				const targetUsername = BoxTarget?.id.split('-').pop();
				chatdata = { type: 'new_private_message', content , targetUsername };
			}

			ws?.send(JSON.stringify(chatdata));
			input.value = "";
		});

		input.addEventListener("keydown", async (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				const content = input.value.trim();
				if (content === "") return ;

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
				} catch (err) {
					console.error('Error verrifying user:', err);
				}

				let chatdata;

				if (document.getElementById("chat-messages-global")) {
					chatdata = { type: 'new_message', content };
				} else {
					const BoxTarget = document.querySelector('[id^="chat-messages-"]');
					const targetUsername = BoxTarget?.id.split('-').pop();
					chatdata = { type: 'new_private_message', content , targetUsername, pongRequest: 0 };
				}

				ws?.send(JSON.stringify(chatdata));
				input.value = "";
			}
		});

		displayAllMessages();
	})();
}
