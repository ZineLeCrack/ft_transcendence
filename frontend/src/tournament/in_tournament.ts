export default function initInTournament() {

	interface TournamentDataLose_Win {
		id: string,
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

	interface TournamentData_Players {
		id: string,
		player1: string,
		player2: string,
		player3: string,
		player4: string,
		player5: string,
		player6: string,
		player7: string,
		player8: string,
	}

	function getBorderClass(player: string, winner: string, loser: string) {
		if (winner === '?' && loser === '?')
		{
			return "border-[#FFD700]";
		}
		if (player === winner)
		{
			return "border-[#00FF00]";
		}
		else if (player === loser) {
			return "border-[#FF0000]";
		}
		else
		{
			return "border-[#00FFFF]";
		}
	}

	function generateTournamentView(TournamentData_Players: TournamentData_Players, TournamentData_Lose_Win: TournamentDataLose_Win) 
	{
		const container = document.getElementById('tournament-view') as HTMLDivElement;
		
		if (container)
		{
			const bracketTournament = document.createElement('div');
			bracketTournament.className = 'text-[#00FFFF] mb-2 font-mono text-xs';
			bracketTournament.innerHTML = `<div class="flex justify-between items-center gap-4">
		<div class="flex flex-col gap-3">
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player1,TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player1}</div>
				<div class="absolute h-6 w-3 border-r-2 border-t-2 ${getBorderClass(TournamentData_Players.player1,TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player2,TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player2}</div>
				<div class="absolute h-6 w-3 border-r-2 border-b-2 ${getBorderClass(TournamentData_Players.player2,TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} right-[-12px] top-[-50%]"></div>
			</div>
			
			<div class="relative mt-3">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player3,TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player3}</div>
				<div class="absolute h-6 w-3 border-r-2 border-t-2 ${getBorderClass(TournamentData_Players.player3,TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player4,TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player4}</div>
				<div class="absolute h-6 w-3 border-r-2 border-b-2 ${getBorderClass(TournamentData_Players.player4,TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} right-[-12px] top-[-50%]"></div>
			</div>
		</div>
	
		<div class="flex flex-col gap-12 relative">
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.winner1_semifinal , TournamentData_Lose_Win.loser1_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner1}</div>
				<div class="absolute h-8 w-3 border-r-2 border-t-2 ${getBorderClass(TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.winner1_semifinal , TournamentData_Lose_Win.loser1_semifinal)} right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.winner1_semifinal , TournamentData_Lose_Win.loser1_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner2}</div>
				<div class="absolute h-8 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
			</div>
			<div class="absolute h-12 w-0 border-r-2 border-[#00FFFF] right-[-12px] top-[50%] -translate-y-1/2"></div>
		</div>
	
		<div class="flex flex-col items-center mb-14 justify-center relative">
				<div class="border-2 border-[#ad39f0] p-1 w-28 text-center rounded-lg text-[#FFD700] shadow-[0_0_10px_#ad39f0] z-10">
			🏆 ${TournamentData_Lose_Win.winner_final}
		</div>

		<div class="flex justify-between w-48 relative mt-4">
			<div class="w-px h-8 bg-[#FF2E9F]"></div>
			<div class="w-px h-8 bg-[#FF2E9F]"></div>
			<div class="absolute left-0 right-0 h-px bg-[#FF2E9F]"></div>
			<div class="absolute -top-4 left-1/2 w-px h-4 bg-[#FF2E9F] -translate-x-1/2"></div>
		</div>
	
		<div class="flex items-center gap-32 relative">
			<div class="border-2 border-[#FF2E9F] p-1 w-24 text-center rounded-lg text-[#FFD700] shadow-[0_0_10px_#FF2E9F] z-10">
				 ${TournamentData_Lose_Win.winner1_semifinal}
			</div>
	
			<div class="border-2 border-[#FF2E9F] p-1 w-24 text-center rounded-lg text-[#FFD700] shadow-[0_0_10px_#FF2E9F] z-10">
				 ${TournamentData_Lose_Win.winner2_semifinal}
			</div>
		</div>
	</div>
			

		<div class="flex flex-col gap-12 relative">
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner3}</div>
				<div class="absolute h-8 w-3 border-l-2 border-t-2 ${getBorderClass(TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner4}</div>
				<div class="absolute h-8 w-3 border-l-2 border-b-2 ${getBorderClass(TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} left-[-12px] top-[-50%]"></div>
			</div>
			<div class="absolute h-12 w-0 border-l-2 border-[#00FFFF] left-[-12px] top-[50%] -translate-y-1/2"></div>
		</div>
	
		<div class="flex flex-col gap-3">
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player5, TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player5}</div>
				<div class="absolute h-6 w-3 border-l-2 border-t-2 ${getBorderClass(TournamentData_Players.player5, TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player6, TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player6}</div>
				<div class="absolute h-6 w-3 border-l-2 border-b-2 ${getBorderClass(TournamentData_Players.player6, TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} left-[-12px] top-[-50%]"></div>
			</div>
			
			<div class="relative mt-3">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player7, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player7}</div>
				<div class="absolute h-6 w-3 border-l-2 border-t-2 ${getBorderClass(TournamentData_Players.player7, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getBorderClass(TournamentData_Players.player8, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player8}</div>
				<div class="absolute h-6 w-3 border-l-2 border-b-2 ${getBorderClass(TournamentData_Players.player8, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} left-[-12px] top-[-50%]"></div>
			</div>
		</div>
	</div>
	</div>`;

			container.appendChild(bracketTournament);
	}
	}


	const TournamentData_Players: TournamentData_Players = {
		id: "tournament123",
		player1: "aderiche",
		player2: "ebroudic",
		player3: "lpatin",
		player4: "rlebaill",
		player5: "cle-berr",
		player6: "bfiquet",
		player7: "lgrippon",
		player8: "lelanglo"
	};

const TournamentData_Lose_Win: TournamentDataLose_Win = {
	id: "tournament123",
	winner1: "dwaaoihjdwaioudhwi",
	loser1: "ebroudic",
	winner2: "lpatin",
	loser2: "rlebaill",
	winner3: "?",
	loser3: "?",
	winner4: "lgrippon",
	loser4: "lelanglo",
	winner1_semifinal: "aderiche",
	loser1_semifinal: "ebroudic",
	winner2_semifinal: "lpatin",
	loser2_semifinal: "rlebaill",
	winner_final: "dwaaoihjdwaioudhwi",
	loser_final: "lpatin"
};



	generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);
}
