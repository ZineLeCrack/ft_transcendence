import { loadTranslations, applyTranslations, setStoredLanguage, getStoredLanguage } from './i18n';
import { refreshGameModeDisplay } from './game/choosegame';
import initJoinTournament from './tournament/join_tournament';
import initFriendChat from './chat/friendchat';
import initHistory from './profile/history';
import { initGlobalGraph } from './profile/global';
import { initTournamentGraph } from './profile/tournament';
import { loadHistoryContent } from './search/users';

export async function initLanguageSelector(username?:string) {
	const languageSelector = document.getElementById('language-selector');
	const languageDropdown = document.getElementById('language-dropdown');
	const languageOptions = document.querySelectorAll('.language-option');

	const storedLang = getStoredLanguage();
	await changeLanguage(storedLang, username);

	updateFlag(storedLang);

	languageSelector?.addEventListener('click', () => {
		languageDropdown?.classList.toggle('hidden');
	});

	document.addEventListener('click', (e) => {
		if (!languageSelector?.contains(e.target as Node) && !languageDropdown?.contains(e.target as Node)) {
			languageDropdown?.classList.add('hidden');
		}
	});

	languageOptions.forEach(option => {
		option.addEventListener('click', async () => {
			const lang = option.getAttribute('data-lang');
			if (lang && lang !== getStoredLanguage()) { 
				await changeLanguage(lang, username);
				setStoredLanguage(lang);
				updateFlag(lang);
			}
			languageDropdown?.classList.add('hidden');
		});
	});
}

async function changeLanguage(lang: string, username?:string): Promise<void> {
	await loadTranslations(lang);
	applyTranslations();

	const path = window.location.pathname;
	const userHistroryPathRegex = /^\/users\/[^\/]+\/history$/;

	if (window.location.pathname === '/home')
	{		
		refreshGameModeDisplay();
		initJoinTournament();
		initFriendChat();
	}
	if (window.location.pathname === "/profile/statistics/history")
	{
		initHistory();
	}
	if (window.location.pathname === '/profile/statistics')
	{
		initGlobalGraph(username!);
	}
	if (window.location.pathname === '/profile/statistics/tournaments')
	{
		initTournamentGraph(username!);
	}
	if (userHistroryPathRegex.test(path))
	{
		loadHistoryContent(username!);
	}

}

function updateFlag(lang: string): void {
	const currentFlag = document.getElementById('current-flag') as HTMLImageElement;
	if (currentFlag) {
		currentFlag.src = `/images/${lang}.png`;
	}
}