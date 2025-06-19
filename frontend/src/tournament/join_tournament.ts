import { togglePassword } from "../profile/utils";
import { getWebSocket } from '../websocket';
import { translate } from '../i18n'

import initError from '../error.js';
import initInTournament from "./in_tournament.js";

export default async function initJoinTournament() {

	const joinTournamentBtn = document.getElementById('join-tournament');
	const backToTournamentBtn = document.getElementById('back-to-tournament-join');
	const mainView = document.getElementById('tournament-main-view');
	const joinView = document.getElementById('tournament-join-view');

	function joinOnClick() {
		mainView?.classList.add('hidden');
		joinView?.classList.remove('hidden');
	}

	function backOnClick() {
		joinView?.classList.add('hidden');
		mainView?.classList.remove('hidden');
	}

	joinTournamentBtn?.addEventListener('click', joinOnClick);

	backToTournamentBtn?.addEventListener('click', backOnClick);

	interface TournamentItem {
		id: string;
		name: string;
		players: number;
		maxPlayers: number;
		type: 'public' | 'private';
	}

	try {
		const res = await fetch('/api/tournament/list', {
			method: 'POST',
		})

		const data = await res.json();
		const TournamentItems: TournamentItem[] = data.tournaments;

		const tournamentContainer = document.getElementById('tournament-container') as HTMLDivElement;
		function generateTournamentItem(TournamentItem: TournamentItem[])
		{
			if (tournamentContainer)
			{
				tournamentContainer.innerHTML = '';
				if (TournamentItem.length === 0)
				{
					const message = document.createElement('div');
					message.className = 'text-center text-white font-bold text-2xl mt-10';
					message.textContent = translate("no_tournaments_available");
					tournamentContainer.appendChild(message);
					return ;
				}

				TournamentItem.forEach(tournament => {
					const tournamentElement = document.createElement('div');
					tournamentElement.className = 'flex items-center justify-between p-2 mb-2 bg-black/40 rounded-xl border-2 border-[#00FFFF] shadow-[0_0_5px_#00FFFF]';

					const playersLabel = translate("players_label");
					const typeLabel = translate("type");
					const enterPasswordPlaceholder = translate("enter_password_placeholder");
					const joinButton = translate("join_button");
					const privateType = translate("private");
					const publicType = translate("public");
					if (tournament.type === 'public')
					{
						tournamentElement.innerHTML = `<div class="flex items-center gap-8">
						<span class="text-[#FFD700] font-bold text-xl min-w-[200px]">${tournament.name}</span>
						<span class="text-[#00FFFF] min-w-[100px]">${playersLabel}: <span class="text-[#FF2E9F]">${tournament.players}/${tournament.maxPlayers}</span></span>
						<span class="text-[#00FFFF]">${typeLabel}<span class="text-[#FF2E9F]">${publicType}</span></span>
					</div>
					<div class="flex items-center gap-4">
						<div id="password-container" class="relative hidden">
							<input type="password"
								class="bg-black/40 border-2 border-[#00FFFF] text-[#00FFFF] rounded-xl p-2 w-48 pr-12 focus:outline-none focus:border-[#FFD700]"
								placeholder="${enterPasswordPlaceholder}"/>
							<button type="button" class="toggle-password absolute top-1/2 -translate-y-1/2 right-2">
								<img src="/images/closerobot.png"
									class="size-8 drop-shadow-[0_0_10px_#FF007A]"
									alt="toggle password"/>
							</button>
						</div>
						<button id="join-tournament-btn-${tournament.id}" class="bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold py-2 px-6 rounded-xl hover:bg-[#FFD700]/20 transition duration-200 shadow-[0_0_10px_#FFD700]">
							${joinButton}
						</button>
					</div>`;
					}
					else
					{
						tournamentElement.innerHTML = `<div class="flex items-center gap-8">
						<span class="text-[#FFD700] font-bold text-xl min-w-[200px]">${tournament.name}</span>
						<span class="text-[#00FFFF] min-w-[100px]">${playersLabel}:<span class="text-[#FF2E9F]">${tournament.players}/${tournament.maxPlayers}</span></span>
						<span class="text-[#00FFFF]">${typeLabel} <span class="text-[#FF2E9F]">${privateType}</span></span>
					</div>
					<div class="flex items-center gap-4">
						<div id="password-container" class="relative">
							<input id="password-input-${tournament.id}" type="password"
								class="bg-black/40 border-2 border-[#00FFFF] text-[#00FFFF] rounded-xl p-2 w-48 pr-12 focus:outline-none focus:border-[#FFD700]"
								placeholder="${enterPasswordPlaceholder}"/>
							<button id="toggle-password-${tournament.id}" type="button" class="absolute top-1/2 -translate-y-1/2 right-2">
								<img id=password-icon-${tournament.id} src="/images/closerobot.png"
									class="size-8 drop-shadow-[0_0_10px_#FF007A]"
									alt="toggle password"/>
							</button>
						</div>
						<button id="join-tournament-btn-${tournament.id}" class="bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold py-2 px-6 rounded-xl hover:bg-[#FFD700]/20 transition duration-200 shadow-[0_0_10px_#FFD700]">
							${joinButton}
						</button>
					</div>`;
					}
					tournamentContainer.appendChild(tournamentElement);
				});
			}
		}

		generateTournamentItem(TournamentItems);
	} catch (err) {
		console.error(`Error loading tournaments list: `, err);
	}

	const JoinBtnTournament = document.querySelectorAll('[id^="join-tournament-btn-"]');

	const chooseTournamentAliasTitle = translate("choose_tournament_alias_title");
	const enterYourAliasPlaceholder = translate("enter_your_alias_placeholder");
	const cancelButton = translate("cancel_button");
	const confirmJoinButton = translate("confirm_join_button");

	const aliasPopUp =
	`<div id="alias-popup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
		<div class="bg-black/90 p-8 rounded-xl border-2 border-[#00FFFF] shadow-[0_0_10px_#00FFFF] w-96">
			<h3 class="text-[#00FFFF] text-xl font-bold mb-6 text-center">${chooseTournamentAliasTitle}</h3>
			<input type="text" id="tournament-alias" maxlength="10"
				class="w-full bg-black/40 border-2 border-[#00FFFF] text-[#00FFFF] rounded-xl p-2 mb-6 focus:outline-none focus:border-[#FFD700]"
				placeholder="${enterYourAliasPlaceholder}"/>
			<div class="flex justify-between gap-4">
				<button id="cancel-alias"
					class="flex-1 bg-transparent border-2 border-[#FF2E9F] text-[#FF2E9F] font-bold py-2 px-6 rounded-xl hover:bg-[#FF2E9F]/20 transition duration-200">
					${cancelButton}
				</button>
				<button id="confirm-alias"
					class="flex-1 bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold py-2 px-6 rounded-xl hover:bg-[#FFD700]/20 transition duration-200">
					${confirmJoinButton}
				</button>
			</div>
		</div>
	</div>`;

	if (JoinBtnTournament.length > 0) {
		JoinBtnTournament.forEach(button => {
			button.addEventListener('click', async () => {
				backOnClick();
				const passwordInput = document.getElementById(`password-input-${button.id.split('-').pop()}`) as HTMLInputElement;
				const tournamentId = button.id.split('-').pop();

				document.body.insertAdjacentHTML('beforeend', aliasPopUp);
				const confirmAlias = document.getElementById('confirm-alias') as HTMLButtonElement;
				const cancelAlias = document.getElementById('cancel-alias') as HTMLButtonElement;
				const inputAlias = document.getElementById('tournament-alias') as HTMLInputElement;

				confirmAlias.addEventListener('click', async () => {
					try {
						if (inputAlias.value.trim().length > 10) {
							initError(translate('alias_too_long'));
							return ;
						}

						if (!(/^[a-zA-Z0-9_]{0,10}$/.test(inputAlias.value))) {
							initError(translate('invalid_alias'));
							return ;
						}

						const token = sessionStorage.getItem('token');
						const response = await fetch('/api/tournament/join', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								id_tournament: tournamentId,
								token: token,
								password: passwordInput ? passwordInput.value : '',
								alias: inputAlias.value.trim()
							})
						});

						const text = await response.text();

						if (text === "This tournament is full !") {
							throw new Error(translate("tournament_full"));
						} else if (text === "Wrong password !") {
							throw new Error(translate("no_pass"));
						} else if (text === "Invalid alias !") {
							throw new Error(translate("invalid_alias"));
						}

						const PopPup = document.getElementById('alias-popup') as HTMLDivElement;
						PopPup.remove();
						joinTournamentBtn?.classList.add("hidden");
						const createTournamentBtn = document.getElementById('create-tournament');
						createTournamentBtn?.classList.add("hidden");
						const data = JSON.parse(text);
						initInTournament(data.id);
						const ws = getWebSocket();
						ws?.send(JSON.stringify({ type: 'tournament_new_player', token: token, id: data.id }));

						if (data.full) {
							try {
								const response1 = await fetch('/api/tournament/get_players', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ tournamentId: data.id })
								});
								const players = await response1.json();
								const response2 = await fetch('/api/tournament/get_winners', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ tournamentId: data.id })
								});
								const results = await response2.json();
								await fetch('/api/multi/tournament/start', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ id: data.id, ...players, ...results })
								});
								ws?.send(JSON.stringify({ type: 'tournament_next_game', next_player1: players.player1, next_player2: players.player2, id: data.id }));
							} catch (err) {
								console.error(`Error starting tournament: `, err);
								return ;
							}
						}

						joinView?.classList.add('hidden');
						mainView?.classList.remove('hidden');
					} catch (err) {
						initError((err as string).toString().substring(7));
					}
				});

				cancelAlias.addEventListener('click', async () => {
					const PopPup = document.getElementById('alias-popup') as HTMLDivElement;
					PopPup.remove();
				});
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
