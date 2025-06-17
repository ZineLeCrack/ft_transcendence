import { translate } from '../i18n.js';
import { loadRoutes } from '../main.js';

import initError from '../error.js';
import { getWebSocket } from '../websocket.js';

interface TournamentDataLose_Win {
	winner1: string,
	loser1: string,
	winner2: string,
	loser2: string,
	winner3: string,
	loser3: string,
	winner4: string,
	loser4: string,
	winner1_semifinals: string,
	loser1_semifinals: string,
	winner2_semifinals: string,
	loser2_semifinals: string,
	winner_final: string,
	loser_final: string,
}

interface TournamentData_Players {
	player1: string,
	player2: string,
	player3: string,
	player4: string,
	player5: string,
	player6: string,
	player7: string,
	player8: string,
}

function getcolor(player1: string, player2: string, winner: string, loser: string) {
	
	if (player1 === '?' || player2 === '?') {
		return "border-[#00FFFF] shadow-[0_0_10px_#00FFFF]";
	}

	if (winner === '?' && loser === '?') {
		return "border-[#FFD700] shadow-[0_0_10px_#FFD700]";
	}

	if (player1 === winner) {
		return "border-[#00FF00] shadow-[0_0_10px_#00FF00]";
	}
	
	if (player1 === loser) {
		return "border-[#FF0000] shadow-[0_0_10px_#FF0000]";
	}
	
	else {
		return "border-[#00FFFF] shadow-[0_0_10px_#00FFFF]";
	}
}

export async function generateTournamentView(TournamentData_Players: TournamentData_Players, TournamentData_Lose_Win: TournamentDataLose_Win) 
{
	const container = document.getElementById('tournament-view') as HTMLDivElement;
	const res = await fetch('/api/tournament/turn_into_alias', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...TournamentData_Players, ...TournamentData_Lose_Win })
	});

	const TournamentData = await res.json();
	
	if (container) {
		container.innerHTML = '';
		const bracketTournament = document.createElement('div');
		bracketTournament.className = 'text-[#00FFFF] mb-2 font-mono text-xs';
		bracketTournament.innerHTML =
		`
		<div class="flex justify-between items-center gap-4">
			<div class="flex flex-col gap-3">
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player1, TournamentData.player2, TournamentData.winner1, TournamentData.loser1)} p-1 w-24 text-center rounded-lg ">${TournamentData.player1}</div>
					<div class="absolute h-6 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player2, TournamentData.player1, TournamentData.winner1, TournamentData.loser1)} p-1 w-24 text-center rounded-lg ">${TournamentData.player2}</div>
					<div class="absolute h-6 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
				</div>
				<div class="relative mt-3">
					<div class="border-2 ${getcolor(TournamentData.player3, TournamentData.player4,TournamentData.winner2, TournamentData.loser2)} p-1 w-24 text-center rounded-lg ">${TournamentData.player3}</div>
					<div class="absolute h-6 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player4, TournamentData.player3, TournamentData.winner2, TournamentData.loser2)} p-1 w-24 text-center rounded-lg">${TournamentData.player4}</div>
					<div class="absolute h-6 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
				</div>
			</div>
			<div class="flex flex-col gap-12 relative">
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.winner1, TournamentData.winner2 ,TournamentData.winner1_semifinals , TournamentData.loser1_semifinals)} p-1 w-28 text-center rounded-lg ">${TournamentData.winner1}</div>
					<div class="absolute h-8 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.winner2, TournamentData.winner1 ,TournamentData.winner1_semifinals , TournamentData.loser1_semifinals)} p-1 w-28 text-center rounded-lg ">${TournamentData.winner2}</div>
					<div class="absolute h-8 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
				</div>
				<div class="absolute h-12 w-0 border-r-2 border-[#00FFFF] right-[-12px] top-[50%] -translate-y-1/2"></div>
			</div>
			<div class="flex flex-col items-center mb-14 justify-center relative">
				<div class="border-2 border-[#ad39f0] p-1 w-28 text-center rounded-lg text-[#FFD700] shadow-[0_0_10px_#ad39f0] z-10">🏆 ${TournamentData.winner_final}</div>
				<div class="flex justify-between w-48 relative mt-4">
					<div class="w-px h-8 bg-[#ad39f0]"></div>
					<div class="w-px h-8 bg-[#ad39f0]"></div>
					<div class="absolute left-0 right-0 h-px bg-[#ad39f0]"></div>
					<div class="absolute -top-4 left-1/2 w-px h-4 bg-[#ad39f0] -translate-x-1/2"></div>
				</div>
				<div class="flex items-center gap-32 relative">
					<div class="border-2 ${getcolor(TournamentData.winner1_semifinals, TournamentData.winner2_semifinals ,TournamentData.winner_final , TournamentData.loser_final)} p-1 w-24 text-center rounded-lg text-[#FFD700] z-10">${TournamentData.winner1_semifinals}</div>
					<div class="border-2 ${getcolor(TournamentData.winner2_semifinals, TournamentData.winner1_semifinals ,TournamentData.winner_final , TournamentData.loser_final)} p-1 w-24 text-center rounded-lg text-[#FFD700] z-10">${TournamentData.winner2_semifinals}</div>
				</div>
			</div>
			<div class="flex flex-col gap-12 relative">
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.winner3, TournamentData.winner4 , TournamentData.winner2_semifinals , TournamentData.loser2_semifinals)} p-1 w-28 text-center rounded-lg">${TournamentData.winner3}</div>
					<div class="absolute h-8 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.winner4, TournamentData.winner3, TournamentData.winner2_semifinals , TournamentData.loser2_semifinals)} p-1 w-28 text-center rounded-lg">${TournamentData.winner4}</div>
					<div class="absolute h-8 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
				</div>
				<div class="absolute h-12 w-0 border-l-2 border-[#00FFFF] left-[-12px] top-[50%] -translate-y-1/2"></div>
			</div>
			<div class="flex flex-col gap-3">
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player5, TournamentData.player6 ,TournamentData.winner3 , TournamentData.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData.player5}</div>
					<div class="absolute h-6 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player6, TournamentData.player5 ,TournamentData.winner3 , TournamentData.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData.player6}</div>
					<div class="absolute h-6 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
				</div>
				<div class="relative mt-3">
					<div class="border-2 ${getcolor(TournamentData.player7, TournamentData.player8, TournamentData.winner4 , TournamentData.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData.player7}</div>
					<div class="absolute h-6 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
				</div>
				<div class="relative">
					<div class="border-2 ${getcolor(TournamentData.player8, TournamentData.player7 ,TournamentData.winner4 , TournamentData.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData.player8}</div>
					<div class="absolute h-6 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
				</div>
			</div>
		</div>
		`;
		container.appendChild(bracketTournament);
	}
}

