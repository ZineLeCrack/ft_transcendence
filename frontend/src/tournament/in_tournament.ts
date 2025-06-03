export default async function  initInTournament(id: string) {

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
		
		if (player1 === '?' || player2 === '?')
		{
			return "border-[#00FFFF] shadow-[0_0_10px_#00FFFF]";
		}

		if (winner === '?' && loser === '?')
		{
			return "border-[#FFD700] shadow-[0_0_10px_#FFD700]";
		}

		if (player1 === winner)
		{
			return "border-[#00FF00] shadow-[0_0_10px_#00FF00]";
		}
		
		if (player1 === loser) {
			return "border-[#FF0000] shadow-[0_0_10px_#FF0000]";
		}
		
		else
		{
			return "border-[#00FFFF] shadow-[0_0_10px_#00FFFF]";
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
				<div class="border-2 ${getcolor(TournamentData_Players.player1, TournamentData_Players.player2, TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} p-1 w-24 text-center rounded-lg ">${TournamentData_Players.player1}</div>
				<div class="absolute h-6 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Players.player2, TournamentData_Players.player1, TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.loser1)} p-1 w-24 text-center rounded-lg ">${TournamentData_Players.player2}</div>
				<div class="absolute h-6 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
			</div>
			
			<div class="relative mt-3">
				<div class="border-2 ${getcolor(TournamentData_Players.player3, TournamentData_Players.player4,TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} p-1 w-24 text-center rounded-lg ">${TournamentData_Players.player3}</div>
				<div class="absolute h-6 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Players.player4, TournamentData_Players.player3, TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.loser2)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player4}</div>
				<div class="absolute h-6 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
			</div>
		</div>
	
		<div class="flex flex-col gap-12 relative">
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner1, TournamentData_Lose_Win.winner2 ,TournamentData_Lose_Win.winner1_semifinal , TournamentData_Lose_Win.loser1_semifinal)} p-1 w-28 text-center rounded-lg ">${TournamentData_Lose_Win.winner1}</div>
				<div class="absolute h-8 w-3 border-r-2 border-t-2 border-[#00FFFF] right-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner2, TournamentData_Lose_Win.winner1 ,TournamentData_Lose_Win.winner1_semifinal , TournamentData_Lose_Win.loser1_semifinal)} p-1 w-28 text-center rounded-lg ">${TournamentData_Lose_Win.winner2}</div>
				<div class="absolute h-8 w-3 border-r-2 border-b-2 border-[#00FFFF] right-[-12px] top-[-50%]"></div>
			</div>
			<div class="absolute h-12 w-0 border-r-2 border-[#00FFFF] right-[-12px] top-[50%] -translate-y-1/2"></div>
		</div>
	
		<div class="flex flex-col items-center mb-14 justify-center relative">
				<div class="border-2 border-[#ad39f0] p-1 w-28 text-center rounded-lg text-[#FFD700] shadow-[0_0_10px_#ad39f0] z-10">
			🏆 ${TournamentData_Lose_Win.winner_final}
		</div>

		<div class="flex justify-between w-48 relative mt-4">
			<div class="w-px h-8 bg-[#ad39f0]"></div>
			<div class="w-px h-8 bg-[#ad39f0]"></div>
			<div class="absolute left-0 right-0 h-px bg-[#ad39f0]"></div>
			<div class="absolute -top-4 left-1/2 w-px h-4 bg-[#ad39f0] -translate-x-1/2"></div>
		</div>
	
		<div class="flex items-center gap-32 relative">
			<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner1_semifinal, TournamentData_Lose_Win.winner2_semifinal ,TournamentData_Lose_Win.winner_final , TournamentData_Lose_Win.loser_final)} p-1 w-24 text-center rounded-lg text-[#FFD700] z-10">
				 ${TournamentData_Lose_Win.winner1_semifinal}
			</div>
	
			<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner2_semifinal, TournamentData_Lose_Win.winner1_semifinal ,TournamentData_Lose_Win.winner_final , TournamentData_Lose_Win.loser_final)} p-1 w-24 text-center rounded-lg text-[#FFD700] z-10">
				 ${TournamentData_Lose_Win.winner2_semifinal}
			</div>
		</div>
	</div>
			

		<div class="flex flex-col gap-12 relative">
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner3}</div>
				<div class="absolute h-8 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Lose_Win.winner4, TournamentData_Lose_Win.winner3, TournamentData_Lose_Win.winner2_semifinal , TournamentData_Lose_Win.loser2_semifinal)} p-1 w-28 text-center rounded-lg">${TournamentData_Lose_Win.winner4}</div>
				<div class="absolute h-8 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
			</div>
			<div class="absolute h-12 w-0 border-l-2 border-[#00FFFF] left-[-12px] top-[50%] -translate-y-1/2"></div>
		</div>
	
		<div class="flex flex-col gap-3">
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Players.player5, TournamentData_Players.player6 ,TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player5}</div>
				<div class="absolute h-6 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Players.player6, TournamentData_Players.player5 ,TournamentData_Lose_Win.winner3 , TournamentData_Lose_Win.loser3)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player6}</div>
				<div class="absolute h-6 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
			</div>
			
			<div class="relative mt-3">
				<div class="border-2 ${getcolor(TournamentData_Players.player7, TournamentData_Players.player8, TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player7}</div>
				<div class="absolute h-6 w-3 border-l-2 border-t-2 border-[#00FFFF] left-[-12px] top-[50%]"></div>
			</div>
			<div class="relative">
				<div class="border-2 ${getcolor(TournamentData_Players.player8, TournamentData_Players.player7 ,TournamentData_Lose_Win.winner4 , TournamentData_Lose_Win.loser4)} p-1 w-24 text-center rounded-lg">${TournamentData_Players.player8}</div>
				<div class="absolute h-6 w-3 border-l-2 border-b-2 border-[#00FFFF] left-[-12px] top-[-50%]"></div>
			</div>
		</div>
	</div>
	</div>`;

			container.appendChild(bracketTournament);
	}
	}


	const TournamentData_Players: TournamentData_Players = {
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
	winner1: `${TournamentData_Players.player1}`,
	loser1: `${TournamentData_Players.player2}`,
	winner2: `${TournamentData_Players.player4}`,
	loser2: `${TournamentData_Players.player3}`,
	winner3: "?",
	loser3: "?",
	winner4: `${TournamentData_Players.player7}`,
	loser4: `${TournamentData_Players.player8}`,
	winner1_semifinal: `${TournamentData_Players.player1}`,
	loser1_semifinal: `${TournamentData_Players.player4}`,
	winner2_semifinal: `?`,
	loser2_semifinal: `?`,
	winner_final: `?`,
	loser_final: `?`
};
	const tournamentDefaultView = document.getElementById('default-tournament-view') as HTMLDivElement;
	if (tournamentDefaultView)
	{
		tournamentDefaultView.classList.add('hidden');
	}


	const createTournamentBtn = document.getElementById('create-tournament') as HTMLButtonElement;
	const joinTournamentBtn = document.getElementById('join-tournament') as HTMLButtonElement;

	joinTournamentBtn.textContent = 'Play';
	joinTournamentBtn.classList.remove("border-[#FFD700]", "text-[#FFD700]", "hover:bg-[#FFD700]/20",  "shadow-[0_0_10px_#FFD700]");
	joinTournamentBtn.classList.add("border-[#00FFFF]", "text-[#00FFFF]", "hover:bg-[#00FFFF]/20",  "shadow-[0_0_10px_#00FFFF]");
	

	createTournamentBtn.textContent = 'Resign';
	createTournamentBtn.classList.remove("border-[#FFD700]", "text-[#FFD700]", "hover:bg-[#FFD700]/20",  "shadow-[0_0_10px_#FFD700]");
	createTournamentBtn.classList.add("border-[#FF0000]", "text-[#FF0000]", "hover:bg-[#FF0000]/20",  "shadow-[0_0_10px_#FF0000]");

	// ou si pas envie de coder le bouton Resign 
	//createTournamentBtn.classList.add("hidden");

	generateTournamentView(TournamentData_Players, TournamentData_Lose_Win);


	// try {
	// 	const response = await fetch('/api/tournament/load/player', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify({id: id})
	// 	});

	// 	if (!response.ok) {
	// 		throw new Error('Failed to create tournament');
	// 	}
		

	// } catch (error) {
	// 	console.error('Error creating tournament:', error);
	// 	alert('Failed to create tournament');
	// }

	//je pense faut faire deux fetch un pour les joueurs qui rentre donc pour l'interface TournamentData_Players et un autre pour les gagnants et perdants donc TournamentData_Lose_Win,
	//apres peut mettre un websocket car si ont fait avec des fetch on devra fetch a chaque fois qu'il y a un changement dans le tournoi, donc pas tres efficace

	// tu as l'idee du tournoi qui doit etre affiche si jamais 

}
