import initError from '../error.js';
import { loadRoutes } from '../main.js';
import initSuccess from '../success.js';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';


export default function initA2f() {

	initLanguageSelector();
	
	const form = document.getElementById("a2f") as HTMLFormElement;
	const sendBtn = document.getElementById('to-send-a2f') as HTMLButtonElement;
	const codeInput = document.getElementById("code-input") as HTMLInputElement;

	sendBtn.addEventListener("click", async () => {
	    const Data =
	    {
	        IdUser : sessionStorage.getItem('userId'),
	    }
	    const response = await fetch(`/api/a2f/send`, {
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
			return;
		}
	    initSuccess(translate('a2f_send'));
	});

	form.addEventListener("submit", async (event) => {
	    event.preventDefault();

	    const Data =
	    {
	        code : codeInput.value,
	        IdUser : sessionStorage.getItem('userId'),
	    }
	    const response = await fetch(`/api/a2f/verify`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Data),
		});
		if (!response.ok)
		{
			const error = await response.text();
			console.error(error)
			return;
		}
		const err = await response.text();
		if (err === "bad code")
		{
			initError(translate("bad_code"));
			return;
		}
		const result = JSON.parse(err);
		const jwtToken = result.token;
		sessionStorage.setItem('token', jwtToken);
		sessionStorage.removeItem("userId");
		initSuccess(translate('a2f_good_mess'));
	    setTimeout(async () => {
			history.pushState(null, '', '/home');
			await loadRoutes('/home');
		}, 1000);
	});
}