export default async function initInTournament(id: string) {

	const response1 = await fetch('/api/tournament/get_players', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tournamentId: id })
	});

	const TournamentData_Players = await response1.json();

	const response2 = await fetch('/api/tournament/get_winners', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tournamentId: id })
	});

	const TournamentData_Lose_Win = await response2.json();

	const tournamentDefaultView = document.getElementById('default-tournament-view') as HTMLDivElement;

	if (tournamentDefaultView) {
		tournamentDefaultView.classList.add('hidden');
	}

	const createTournamentBtn = document.getElementById('create-tournament') as HTMLButtonElement;
	const joinTournamentBtn = document.getElementById('join-tournament') as HTMLButtonElement;

	joinTournamentBtn.textContent = translate('game_button');
	joinTournamentBtn.classList.remove("border-[#FFD700]", "text-[#FFD700]", "hover:bg-[#FFD700]/20", "shadow-[0_0_10px_#FFD700]");
	joinTournamentBtn.classList.add("border-[#00FFFF]", "text-[#00FFFF]", "hover:bg-[#00FFFF]/20", "shadow-[0_0_10px_#00FFFF]");

	joinTournamentBtn?.addEventListener('click', async () => {
		try {
			const response = await fetch('/api/multi/tournament/join', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: sessionStorage.getItem('token'), tournamentId: id })
			});

			const data = await response.json();

			if (data.err) {
				initError(data.message);
			} else {
				const ws = getWebSocket();
				ws?.send(JSON.stringify({ type: 'multi_player_join', gameId: data.gameId }));

				setTimeout(async () => {
					sessionStorage.setItem("gameId", data.gameId);
					history.pushState(null, '', '/game/multi');
					await loadRoutes('/game/multi');
				}, 100);
			}
		} catch (err) {
			console.error(err);
		}
	});

	const tournamentdiv = document.getElementById('tournament-div') as HTMLDivElement;

	tournamentdiv.classList.remove("justify-between");
	tournamentdiv.classList.add("justify-center", "gap-64");

	createTournamentBtn.classList.add("hidden");

	generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);
}
