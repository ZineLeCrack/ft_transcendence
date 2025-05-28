import { togglePassword, checkPasswordMatch} from '../profile/utils.js';

const IP_NAME = import.meta.env.VITE_IP_NAME;

export function init() {
	const signupform = document.getElementById('sign-up') as HTMLFormElement;

	// Champs mots de passe
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


	// Affichage mot de passe
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

			window.location.href = "login.html";
		}
		catch (err)
		{
			console.log(err);
			alert("Accept the 3451 port !");
		}
	});
}