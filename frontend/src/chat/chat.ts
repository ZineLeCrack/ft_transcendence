import { getWebSocket } from '../websocket';
import { loadRoutes } from '../main.ts';
import initError from '../error.ts';
let original_name:string;

export async function sendMessage(username: string, content: string, pong?: boolean, targetUser: string = "global", friendRequest?: boolean) {


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
		msg.textContent = `${username} wants to play with you !`;
		
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "flex gap-4 mt-2";
		
		const acceptBtn = document.createElement("button");
		acceptBtn.id = 'accept-button-pong';
		acceptBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
		acceptBtn.textContent = "Accept";
		
		const declineBtn = document.createElement("button");
		declineBtn.id = 'decline-button-pong';
		declineBtn.className = "bg-transparent border-2 border-[#FF007A] px-6 py-2 rounded-xl text-[#FF007A] font-bold hover:bg-[#FF007A]/20 transition duration-200 shadow-[0_0_10px_#FF007A]";
		declineBtn.textContent = "Decline";
		
		acceptBtn.addEventListener('click', () => {
			// TODO: Handle game acceptance
			console.log('Game accepted');
			msg.remove();
			acceptBtn.remove();
			declineBtn.remove();
		});
		
		declineBtn.addEventListener('click', () => {
			// TODO: Handle game decline
			console.log('Game declined');
			msg.remove();
			acceptBtn.remove();
			declineBtn.remove();
		});
		
		container.appendChild(msg);
		container.appendChild(acceptBtn);
		container.appendChild(declineBtn);
		container.appendChild(buttonsDiv);
		messageWrapper.appendChild(container);

		return;
	}

	if (friendRequest === true) {

		const container = document.createElement("div");
		container.className = "flex flex-col items-center space-y-2 my-4";

		messageWrapper.className = "flex flex-col items-center space-y-2 my-4";
		
		const msg = document.createElement("div");
		msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
		msg.textContent = `${targetUser} wants to be friend with you !`;
	
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "flex gap-4 mt-2";

		const acceptBtn = document.createElement("button");
		acceptBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
		acceptBtn.textContent = "Accept";
		
		const declineBtn = document.createElement("button");
		declineBtn.className = "bg-transparent border-2 border-[#FF007A] px-6 py-2 rounded-xl text-[#FF007A] font-bold hover:bg-[#FF007A]/20 transition duration-200 shadow-[0_0_10px_#FF007A]";
		declineBtn.textContent = "Decline";

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
					sendMessage(message.username, message.content);
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
}

