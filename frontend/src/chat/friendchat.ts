import initError from '../error.ts';
import { sendMessage } from './chat.ts';


export default async function initFriendChat() {
	const switchChatBtn = document.getElementById('switch-chat') as HTMLButtonElement;
	const chatInfo = document.getElementById('chat-info') as HTMLDivElement;
	const friendslist = document.getElementById('friends-list') as HTMLDivElement;
	const friendRequestsCount = document.getElementById('friend-requests-count') as HTMLDivElement;
	
	switchChatBtn.addEventListener('click', async () => {
		if (switchChatBtn.textContent?.includes("friends"))
		{
			const privateChats = chatContainers.querySelectorAll('[id^="chat-messages-"]');
			privateChats.forEach(chat => chat.remove());

			const globalChat = document.getElementById('chat-messages-global') as HTMLDivElement;
			if (globalChat) {
				globalChat.remove();
			}

			switchChatBtn.innerHTML =`
			CHAT://global
			<div id="tooltip-switch-chat" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[#FF2E9F] text-xs px-2 py-1 rounded 
				opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap 
				border border-[#FF2E9F] pointer-events-none">
				Switch to global chat
			</div>`;
			chatInfo.innerHTML = `
				<span class="mr-2 text-[#FF2E9F]">⚡</span>
        	   	CHAT://friends
        	    <span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>
				`;
			friendslist.classList.remove("hidden");
			friendslist.classList.add("flex");
			friendRequestsCount.classList.add("hidden");
			
		}
		else
		{
			const privateChats = chatContainers.querySelectorAll('[id^="chat-messages-"]');
			privateChats.forEach(chat => chat.remove());

			let globalChat = document.getElementById('chat-messages-global') as HTMLDivElement;
			if (!globalChat)
			{
				globalChat = document.createElement('div');
				globalChat.id = 'chat-messages-global';
				globalChat.className = 'flex flex-col space-y-4';
				chatContainers.appendChild(globalChat);
			}

			switchChatBtn.innerHTML =`
				CHAT://friends
				<div id="tooltip-switch-chat" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[#FF2E9F] text-xs px-2 py-1 rounded 
					opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap 
					border border-[#FF2E9F] pointer-events-none">
					Switch to friends chat
				</div>`;

			chatInfo.innerHTML = `
			<span class="mr-2 text-[#FF2E9F]">⚡</span>
           	CHAT://global
            <span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>
			`
			friendslist.classList.remove("flex");
			friendslist.classList.add("hidden");
			friendRequestsCount.classList.remove("hidden");

			const response = await fetch(`/api/getmessages`, {method: 'POST',});
			const data = await response.json();
			const tab = data.tab;
			for (let i = 0; i < tab.length; i++)
			{
				const message = { ...tab[i], isHistoryMessage: true };
				sendMessage(message.username, message.content);
			}
		}
	});

	interface Friend {
		username: string;
		profilPic: string;
		status: 'online' | 'offline';
	}
	
	function generateFriendList(Friend: Friend[]) {
		friendslist.innerHTML = '';
		if (Friend.length === 0) {
			friendslist.innerHTML = '<p class="text-[#FF2E9F]">You have no friends :(</p>';
			return;
		}
		Friend.forEach(Friend => {
			const friendElement = document.createElement('div');
			friendElement.className = 'flex gap-8';
			if (Friend.status === 'online') {
				friendElement.innerHTML = `
					<div class="flex-shrink-0 h-[72px] w-20 flex flex-col items-center">
						<div class="relative">
							<button id="Friend-button-${Friend.username}" class="group w-12 h-12 rounded-full border-2 border-[#FF2E9F] hover:shadow-[0_0_10px_#FF2E9F] transition-shadow">
								<div class="w-full h-full rounded-full overflow-hidden">
									<img src="${Friend.profilPic}" alt="Friend" class="w-full h-full object-cover">
								</div>
							</button>
							<div id="Friend-Status-${Friend.username}" class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black transform translate-x-[1px] translate-y-[-2px]">
								<div class="w-full h-full bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]"></div>
							</div>
						</div>
						<a href="/users/${Friend.username}" data-link class="text-[#FF2E9F] text-xs whitespace-nowrap font-bold mt-2 hover:underline cursor-pointer">
							${Friend.username}
						</a>
					</div>
				</div>`;
			}
			else { 
				friendElement.innerHTML = `<div class="flex-shrink-0 h-[72px] w-20 flex flex-col items-center">
						<div class="relative">
							<button id="Friend-button-${Friend.username}" class="group w-12 h-12 rounded-full border-2 border-[#FF2E9F] hover:shadow-[0_0_10px_#FF2E9F] transition-shadow">
								<div class="w-full h-full rounded-full overflow-hidden">
									<img src="${Friend.profilPic}" alt="Friend" class="w-full h-full object-cover">
								</div>
							</button>
							<div id="Friend-Status-${Friend.username}" class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black transform translate-x-[1px] translate-y-[-2px]">
								<div class="w-full h-full bg-[#ff0000] rounded-full shadow-[0_0_5px_#ff0000]"></div>
							</div>
						</div>
						<a href="/users/${Friend.username}" data-link class="text-[#FF2E9F] text-xs whitespace-nowrap font-bold mt-2 hover:underline cursor-pointer">
							${Friend.username}
						</a>
					</div>
				</div>`;
			}

			friendslist.appendChild(friendElement);
		});
		
	}
	
	async function fetchFriends(): Promise<Friend[]> {
		const tokenID = sessionStorage.getItem("token");
		if (!tokenID) return [];
		const res = await fetch("/api/getfriends", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tokenID })
		});
		const data = await res.json();
		return data.friends || [];
	}

	const friends: Friend[] = await fetchFriends();
	generateFriendList(friends);

	const friendButtons = document.querySelectorAll('[id^="Friend-button-"]');
	const chatContainers = document.getElementById('chat-containers') as HTMLDivElement;

	friendButtons.forEach(button => {
		button.addEventListener('click', async () => {
			const oldPongBtn = document.getElementById('pong-send');
			if (oldPongBtn)
				oldPongBtn.remove();
			const username = button.id.split('-').pop();
			
			const existingChats = chatContainers.querySelectorAll('[id^="chat-messages-"]');
			existingChats.forEach(chat => chat.remove());
			
			const tokenID = sessionStorage.getItem("token");
			const target = username;
			const friendCheck = await fetch("/api/isfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenID, target })
            });
            const friendStatus = await friendCheck.json();
			if (friendStatus.status === 0) {
				initError("You are not friends with this user.");
				setTimeout(async () => {
					window.location.reload();
				}, 1000);
				return;
			}
			if (friendStatus.status === 2) {
				initError("You have sent a friend request to this user. Please wait for their response.");
				setTimeout(async () => {
					window.location.reload();
				}, 1000);
				return;
			}

			const chatArea = document.createElement('div');
			chatArea.id = `chat-messages-${username}`;
			chatArea.className = 'flex-1 flex flex-col space-y-4';
			chatContainers.appendChild(chatArea);

			chatInfo.innerHTML = `
            <span class="mr-2 text-[#FF2E9F]">⚡</span>
            CHAT://${username}
            <span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>`;


			const checkUser = await fetch(`/api/verifuser`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: sessionStorage.getItem('token')})});
			const info = await checkUser.json();
			

			const original_name = info.original;
			if (friendStatus.status === 3) {
				sendMessage(original_name, "", false, username, true);
			}

			const response = await fetch(`/api/getPrivateMessages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: sessionStorage.getItem('token'), username2: username })});
			const data = await response.json();
			const tab = data.tab;
			for (let i = 0; i < tab.length; i++)
			{
				const message = { ...tab[i], isHistoryMessage: true };
				const isSender = message.username1 === original_name;
				const otherUser = isSender ? message.username2 : message.username1;
				sendMessage(message.username1, message.content, false, otherUser);
			}

			const inputArea = document.getElementById('input-Area') as HTMLDivElement;
			const pongBtn = document.createElement('div');
			pongBtn.id = 'pong-send';
			pongBtn.className = 'w-8 h-8 rounded flex items-center justify-center hover:bg-[#00FFFF]/10';
			pongBtn.innerHTML = '<img src="/images/pong_racquet.png" alt="" class="w-6 h-6">';
			inputArea.appendChild(pongBtn);
			
			pongBtn.addEventListener("click", async () => {
				console.log("pongBtn clicked", original_name, "", true, target);
				sendMessage(original_name, "", true, target);
			});
		});
	});
}