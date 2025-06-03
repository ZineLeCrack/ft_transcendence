export default async function initFriendChat() {
	const switchChatBtn = document.getElementById('switch-chat') as HTMLButtonElement;
	const chatInfo = document.getElementById('chat-info') as HTMLDivElement;
	const friendslist = document.getElementById('friends-list') as HTMLDivElement;
	const friendRequestsCount = document.getElementById('friend-requests-count') as HTMLDivElement;
	
	switchChatBtn.addEventListener('click', () => {
		if (switchChatBtn.textContent?.includes("friends"))
		{
			const privateChats = chatContainers.querySelectorAll('[id^="chat-messages-"]');
			privateChats.forEach(chat => {
				if (chat.id !== 'chat-messages-global') {
					(chat as HTMLElement).style.display = 'none';
				}
			});

			const globalChat = document.getElementById('chat-messages-global') as HTMLDivElement;
			if (globalChat) {
				globalChat.style.display = 'none';
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
			privateChats.forEach(chat => {
				if (chat.id !== 'chat-messages-global') {
					(chat as HTMLElement).style.display = 'none';
				}
			});

			const globalChat = document.getElementById('chat-messages-global') as HTMLDivElement;
			if (globalChat) {
				globalChat.style.display = 'flex';
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
		}
	});


	function updateFriendRequestsCount(count: number) { // fonction a utiliser pour les notifications de demandes d'amis
		if (count > 0) {
			friendRequestsCount.textContent = count.toString();
			friendRequestsCount.classList.remove("hidden");
		} else {
			friendRequestsCount.classList.add("hidden");
		}
	}


	interface Friend {
		username: string;
		profilPic: string;
		status: 'online' | 'offline';
	}
	
	function generateFriendList(Friend: Friend[]) {
		friendslist.innerHTML = ''; // Clear the current list
		if (Friend.length === 0) {
			friendslist.innerHTML = '<p class="text-[#FF2E9F]">No friends online</p>';
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
			} // le status faut faire un websocket pour le mettre a jour en temps reel
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
	
	const friends: Friend[] = [
		{ 
			username: 'Lelanglo',
			profilPic: '/images/stickman_default.png',
			status: 'online' 
		},
		{ 
			username: 'ebroudic',
			profilPic: '/images/stickman_default.png',
			status: 'offline' 
		},
		{ 
			username: 'rlebaill',
			profilPic: '/images/pdp_rlebaill.jpeg',
			status: 'online' 
		},
		{ 
			username: 'bfiquet',
			profilPic: '/images/stickman_default.png',
			status: 'offline' 
		},
	]

	generateFriendList(friends);

	const friendButtons = document.querySelectorAll('[id^="Friend-button-"]');
	const chatContainers = document.getElementById('chat-containers') as HTMLDivElement;

	friendButtons.forEach(button => {
		button.addEventListener('click', () => {
			const username = button.id.split('-').pop();
			console.log(`Clicked on friend: ${button.id} (${username})`);
			
			const existingChats = chatContainers.querySelectorAll('[id^="chat-messages-"]');
			existingChats.forEach(chat => {
				(chat as HTMLElement).style.display = 'none';
			});
			
			const chatArea = document.getElementById(`chat-messages-${username}`) as HTMLDivElement;
			if (!chatArea) 
			{
				const chatArea = document.createElement('div');
				chatArea.id = `chat-messages-${username}`;
				chatArea.className = 'flex-1 flex flex-col space-y-4';
				chatContainers.appendChild(chatArea);
			}
			chatArea.style.display = 'flex';
			chatInfo.innerHTML = `
            <span class="mr-2 text-[#FF2E9F]">⚡</span>
            CHAT://${username}
            <span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>
        `;
		});
	});
}