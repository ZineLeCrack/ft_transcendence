import initBlockPlayer from './block';
import initAddFriend from './friend';
import initError from '../error.js';
import { loadRoutes } from '../main.js';

import { generateCardsHistory} from "../profile/history.js";
import initSearch from './search.js';
import { loadProfilePicture } from '../profile/editinfo.js';
import { initWebSocket } from '../websocket';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';
import initGlobalstats from './globalstat.js';

export async function loadHistoryContent(username: string) {
	const historyDiv = document.getElementById('history-div-search');
	if (historyDiv) {
		try
		{
			const response = await fetch(`/api/history`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username }),
				credentials: 'include',
			});

			const data = await response.json();
			generateCardsHistory('history-div-search', data, username);
		}
		catch (err)
		{
			console.error('Erreur lors de la récupération de l\'historique :', err);
		}
	}
}

export default async function initUsers(username?: string, isHistory: boolean = false) {
	await initLanguageSelector();
	const friendbtn = document.getElementById("friend-btn") as HTMLButtonElement;
	const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;

	let response;
	try {
		response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});
		if (!response.ok)
		{
			initError(translate('Error_co'));
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return ;
		}
	} catch (err) {
		console.error('Error verifying user:', err);
		return ;
	}

	const data = await response.json();

	initWebSocket(data.original);
	if (username) {

		const profile_pic_search = document.getElementById('profile-pic-search') as HTMLDivElement;
		profile_pic_search.innerHTML = ``;
		const profileBtn = document.getElementById('profileBtn') as HTMLAnchorElement;
		profileBtn.innerHTML = ``;

		loadProfilePicture("profile-pic-search", username);
		loadProfilePicture("profileBtn", "l");
		const usernameh2 = document.getElementById('username-h2');
		if (usernameh2) {
			usernameh2.textContent = username;
		}

		const globalBtn = document.getElementById('global-btn-search') as HTMLButtonElement;
		const historyBtn = document.getElementById('history-btn-search') as HTMLButtonElement;

		updateView(isHistory);

		historyBtn.onclick = null;

		historyBtn.onclick = async (e) => {
			e.preventDefault();
			const currentPath = window.location.pathname;
			const currentTargetPath = `/users/${username}/history`;
			if (currentPath !== currentTargetPath) {
				history.pushState(null, `${username}`, `/users/${username}/history`);
				updateView(true);
			}
		};

		globalBtn.onclick = null;

		globalBtn.onclick = async (e) => {
			e.preventDefault();
			history.pushState(null, `${username}`, `/users/${username}`);
			updateView(false);
		};

		const target = username;
		try {
			const blockCheck = await fetch("/api/isblock", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ target }),
				credentials: 'include',
			});
			const block = await blockCheck.json();
			if (data.original === username)
			{
				blockbtn.classList.add('hidden');
				friendbtn.classList.add('hidden');
				initSearch();
			}
			else
			{
				if (block.status !== 1)
				{
					initAddFriend(username);
					friendbtn.classList.remove('hidden');
				}
				else
					friendbtn.classList.add('hidden');
				initBlockPlayer(username);
				initSearch();
			}
		} catch (err) {
			console.error('Error getting user block status:', err);
		}
	}
}

function updateView(isHistory: boolean) {
	const globalBtn = document.getElementById('global-btn-search');
	const globalDiv = document.getElementById('global-div-search');
	const historyBtn = document.getElementById('history-btn-search');
	const historyDiv = document.getElementById('history-div-search');

	if (isHistory) {
		globalDiv?.classList.add('hidden');
		historyDiv?.classList.remove('hidden');
		globalBtn?.classList.remove('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
		globalBtn?.classList.add('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
		historyBtn?.classList.remove('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
		historyBtn?.classList.add('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');

		const username = document.getElementById('username-h2')?.textContent;
		if (username) {
			loadHistoryContent(username);
		}
	} else {
		globalDiv?.classList.remove('hidden');
		historyDiv?.classList.add('hidden');
		globalBtn?.classList.add('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
		globalBtn?.classList.remove('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
		historyBtn?.classList.add('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
		historyBtn?.classList.remove('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');

		const username = document.getElementById('username-h2')?.textContent;
		if (username) {
			loadOverallContent(username);
		}
	}
}

async function loadOverallContent(username: string) {
	const globalDiv = document.getElementById('global-div-search');
	const historyDiv = document.getElementById('history-div-search');
	if (globalDiv) {
		if (historyDiv){
			historyDiv.innerHTML = '';
		}
		await initGlobalstats(username);
	}
}
