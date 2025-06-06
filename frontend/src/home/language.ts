export function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    const languageDropdown = document.getElementById('language-dropdown');
    const currentFlag = document.getElementById('current-flag') as HTMLImageElement;
    const languageOptions = document.querySelectorAll('.language-option');

    languageSelector?.addEventListener('click', () => {
        languageDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!languageSelector?.contains(e.target as Node)) {
            languageDropdown?.classList.add('hidden');
        }
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const img = option.querySelector('img') as HTMLImageElement;
            if (img && currentFlag) {
                currentFlag.src = img.src;
                currentFlag.alt = img.alt;
            }
            languageDropdown?.classList.add('hidden');
        });
    });
}