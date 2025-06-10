import { sendMessage } from "./chat/chat.js";
import initError from "./error.js";
import { generateTournamentView } from "./tournament/in_tournament.js";
import { translate } from "./i18n.js";

let ws: WebSocket | null = null;
let original_name: string;

export function initWebSocket(original: string) {
	if (ws) return;
	original_name = original;

	ws = new WebSocket(`wss://${window.location.host}/ws/`);

	ws.onopen = () => {
		fetch('/api/setstatus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenID: sessionStorage.getItem('token'), status: '1' })
		})
		console.log("WebSocket connecté !");
	};

	ws.onerror = (err) => {
		fetch('/api/setstatus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenID: sessionStorage.getItem('token'), status: '0' })
		})
		console.error("WebSocket erreur:", err);
	};

	ws.onclose = () => {
		fetch('/api/setstatus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tokenID: sessionStorage.getItem('token'), status: '0' })
		});
		console.warn("WebSocket déconnecté :");
	};

	ws.onmessage = async (event) => {
		const data = JSON.parse(event.data);
		if (data.type === 'error') {
			initError(data.message);
			return;
		}
		if (data.type !== 'tournament_new_player' && !data.isHistoryMessage) {
			if (data.type === 'new_message') {
				sendMessage(data.username, data.content);
			}
			if (data.type === 'new_private_message') {
				if (data.pongRequest === 1)
				{
					if (data.targetUsername === original_name)
						sendMessage(data.targetUsername , "", true, data.username);
					else
					{
						const messageWrapper = document.getElementById(`chat-messages-${data.targetUsername}`);
						if (messageWrapper)
						{
							const oldmsg = document.getElementById('pong-request-send');
							if (oldmsg)
								oldmsg.remove();
							const msg = document.createElement("div");
							msg.id = 'pong-request-send';
							msg.className = "font-mono text-[#00FFFF] px-4 py-2 my-2 border border-[#0f9292] bg-black/40 rounded-md shadow-[0_0_5px_#0f9292]";
							
							const InvitationText = translate('invitation_to_pong');
							msg.textContent = `${InvitationText} ${data.targetUsername}`;
							messageWrapper.appendChild(msg);
						}
					}
					return;
				}
				const isSender = data.username === original_name;
				const otherUser = isSender ? data.targetUsername : data.username;
				if (data.pongRequest === 2)
				{
					const oldmsg = document.getElementById('pong-request-send');
					if (oldmsg)
						oldmsg.remove();
					await sendMessage(data.targetUsername , "", false, otherUser, false, true);
					const chatContainer = document.getElementById('chat-containers');
					if (chatContainer) {
						chatContainer.scrollTop = chatContainer.scrollHeight;
					}
					return ;
				}
				if (data.pongRequest === 3)
				{
					const oldmsg = document.getElementById('pong-request-send');
					if (oldmsg)
						oldmsg.remove();
					await sendMessage(data.username , "", false, otherUser, false, false, true);
					return ;
				}
				sendMessage(data.username, data.content, false, otherUser);
			}
		} else if (data.type === 'tournament_new_player') {
			console.log('received', data.id);
			try {
				const res = await fetch('/api/tournament/is_in', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token: sessionStorage.getItem('token') })
				});
				const is_in = await res.json();
				if (is_in.tournamentId.toString() === data.id) {
					const response1 = await fetch('/api/tournament/get_players', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ tournamentId: data.id })
					});
					const TournamentData_Players = await response1.json();
					const response2 = await fetch('/api/tournament/get_winners', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ tournamentId: data.id })
					});
					const TournamentData_Lose_Win = await response2.json();
					generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);
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
