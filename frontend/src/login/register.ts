import { togglePassword, checkPasswordMatch} from '../profile/utils.js';
import { loadRoutes } from '../main.js';
import initError from '../error.js';
import initSuccess from '../success.js';
import { initLanguageSelector } from '../language.js';


export default function initRegister() {
	initLanguageSelector();

	const signupform = document.getElementById('sign-up') as HTMLFormElement;

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

	togglePassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
	togglePassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);

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
			initError('Password does not match.');
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
			const response = await fetch(`/api/submit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			});

			if (!response.ok)
			{
				const error = await response.text();
				initError(error);
				return;
			}

			initSuccess('Registration successful! redirecting to login page...');
			setTimeout(async () => {
			    history.pushState(null, '', '/login');
			    await loadRoutes('/login');
			}, 1000);
		}
		catch (err)
		{
            initError(err as string);
		}
	});

	function validateUsernameField(input: HTMLInputElement) {
        const errorElement = document.getElementById('username-error');
        if (!errorElement) return;

        const isValid = /^[a-zA-Z0-9_]{3,18}$/.test(input.value);
        
        if (!isValid && input.value.length >= 1) {
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
        } else {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
        }
    }

    const usernameInput = document.getElementById('sign-up-username') as HTMLInputElement;
    if (usernameInput) {
        usernameInput.addEventListener('input', () => validateUsernameField(usernameInput));
        usernameInput.addEventListener('invalid', (e) => {
            e.preventDefault();
            validateUsernameField(usernameInput);
        });
    }

	function validateEmailField(input: HTMLInputElement) {
        const errorElement = document.getElementById('email-error');
        if (!errorElement) return;

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        
        if (!isValid && input.value.length >= 1) {
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
        } else {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
        }
    }

    const emailInput = document.getElementById('sign-up-email') as HTMLInputElement;
    if (emailInput) {
        emailInput.addEventListener('input', () => validateEmailField(emailInput));
        emailInput.addEventListener('invalid', (e) => {
            e.preventDefault();
            validateEmailField(emailInput);
        });
    }

	function validatePasswordField(input: HTMLInputElement) {
        const errorElement = document.getElementById('password-error');
        if (!errorElement) return;

        const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(input.value);
        
        if (!isValid && input.value.length >= 1) {
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
        } else {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
        }
    }

    const PasswordInput = document.getElementById('sign-up-password-input') as HTMLInputElement;
    if (PasswordInput) {
        PasswordInput.addEventListener('input', () => validatePasswordField(PasswordInput));
        PasswordInput.addEventListener('invalid', (e) => {
            e.preventDefault();
            validatePasswordField(PasswordInput);
        });
    }
}