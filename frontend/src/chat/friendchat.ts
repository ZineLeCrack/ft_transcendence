import initError from '../error.ts';
import { sendMessage } from './chat.ts';
import { getWebSocket } from '../websocket.ts';
import { translate } from '../i18n.ts';
import { loadProfilePicture } from '../profile/editinfo.ts';

export function initSwitchChat()
{
	const switchChatBtn = document.getElementById('switch-chat') as HTMLButtonElement;
	const friendslist = document.getElementById('friends-list') as HTMLDivElement;

	switchChatBtn.addEventListener('click', async () => {
		if (document.getElementById('chat-messages-global')) {
			const privateChats = document.querySelectorAll('[id^="chat-messages-"]');
			privateChats.forEach(chat => chat.remove());

			const globalChat = document.getElementById('chat-messages-global') as HTMLDivElement;
			if (globalChat) {
				globalChat.remove();
			}

			const tooltipSwitchGlobal = translate('switch_to_global');
			const ChatTitle = translate('chat_global')
			switchChatBtn.innerHTML =`
			<span data-i18n="chat_global">${ChatTitle}</span>
			<div id="tooltip-switch-chat" data-i18n="switch_to_global" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[#FF2E9F] text-xs px-2 py-1 rounded 
				opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap 
				border border-[#FF2E9F] pointer-events-none">
				${tooltipSwitchGlobal}
			</div>`;

			const chatInfo = document.getElementById('chat-info') as HTMLDivElement;

			const ChatInfoTitle = translate('chat_friends');
			chatInfo.innerHTML = `
				<span class="mr-2 text-[#FF2E9F]">⚡</span>
			   	<span data-i18n="chat_friends">${ChatInfoTitle}</span>
				<span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>`;
			friendslist.classList.remove("hidden");
			friendslist.classList.add("flex");
			
		} else {
			const chatContainers = document.getElementById('chat-containers') as HTMLDivElement;
			const privateChats = document.querySelectorAll('[id^="chat-messages-"]');
			privateChats.forEach(chat => chat.remove());

			const globalChat = document.createElement('div');
			globalChat.id = 'chat-messages-global';
			globalChat.className = 'flex flex-col space-y-4';
			chatContainers.appendChild(globalChat);

			const tooltipSwitchFriends = translate('switch_to_friends');
			const ChatTitle = translate('chat_friends')
			switchChatBtn.innerHTML =`
				<span data-i18n="chat_friends">${ChatTitle}</span>
				<div id="tooltip-switch-chat" data-i18n="switch_to_friends" class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[#FF2E9F] text-xs px-2 py-1 rounded 
					opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap 
					border border-[#FF2E9F] pointer-events-none">
					${tooltipSwitchFriends}
				</div>`;

			const chatInfo = document.getElementById('chat-info') as HTMLDivElement;

			const ChatInfoTitle = translate('chat_global');
			chatInfo.innerHTML = `
			<span class="mr-2 text-[#FF2E9F]">⚡</span>
			<span data-i18n="chat_global">${ChatInfoTitle}</span>
			<span class="ml-2 animate-pulse text-[#FF2E9F]">_</span>`
			friendslist.classList.remove("flex");
			friendslist.classList.add("hidden");

			const response = await fetch(`/api/getmessages`, {method: 'POST',});
			const data = await response.json();
			const tab = data.tab;
			for (let i = 0; i < tab.length; i++) {
				const message = { ...tab[i], isHistoryMessage: true };
				await sendMessage(message.username, message.content);
			}
		}
	});
}

