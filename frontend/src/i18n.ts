interface Translations {
	[key: string]: string;
}

let currentTranslations: Translations = {};
const DEFAULT_LANGUAGE = 'en';

export async function loadTranslations(lang: string): Promise<Translations> {
	try {
		const response = await fetch(`/locales/${lang}.json`);
		if (!response.ok) {
			throw new Error(`Could not load translations for ${lang}: ${response.statusText}`);
		}
		currentTranslations = await response.json();
		return currentTranslations;
	} catch (error) {
		console.error(`Error loading translations for ${lang}:`, error);
		if (lang !== DEFAULT_LANGUAGE) {
			console.warn(`Falling back to default language: ${DEFAULT_LANGUAGE}`);
			return loadTranslations(DEFAULT_LANGUAGE);
		}
		return {};
	}
}

export function applyTranslations(): void {
	document.querySelectorAll('[data-i18n]').forEach(element => {
		const key = element.getAttribute('data-i18n');
		if (key && currentTranslations[key]) {
			element.textContent = currentTranslations[key];
		}
	});

	document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
		const key = element.getAttribute('data-i18n-placeholder');
		if (key && currentTranslations[key]) {
			(element as HTMLInputElement).placeholder = currentTranslations[key];
		}
	});
}

export function translate(key: string): string {
	return currentTranslations[key] || key;
}

export function getStoredLanguage(): string {
	return localStorage.getItem('lang') || DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: string): void {
	localStorage.setItem('lang', lang);
}