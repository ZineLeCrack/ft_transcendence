import { togglePassword } from "../profile/utils";

export default async function initJoinTournament() {

	const joinTournamentBtn = document.getElementById('join-tournament');
	const backToTournamentBtn = document.getElementById('back-to-tournament-join');
	const mainView = document.getElementById('tournament-main-view');
	const joinView = document.getElementById('tournament-join-view');
	
	joinTournamentBtn?.addEventListener('click', () => {
		mainView?.classList.add('hidden');
		joinView?.classList.remove('hidden');
	});
	
	backToTournamentBtn?.addEventListener('click', () => {
		joinView?.classList.add('hidden');
		mainView?.classList.remove('hidden');
	});

	interface TournamentItem {
		id: string;
		name: string;
		players: number;
		maxPlayers: number;
		type: 'public' | 'private';
	}

	const tournamentItems: TournamentItem[] = [
		{
			id: '1',
			name: 'Summer Tournament',
			players: 5,
			maxPlayers: 10,
			type: 'public',
		},
		{
			id: '2',
			name: 'Winter Tournament',
			players: 3,
			maxPlayers: 8,
			type: 'private',
		},

		{
			id: '3',
			name: 'test Tournament',
			players: 6,
			maxPlayers: 8,
			type: 'private',
		},
	]
	


	const tournamentContainer = document.getElementById('tournament-container') as HTMLDivElement;
	function generateTournamentItem(TournamentItem: TournamentItem[])
	{
		if (tournamentContainer)
		{
			if (TournamentItem.length === 0)
			{
				const message = document.createElement('div');
				message.className = 'text-center text-white font-bold text-2xl mt-10';
				message.textContent = "There are no tournaments available at the moment!";
				tournamentContainer.appendChild(message);
				return;
			}
			TournamentItem.forEach(tournament => {
				const tournamentElement = document.createElement('div');
				tournamentElement.className = 'flex items-center justify-between p-2 mb-2 bg-black/40 rounded-xl border-2 border-[#00FFFF] shadow-[0_0_5px_#00FFFF]';
				if (tournament.type === 'public')
				{
					tournamentElement.innerHTML = `<div class="flex items-center gap-8">
					<span class="text-[#FFD700] font-bold text-xl min-w-[200px]">${tournament.name}</span>
					<span class="text-[#00FFFF] min-w-[100px]">Players: <span class="text-[#FF2E9F]">${tournament.players}/${tournament.maxPlayers}</span></span>
					<span class="text-[#00FFFF]">Type: <span class="text-[#FF2E9F]">${tournament.type}</span></span>
				</div>
				<div class="flex items-center gap-4">
					<div id="password-container" class="relative hidden">
						<input type="password" 
							class="bg-black/40 border-2 border-[#00FFFF] text-[#00FFFF] rounded-xl p-2 w-48 pr-12 focus:outline-none focus:border-[#FFD700]" 
							placeholder="Enter Password"/>
						<button type="button" class="toggle-password absolute top-1/2 -translate-y-1/2 right-2">
							<img src="/images/closerobot.png" 
								class="size-8 drop-shadow-[0_0_10px_#FF007A]" 
								alt="toggle password"/>
						</button>
					</div>
					<button id="join-tournament-btn-${tournament.id}" class="bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold py-2 px-6 rounded-xl hover:bg-[#FFD700]/20 transition duration-200 shadow-[0_0_10px_#FFD700]">
						JOIN
					</button>
				</div>`;
				}
				else
				{
					tournamentElement.innerHTML = `<div class="flex items-center gap-8">
					<span class="text-[#FFD700] font-bold text-xl min-w-[200px]">${tournament.name}</span>
					<span class="text-[#00FFFF] min-w-[100px]">Players: <span class="text-[#FF2E9F]">${tournament.players}/${tournament.maxPlayers}</span></span>
					<span class="text-[#00FFFF]">Type: <span class="text-[#FF2E9F]">${tournament.type}</span></span>
				</div>
				<div class="flex items-center gap-4">
					<div id="password-container" class="relative">
						<input id="password-input-${tournament.id}" type="password" 
							class="bg-black/40 border-2 border-[#00FFFF] text-[#00FFFF] rounded-xl p-2 w-48 pr-12 focus:outline-none focus:border-[#FFD700]" 
							placeholder="Enter Password"/>
						<button id="toggle-password-${tournament.id}" type="button" class="absolute top-1/2 -translate-y-1/2 right-2">
							<img id=password-icon-${tournament.id} src="/images/closerobot.png" 
								class="size-8 drop-shadow-[0_0_10px_#FF007A]" 
								alt="toggle password"/>
						</button>
					</div>
					<button id="join-tournament-btn-${tournament.id}" class="bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold py-2 px-6 rounded-xl hover:bg-[#FFD700]/20 transition duration-200 shadow-[0_0_10px_#FFD700]">
						JOIN
					</button>
				</div>`;
				}
				tournamentContainer.appendChild(tournamentElement);
			});
		}
	}
	
	

	generateTournamentItem(tournamentItems);

	const JoinBtnTournament = document.querySelectorAll('[id^="join-tournament-btn-"]');
	
	if (JoinBtnTournament.length > 0) {
		JoinBtnTournament.forEach(button => {
			button.addEventListener('click', async () => {
				console.log(`Joining tournament with ID: ${button.id.split('-').pop()}`);
				// const passwordInput = document.getElementById(`password-input-${button.id.split('-').pop()}`) as HTMLInputElement;
				// const tournamentId = button.id.split('-').pop();

				// try {
				// 	const response = await fetch('/api/tournament/join', {
				// 		method: 'POST',
				// 		headers: {
				// 			'Content-Type': 'application/json',
				// 		},
				// 		body: JSON.stringify({
				// 			id_tournamemt: tournamentId,
				// 			id_user: '1', // a remplacer pas le vrai id de l'utilisateur
				// 			password: passwordInput.value ? passwordInput.value : undefined,
				// 		})
				// 	});
				// 	if (!response.ok) {
				// 		throw new Error('Failed to create tournament');
				// 	}
				// 	joinView?.classList.add('hidden');
				// 	mainView?.classList.remove('hidden');
				// 	alert('Successfully joined the tournament!');
				// } catch (error) {
				// 	alert('Failed to create tournament');
				// }

			});
		});
	}

	const togglePasswordButtons = document.querySelectorAll('[id^="toggle-password-"]');
	if (togglePasswordButtons.length > 0) {
			togglePasswordButtons.forEach(button => {
			const passwordInput = document.getElementById(`password-input-${button.id.split('-').pop()}`) as HTMLInputElement;
			const passwordIcon = document.getElementById(`password-icon-${button.id.split('-').pop()}`) as HTMLImageElement;
			togglePassword(passwordInput, button as HTMLButtonElement, passwordIcon);
		});
	}
			
}