export default async function initFriendChat() {
	const chatInfo = document.getElementById('chat-info') as HTMLDivElement;
	const friendslist = document.getElementById('friends-list') as HTMLDivElement;

	interface Friend {
		username: string;
		profilPic: string;
		status: 1 | 0; // 1 = online, 0 = offline
	}

	function generateFriendList(Friend: Friend[]) {
		friendslist.innerHTML = '';
		if (Friend.length === 0) {
			const noFriendsText = translate('no_friends');
			friendslist.innerHTML = `<p class="text-[#FF2E9F]">${noFriendsText}</p>`;
			return ;
		}
		Friend.forEach(Friend => {
			const friendElement = document.createElement('div');
			friendElement.className = 'flex gap-8';

			if (Friend.status === 1) {
				friendElement.innerHTML = `
					<div class="flex-shrink-0 h-[72px] w-20 flex flex-col items-center">
						<div class="relative">
							<button id="Friend-button-${Friend.username}" class="group w-12 h-12 rounded-full border-2 border-[#FF2E9F] hover:shadow-[0_0_10px_#FF2E9F] transition-shadow">
								<div id="profile-pic-friend-online-${Friend.username}" class="w-full h-full rounded-full overflow-hidden"></div>
							</button>
							<div id="Friend-Status-${Friend.username}" class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black transform translate-x-[1px] translate-y-[-2px]">
								<div class="w-full h-full bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]"></div>
							</div>
						</div>
						<a href="/users/${Friend.username}" data-link class="text-[#FF2E9F] text-xs whitespace-nowrap font-bold mt-2 hover:underline cursor-pointer">
							${Friend.username}
						</a>
					</div>`;
					loadProfilePicture(`profile-pic-friend-online-${Friend.username}`, Friend.username);
			} else { 
				friendElement.innerHTML = `<div class="flex-shrink-0 h-[72px] w-20 flex flex-col items-center">
						<div class="relative">
							<button id="Friend-button-${Friend.username}" class="group w-12 h-12 rounded-full border-2 border-[#FF2E9F] hover:shadow-[0_0_10px_#FF2E9F] transition-shadow">
								<div id="profile-pic-friend-offline-${Friend.username}" class="w-full h-full rounded-full overflow-hidden"></div>
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
				loadProfilePicture(`profile-pic-friend-offline-${Friend.username}`, Friend.username);
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
			
			const existingChats = document.querySelectorAll('[id^="chat-messages-"]');
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
				initError(translate("not_friend"));
				setTimeout(async () => {
					window.location.reload();
				}, 1000);
				return ;
			}
			if (friendStatus.status === 2) {
				initError(translate("already_send"));
				setTimeout(async () => {
					window.location.reload();
				}, 1000);
				return ;
			}

			const chatArea = document.createElement('div');
			chatArea.id = `chat-messages-${username}`;
			chatArea.className = 'flex-1 flex flex-col space-y-4';
			chatContainers.appendChild(chatArea);
			const chatTranslate = translate('chat')
			chatInfo.innerHTML = `
			<span class="mr-2 text-[#FF2E9F]">⚡</span>
			${chatTranslate}://${username}
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
			for (let i = 0; i < tab.length; i++) {
				const message = { ...tab[i], isHistoryMessage: true };
				const isSender = message.username1 === original_name;
				const otherUser = isSender ? message.username2 : message.username1;
				if (message.pongRequest === 1) {
					if (message.username2 === original_name)
						await sendMessage(message.username2 , "", true, message.username1);
					else {
						const messageWrapper = document.getElementById(`chat-messages-${message.username2}`);
						if (messageWrapper) {
							const oldmsg = document.getElementById('pong-request-send');
							if (oldmsg)
								oldmsg.remove();
							const msg = document.createElement("div");
							msg.id = 'pong-request-send';
							msg.className = "font-mono text-[#00FFFF] px-4 py-2 my-2 border border-[#0f9292] bg-black/40 rounded-md shadow-[0_0_5px_#0f9292]";
							const InvitationText = translate('invitation_to_pong');
							msg.textContent = `${InvitationText} ${message.username2}`;
							messageWrapper.appendChild(msg);
						}
					}
				} else if (message.pongRequest === 2) {
					await sendMessage(message.username1 , "", false, otherUser, false, true);
				} else if (message.pongRequest === 3) {
					const oldmsg = document.getElementById('pong-request-send');
					if (oldmsg)
						oldmsg.remove();
					await sendMessage(message.username1 , "", false, otherUser, false, false, true);
				} else {
					await sendMessage(message.username1, message.content, false, otherUser);
				}
			}

			const inputArea = document.getElementById('input-Area') as HTMLDivElement;
			const pongBtn = document.createElement('div');
			pongBtn.id = 'pong-send';
			pongBtn.className = 'w-8 h-8 rounded flex items-center justify-center hover:bg-[#00FFFF]/10';
			pongBtn.innerHTML = '<img src="/images/pong_racquet.png" alt="" class="w-6 h-6">';
			inputArea.appendChild(pongBtn);

			const ws = getWebSocket();
			pongBtn.addEventListener("click", async () => {
				let chatdata;
				const BoxTarget = document.querySelector('[id^="chat-messages-"]');
				const targetUsername = BoxTarget?.id.split('-').pop();
				const token = sessionStorage.getItem('token');

				chatdata = { type: 'new_private_message', token, content: "" , targetUsername, pongRequest: 1};
				ws?.send(JSON.stringify(chatdata));
			});
		});
	});
}
