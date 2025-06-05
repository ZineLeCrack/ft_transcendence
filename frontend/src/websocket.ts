import { sendMessage } from "./chat/chat.js";
import { generateTournamentView } from "./tournament/in_tournament.js";

// let ws: WebSocket | null = null;

// export function getWebSocket(): WebSocket {
// 	if (!ws) {
// 		ws = new WebSocket(`wss://${window.location.host}/ws/`);
// 		ws.onopen = () => {
// 			console.log("WebSocket connecté !");
// 		};
// 		ws.onerror = (err) => {
// 			console.error("WebSocket erreur:", err);
// 		};
// 	}
// 	return ws;
// }

interface TournamentDataLose_Win {
	winner1: string,
	loser1: string,
	winner2: string,
	loser2: string,
	winner3: string,
	loser3: string,
	winner4: string,
	loser4: string,

	winner1_semifinal: string,
	loser1_semifinal: string,
	winner2_semifinal: string,
	loser2_semifinal: string,

	winner_final: string,
	loser_final: string,
}

const TournamentData_Lose_Win: TournamentDataLose_Win = {
	winner1: `?`,
	loser1: `?`,
	winner2: `?`,
	loser2: `?`,
	winner3: `?`,
	loser3: `?`,
	winner4: `?`,
	loser4: `?`,
	winner1_semifinal: `?`,
	loser1_semifinal: `?`,
	winner2_semifinal: `?`,
	loser2_semifinal: `?`,
	winner_final: `?`,
	loser_final: `?`
};

export const ws = new WebSocket(`wss://${window.location.host}/ws/`);

ws.onopen = () => {
	console.log("WebSocket connecté !");
};

ws.onerror = (err) => {
	console.error("WebSocket erreur:", err);
};

ws.onmessage = async (event) => {
	const data = JSON.parse(event.data);
	if (data.type === 'new_message') {
		if (!data.isHistoryMessage) {
			sendMessage(data.username, data.content);
		}
	}
	else if (data.type === 'tournament_new_player') {
		try {
			const response = await fetch('/api/tournament/get_players', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tournamentId: data.id })
		});
		const TournamentData_Players = await response.json();
		generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);
		} catch (err) {
			console.error('Error gettings players: ', err);
		}
	}
};
