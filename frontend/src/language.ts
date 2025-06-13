import { loadTranslations, applyTranslations, setStoredLanguage, getStoredLanguage } from './i18n';
import { refreshGameModeDisplay } from './game/choosegame';
import initJoinTournament from './tournament/join_tournament';
import initFriendChat from './chat/friendchat';
import initHistory from './profile/history';

export async function initLanguageSelector() {
	const languageSelector = document.getElementById('language-selector');
	const languageDropdown = document.getElementById('language-dropdown');
	const languageOptions = document.querySelectorAll('.language-option');

	const storedLang = getStoredLanguage();
	await changeLanguage(storedLang);

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
				await changeLanguage(lang);
				setStoredLanguage(lang);
				updateFlag(lang);
			}
			languageDropdown?.classList.add('hidden');
		});
	});
}

async function changeLanguage(lang: string): Promise<void> {
	await loadTranslations(lang);
	applyTranslations();

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
}

function updateFlag(lang: string): void {
	const currentFlag = document.getElementById('current-flag') as HTMLImageElement;
	if (currentFlag) {
		currentFlag.src = `/images/${lang}.png`;
	}
}