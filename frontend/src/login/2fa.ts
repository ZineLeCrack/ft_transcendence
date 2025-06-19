import initError from '../error.js';
import { loadRoutes } from '../main.js';
import initSuccess from '../success.js';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';
import { userId } from './login.js';
export default function init2fa() {

	initLanguageSelector();

	const form = document.getElementById("2fa") as HTMLFormElement;
	const sendBtn = document.getElementById('to-send-2fa') as HTMLButtonElement;
	const codeInput = document.getElementById("code-input") as HTMLInputElement;

	sendBtn.addEventListener("click", async () => {
		try {
			const Data = { IdUser: userId };
			const response = await fetch(`/api/2fa/send`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Data),
			});
			if (!response.ok)
			{
				const error = await response.text();
				initError(error);
				setTimeout(async () => {
					history.pushState(null, '', '/login');
					await loadRoutes('/login');
				}, 1000);
				return ;
			}
			initSuccess(translate('2fa_send'));
		} catch (err) {
			console.error('Error sending 2fa code:', err);
		}
	});

	form.addEventListener("submit", async (event) => {
		try {
			event.preventDefault();
			const Data = { code: codeInput.value, IdUser: userId };
			if (!Data.code) {
				return ;
			}
			const response = await fetch(`/api/2fa/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Data),
			});
			if (!response.ok)
			{
				const error = await response.text();
				console.error(error)
				return ;
			}
			const err = await response.text();
			if (err === "bad code")
			{
				initError(translate("bad_code"));
				return ;
			}
			sessionStorage.removeItem("userId");
			initSuccess(translate('2fa_good_mess'));
			setTimeout(async () => {
				history.pushState(null, '', '/home');
				await loadRoutes('/home');
			}, 1000);
		} catch (err) {
			console.error('Error verifying 2fa code:', err);
		}
	});
}
