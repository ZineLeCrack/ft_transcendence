import { loadRoutes } from '../main.js';


export default function initA2f() {

const IP_NAME = import.meta.env.VITE_IP_NAME;

const form = document.getElementById("a2f") as HTMLFormElement;
const sendBtn = document.getElementById('to-send-a2f') as HTMLButtonElement;
const codeInput = document.getElementById("code-input") as HTMLInputElement;


sendBtn.addEventListener("click", async () => {
    const Data =
    {
        IdUser : localStorage.getItem('userId'),
    }
    const response = await fetch(`/api/a2f/send`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Data),
	});
	if (!response.ok)
	{
		const error = await response.text();
		throw new Error(error || 'Erreur lors de la connection');
	}
    alert("Mail envoye");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const Data =
    {
        code : codeInput.value,
        IdUser : localStorage.getItem('userId'),
    }
    const response = await fetch(`/api/a2f/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Data),
	});
	if (!response.ok)
	{
		const error = await response.text();
		alert("Mauvais code a2f");
		throw new Error(error || 'Erreur lors de la connection');
	}
	const result = await response.json();
	const jwtToken = result.token;
	sessionStorage.setItem(`${Data.IdUser}`, jwtToken);
    console.log("Code 2FA saisi :", Data.code);
    history.pushState(null, '', '/home');
    await loadRoutes('/home');
});
}