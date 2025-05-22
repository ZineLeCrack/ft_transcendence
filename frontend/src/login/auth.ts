import { togglePassword, checkPasswordMatch, hidePassword } from '../profile/utils.js';

const IP_NAME = '10.12.200.81';

// Elements de navigation
const signIn = document.getElementById('sign-in') as HTMLElement;
const signUp = document.getElementById('sign-up') as HTMLElement;
const toSignUp = document.getElementById('to-sign-up') as HTMLElement;
const toSignIn = document.getElementById('to-sign-in') as HTMLElement;

// Champs mots de passe
const signInPasswordInput = document.getElementById('sign-in-password-input') as HTMLInputElement;
const signInPasswordBtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement;
const signInPasswordIcon = document.getElementById('sign-in-password-icon') as HTMLImageElement;

const signUpPasswordInput = document.getElementById('sign-up-password-input') as HTMLInputElement;
const signUpPasswordBtn = document.getElementById('sign-up-password-btn') as HTMLButtonElement;
const signUpPasswordIcon = document.getElementById('sign-up-password-icon') as HTMLImageElement;

const signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input') as HTMLInputElement;
const signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn') as HTMLButtonElement;
const signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon') as HTMLImageElement;

const badPasswordIcon = document.getElementById('badPasswordIcon') as HTMLImageElement;
const goodPasswordIcon = document.getElementById('goodPasswordIcon') as HTMLImageElement;
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon') as HTMLImageElement;
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon') as HTMLImageElement;

toSignUp.addEventListener('click', () =>
{
	signIn.classList.add('hidden');
	signUp.classList.remove('hidden');
	hidePassword(signInPasswordInput, signInPasswordIcon, null, null);
});

toSignIn.addEventListener('click', () =>
{
	signUp.classList.add('hidden');
	signIn.classList.remove('hidden');
	hidePassword(signUpPasswordInput, signUpPasswordIcon, goodPasswordIcon, badPasswordIcon);
	hidePassword(signUpConfirmPasswordInput, signUpConfirmPasswordIcon, goodConfirmPasswordIcon, badConfirmPasswordIcon);
});

// Switch entre email / username
const signInUsernameDiv = document.getElementById('sign-in-username-div') as HTMLElement;
const signInEmailDiv = document.getElementById('sign-in-email-div') as HTMLElement;
const signInWithEmail = document.getElementById('sign-in-with-email') as HTMLElement;
const signInWithUsername = document.getElementById('sign-in-with-Username') as HTMLElement;
const signInUsernameInput = document.getElementById('Sign-in-username') as HTMLInputElement;
const signInEmailInput = document.getElementById('Sign-In-email') as HTMLInputElement;

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
togglePassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
togglePassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);

// Vérification des mots de passe en temps réel
signUpPasswordInput.addEventListener('input', () =>
{
	checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon);
});

signUpConfirmPasswordInput.addEventListener('input', () =>
{
	checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon);
});

// Soumission du formulaire d'inscription
const signupform = document.getElementById('sign-up') as HTMLFormElement;

signupform?.addEventListener('submit', async (event) =>
{
	event.preventDefault();

	if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value)
	{
		alert('Les mots de passe ne correspondent pas.');
		return ;
	}

	const usernameInput = document.getElementById('sign-up-username') as HTMLInputElement;
	const emailInput = document.getElementById('sign-up-email') as HTMLInputElement;

	const userData =
	{
		username: usernameInput.value,
		email: emailInput.value,
		password: signUpPasswordInput.value,
	};

	try {
		const response = await fetch(`https://${IP_NAME}:3451/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		});

		if (!response.ok)
		{
			const error = await response.text();
			throw new Error(error || 'Erreur lors de l\'inscription');
		}

		// alert('Inscription réussie !');
		window.location.href = "login.html";
		window.location.href = "login.html";
	}
	catch (err)
	{
		alert('Erreur : ' + (err as Error).message);
	}
});

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
		const response = await fetch(`https://${IP_NAME}:3451/login`,
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
		localStorage.setItem('userName', data.profile_pic);

		window.location.href = "../../index.html";
	}
	catch (err)
	{
		console.log('Erreur : ' + (err as Error).message);
	}
});
