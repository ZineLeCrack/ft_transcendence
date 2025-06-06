import { sendMessage } from "./chat/chat.js";
import { generateTournamentView } from "./tournament/in_tournament.js";

let ws: WebSocket | null = null;
let original_name: string;

export function initWebSocket(original: string) {
	if (ws) return;
	original_name = original;

	ws = new WebSocket(`wss://${window.location.host}/ws/`);

	ws.onopen = () => {
		console.log("WebSocket connecté !");
	};

	ws.onerror = (err) => {
		console.error("WebSocket erreur:", err);
	};

	ws.onmessage = async (event) => {
		const data = JSON.parse(event.data);
		if (data.type !== 'tournament_new_player' && !data.isHistoryMessage) {
			if (data.type === 'new_message') {
				sendMessage(data.username, data.content);
			}
			if (data.type === 'new_private_message') {
				if (data.pongRequest === 1)
				{
					if (data.targetUsername === original_name)
						sendMessage(data.targetUsername , "", true, data.username);
					return;
				}
				const isSender = data.username === original_name;
				const otherUser = isSender ? data.targetUsername : data.username;
				sendMessage(data.username, data.content, false, otherUser);
			}
		} else if (data.type === 'tournament_new_player') {
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
}

export function getWebSocket(): WebSocket | null {
	return ws;
}
