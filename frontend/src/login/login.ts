import { togglePassword} from '../profile/utils.js';
import { loadRoutes } from '../main.js';


export default function initLogin() {

	const IP_NAME = import.meta.env.VITE_IP_NAME;

	// Champs mots de passe
	const signInPasswordInput = document.getElementById('sign-in-password-input') as HTMLInputElement;
	const signInPasswordBtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement;
	const signInPasswordIcon = document.getElementById('sign-in-password-icon') as HTMLImageElement;

	// Switch entre email / username
	const signInUsernameDiv = document.getElementById('sign-in-username-div') as HTMLElement;
	const signInEmailDiv = document.getElementById('sign-in-email-div') as HTMLElement;
	const signInWithEmail = document.getElementById('sign-in-with-email') as HTMLElement;
	const signInWithUsername = document.getElementById('sign-in-with-Username') as HTMLElement;
	const signInUsernameInput = document.getElementById('Sign-in-username') as HTMLInputElement;
	const signInEmailInput = document.getElementById('Sign-in-email') as HTMLInputElement;

	signInWithUsername.addEventListener('click', () =>
	{
		signInEmailDiv.classList.add('hidden');
		signInUsernameDiv.classList.remove('hidden');
		signInUsernameInput.required = true;
		signInEmailInput.required = false;
	});

	signInWithEmail.addEventListener('click', () =>
	{
		signInUsernameDiv.classList.add('hidden');
		signInEmailDiv.classList.remove('hidden');
		signInEmailInput.required = true;
		signInUsernameInput.required = false;
	});

	// Affichage mot de passe
	togglePassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);

	// Soumission du formulaire d'inscription

	const signinform = document.getElementById('sign-in') as HTMLFormElement;

	signinform?.addEventListener('submit', async (event) =>
	{
		event.preventDefault();

		const userData =
		{
			required: signInEmailInput.required ? "email": "name",
			login: signInEmailInput.required ? signInEmailInput.value: signInUsernameInput.value,
			password: signInPasswordInput.value
		};

		try
		{
			const response = await fetch(`/api/login`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});

			if (!response.ok)
			{
				const error = await response.text();
				alert("Mauvais identifiant ou mot de passe");
				throw new Error(error || 'Erreur lors de la connection');
			}

			const data = await response.json();

			localStorage.setItem('userId', data.id);
			localStorage.setItem('userName', data.name);
			localStorage.setItem('userPicture', data.profile_pic);

			history.pushState(null, '', '/login/a2f');
			await loadRoutes('/login/a2f');
		}
		catch (err)
		{
			console.log(err);
			alert("Accept the 3451 port !");
		}
	});
}