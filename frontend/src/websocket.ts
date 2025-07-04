import { sendMessage } from "./chat/chat.js";
import initError from "./error.js";
import { generateTournamentView } from "./tournament/in_tournament.js";
import { translate } from "./i18n.js";
import initFriendChat from "./chat/friendchat.js";
import initJoinTournament from "./tournament/join_tournament.js";
import initUsers from "./search/users.js";
import initCreateTournament from "./tournament/create_tournament.js";
import initSuccess from "./success.js";

let ws: WebSocket | null = null;
let original_name: string;
let userId = '';

export function initWebSocket(original: string) {
	if (ws) return ;
	original_name = original;

	ws = new WebSocket(`wss://${window.location.host}/ws/`);

	ws.onopen = () => {
		try {
			fetch('/api/setstatus', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: '1' })
			});
		} catch (err) {
			console.error('Error setting connected status:', err);
		}
	};

	ws.onerror = (err) => {
		try {
			fetch('/api/setstatus', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: '0' })
			});
		} catch (err) {
			console.error('Error setting disconnected status:', err);
		}
		console.error("WebSocket error:", err);
	};

	ws.onclose = () => {
		try {
			fetch('/api/setstatus', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: '0' }),
				credentials: 'include',
			});
		} catch (err) {
			console.error('Error setting disconnected status:', err);
		}
	};

	ws.onmessage = async (event) => {
		const data = JSON.parse(event.data);

		if (data.type === 'error') {
			initError(translate(data.message));
			return ;
		}
		if (data.type === 'tournament_end') {
			try {
				await sendMessage(data.winner, "", false, 'global', false, false, false, false, true);
				const text1 = translate('has_won_the_tournament');
				const text = `${data.winner} ${text1}`;
				initSuccess(text);
				const res = await fetch('/api/tournament/is_in', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ })
				});
				const is_in = await res.json();
				if (is_in.tournamentId.toString() === '0') {
					const playBtn = document.getElementById('play-tournament');
					const joinBtn = document.getElementById('join-tournament');
					const createBtn = document.getElementById('create-tournament');
					const container = document.getElementById('tournament-view');
					const tournamentdiv = document.getElementById('tournament-div');

					if (tournamentdiv) {
						tournamentdiv.classList.remove("justify-center", "gap-64");
						tournamentdiv.classList.add("justify-between");
					}
					if (playBtn) playBtn.classList.add('hidden');
					if (joinBtn) joinBtn.classList.remove('hidden');
					if (createBtn) createBtn.classList.remove('hidden');

					if (container) container.innerHTML = `
					<div id="default-tournament-view" class="flex flex-col items-center gap-4">
						<img src="/images/pong_racquet.png" alt="pong racquet" class="w-16 h-16 mb-2" />
						<p class="text-[#00FFFF]/90 text-xl font-bold text-center" data-i18n="no_tournament">${translate('no_tournament')}</p>
						<p class="text-[#00FFFF]/80 text-sm" data-i18n="create_or_join">${translate('create_or_join')}</p>
					</div>`;

					initCreateTournament();
					initJoinTournament();

					try {
						await initJoinTournament();
					} catch (err) {
						console.error(`Error loading tournaments list:`, err);
					}
				}
			} catch (err) {
				console.error('Error searching informations:', err);
			}
		}

		if (data.type === 'multi_player_join') {
			if (sessionStorage.getItem('gameId') === data.gameId) {
				const h1player1 = document.getElementById('name-player1') as HTMLHeadingElement;
				const h1player2 = document.getElementById('name-player2') as HTMLHeadingElement;

				try {
					const getname = await fetch(`/api/multi/game/${data.gameId}/getname`, { method: 'POST'});
					const name = await getname.json();
					if (!name.player2 || !name.player1) {
						initError(translate('failed_id'));
						return ;
					}
					h1player1.textContent = name.player1.name && name.player1.name !== '' ? `${name.player1.name}` : translate('player_1_trad');
					h1player2.textContent = name.player2.name && name.player2.name !== '' ? `${name.player2.name}` : translate('player_2_trad');
				} catch (err) {
					initError(translate('failed_id'));
					return ;
				}
			}
		}

		if (data.type === "add_friend" || data.type === 'remove_friend' || data.type === 'block_users' || data.type === 'unblock_users' || data.type === 'accept_friend' || data.type === 'decline_friend')
		{
			if (window.location.pathname === '/home')
			{
				initFriendChat();
			}
			else if (window.location.pathname === `/users/${data.username}` || window.location.pathname === `/users/${data.username}/history`)
			{
				initUsers(data.username);
			}
			else if (window.location.pathname === `/users/${data.targetUsername}` || window.location.pathname === `/users/${data.targetUsername}/history`)
			{
				initUsers(data.targetUsername);
			}
		}

		if ((data.type === 'new_message' || data.type === 'new_private_message') && !data.isHistoryMessage) {
			if (data.type === 'new_message') {
				sendMessage(data.username, data.content);
			}
			if (data.type === 'new_private_message') {
				if (data.pongRequest === 1) {
					if (data.targetUsername === original_name) {
						sendMessage(data.targetUsername , "", true, data.username);
					} else {
						const messageWrapper = document.getElementById(`chat-messages-${data.targetUsername}`);
						if (messageWrapper) {
							const oldmsg = document.getElementById('pong-request-send');
							if (oldmsg) oldmsg.remove();
							const msg = document.createElement("div");
							msg.id = 'pong-request-send';
							msg.className = "font-mono text-[#00FFFF] px-4 py-2 my-2 border border-[#0f9292] bg-black/40 rounded-md shadow-[0_0_5px_#0f9292]";

							const InvitationText = translate('invitation_to_pong');
							msg.textContent = `${InvitationText} ${data.targetUsername}`;
							messageWrapper.appendChild(msg);
						}
					}
					return ;
				}

				const isSender = data.username === original_name;
				const otherUser = isSender ? data.targetUsername : data.username;
				if (data.pongRequest === 2) {
					const oldmsg = document.getElementById('pong-request-send');
					if (oldmsg) oldmsg.remove();
					await sendMessage(data.targetUsername , "", false, otherUser, false, true);
					const chatContainer = document.getElementById('chat-containers');
					if (chatContainer) {
						chatContainer.scrollTop = chatContainer.scrollHeight;
					}
					return ;
				}
				if (data.pongRequest === 3) {
					const oldmsg = document.getElementById('pong-request-send');
					if (oldmsg) oldmsg.remove();
					await sendMessage(data.username , "", false, otherUser, false, false, true);
					return ;
				}
				sendMessage(data.username, data.content, false, otherUser);
			}
		}
		if (data.type === 'tournament_created') {
			try {
				const res = await fetch('/api/tournament/is_in', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ }),
					credentials: 'include',
				});
				const is_in = await res.json();
				if (is_in.tournamentId.toString() === '0') {
					try {
						initJoinTournament();
					} catch (err) {
						console.error(`Error loading tournaments list: `, err);
					}
				}
			} catch (err) {
				console.error('Error searching informations:', err);
			}
		}
		if (data.type === 'tournament_new_player' || data.type === 'tournament_next_game') {
			try {
				const res = await fetch('/api/tournament/is_in', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ }),
					credentials: 'include',
				});
				const is_in = await res.json();
				if (is_in.tournamentId.toString() === data.id) {
					const response1 = await fetch('/api/tournament/get_players', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ tournamentId: data.id })
					});
					userId = is_in.userId;
					const TournamentData_Players = await response1.json();
					const response2 = await fetch('/api/tournament/get_winners', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ tournamentId: data.id })
					});
					const TournamentData_Lose_Win = await response2.json();
					generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);
				} else if (is_in.tournamentId.toString() === '0') {
					try {
						initJoinTournament();
					} catch (err) {
						console.error(`Error loading tournaments list: `, err);
					}
				}
			} catch (err) {
				console.error('Error getting players:', err);
			}
		}
		if (data.type === 'tournament_next_game') {
			if (userId.toString() === data.next_player1.toString() || userId.toString() === data.next_player2.toString()) {
				sendMessage('', '', false, 'global', false, false, false, true);
			}
			try {
				const res = await fetch('/api/tournament/is_in', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ })
				});
				const is_in = await res.json();
				if (is_in.tournamentId.toString() === data.id) {
					const text1 = translate('tournament_announce1');
					const and = translate('and');
					const text2 = translate('tournament_announce2');
					const text = `${text1} ${data.next_player1_name} ${and} ${data.next_player2_name} ${text2}`;
					initSuccess(text);
				}
			} catch (err) {
				console.error('Error getting players:', err);
			}
		}
	};

	window.addEventListener('beforeunload', () => {
		if (ws) {
			ws.close();
			ws = null;
		}
	});
}

export function getWebSocket(): WebSocket | null {
	return ws;
}
