import { togglePassword } from "../profile/utils";

import initError from '../error.js';
import { translate } from "../i18n.js";
import { getWebSocket } from "../websocket.js";

export default function initCreateTournament() {
	const createTournamentBtn = document.getElementById('create-tournament');
	const backToTournamentBtn = document.getElementById('back-to-tournament');
	const createTournamentSubmitBtn = document.getElementById('create-tournament-submit');
	const mainView = document.getElementById('tournament-main-view');
	const createView = document.getElementById('tournament-create-view');
	
	createTournamentBtn?.addEventListener('click', () => {
		mainView?.classList.add('hidden');
		createView?.classList.remove('hidden');
	});
	
	backToTournamentBtn?.addEventListener('click', () => {
		createView?.classList.add('hidden');
		mainView?.classList.remove('hidden');
	});
	
	const typeRadios = document.querySelectorAll('input[name="type"]');

	const tournamentPasswordInput = document.getElementById('tournament-password') as HTMLInputElement;
	const tournamentPasswordBtn = document.getElementById('tournament-password-btn') as HTMLButtonElement;
	const tournamentPasswordIcon = document.getElementById('tournament-password-icon') as HTMLImageElement;
	
	typeRadios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			const target = e.target as HTMLInputElement;
			if (tournamentPasswordInput) {
				if (target.value === 'private') {
					tournamentPasswordInput.classList.remove('invisible');
					tournamentPasswordInput.classList.add('visible');

					tournamentPasswordIcon.classList.remove('invisible');
					tournamentPasswordIcon.classList.add('visible');
				} else {
					tournamentPasswordInput.classList.remove('visible');
					tournamentPasswordInput.classList.add('invisible');

					tournamentPasswordIcon.classList.remove('visible');
					tournamentPasswordIcon.classList.add('invisible');
				}
			}
		});
	});


	togglePassword(tournamentPasswordInput, tournamentPasswordBtn, tournamentPasswordIcon);	

	createTournamentSubmitBtn?.addEventListener('click', async () => {
		const tournamentName = (document.getElementById('tournament-name') as HTMLInputElement)?.value;
		const type = document.querySelector('input[name="type"]:checked') as HTMLInputElement;
		const password = (document.getElementById('tournament-password') as HTMLInputElement)?.value;

		if (!tournamentName) {
			initError(translate('torn_name'));
			return;
		}

		if (type.value === 'private' && !password) {
			initError(translate('torn_name'));
			return;
		}

		try {
			const response = await fetch('/api/tournament/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: tournamentName,
					players_max: 8,
					type: type.value,
					password: type.value === 'private' ? password: null
				})
			});

			if (!response.ok) {
				throw new Error('Failed to create tournament');
			}

			const ws = getWebSocket();
			ws?.send(JSON.stringify({ type: 'tournament_created' }));
			createView?.classList.add('hidden');
			mainView?.classList.remove('hidden');
			window.location.reload(); // surement a enlever 
		} catch (error) {
			initError(translate('torn_failed'));
		}
	});
}
