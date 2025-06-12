import initError from '../error.js';
import { loadRoutes } from '../main.js';
import initSuccess from '../success.js';
import { initLanguageSelector } from '../language.js';


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
	    initSuccess('A2F code sent, please enter it');
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
			initError(error);
			return;
		}
		const result = await response.json();
		const jwtToken = result.token;
		sessionStorage.setItem('token', jwtToken);
		sessionStorage.removeItem("userId");
		initSuccess('A2F code verified, redirecting to home page...');
	    setTimeout(async () => {
			history.pushState(null, '', '/home');
			await loadRoutes('/home');
		}, 1000);
	});
}