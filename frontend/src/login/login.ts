import { togglePassword } from '../profile/utils.js';
import { loadRoutes } from '../main.js';
import initError from '../error.js';
import initSuccess from '../success.js';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';

export let userId: string;

export default function initLogin() {

	initLanguageSelector();

	const signInPasswordInput = document.getElementById('sign-in-password-input') as HTMLInputElement;
	const signInPasswordBtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement;
	const signInPasswordIcon = document.getElementById('sign-in-password-icon') as HTMLImageElement;

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

	const toSignUpBtn = document.getElementById('to-sign-up-button') as HTMLButtonElement;
	toSignUpBtn.addEventListener('click', async (event) =>
	{
		event.preventDefault();
		history.pushState(null, '', '/register');
		await loadRoutes('/register');
	});
	togglePassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);

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
				initError(error);
				return ;
			}
			const text = await response.text();
			if (text === "Invalid email or password")
			{
				throw new Error(translate("bad_mail_pass"));
			}
			else if (text === "Invalid username or password")
			{
				throw new Error(translate("bad_user_pass"))
			}
			const data = JSON.parse(text);
			//sessionStorage.setItem('userId', data.id);
			userId = data.id;
			initSuccess(translate('login_success'));
			setTimeout (async () => {
				history.pushState(null, '', '/login/2fa');
				await loadRoutes('/login/2fa');
			}, 1000);
		}
		catch (err)
		{
			initError((err as string).toString().substring(7));
		}
	});
}
