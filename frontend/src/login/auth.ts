import { togglePassword, checkPasswordMatch, hidePassword } from '../profile/utils.js';

const signIn = document.getElementById('sign-in') as HTMLElement;
const signUp = document.getElementById('sign-up') as HTMLElement;
const toSignUp = document.getElementById('to-sign-up') as HTMLElement;
const toSignIn = document.getElementById('to-sign-in') as HTMLElement;

toSignUp.addEventListener('click', () => {
	signIn.classList.add('hidden');
	signUp.classList.remove('hidden');
	hidePassword(signInPasswordInput, signInPasswordIcon);
});

toSignIn.addEventListener('click', () => {
	signUp.classList.add('hidden');
	signIn.classList.remove('hidden');
	hidePassword(signUpPasswordInput, signUpPasswordIcon);
	hidePassword(signUpConfirmPasswordInput, signUpConfirmPasswordIcon);
});


const signInUsernameDiv = document.getElementById('sign-in-username-div') as HTMLElement;
const signInEmailDiv = document.getElementById('sign-in-email-div') as HTMLElement;
const signInWithEmail = document.getElementById('sign-in-with-email') as HTMLElement;
const signInWithUsername = document.getElementById('sign-in-with-Username') as HTMLElement;
const signInUsernameInput = document.getElementById('Sign-in-username') as HTMLInputElement;
const signInEmailInput = document.getElementById('Sign-in-email') as HTMLInputElement;

signInWithUsername.addEventListener('click', () => {
	signInEmailDiv.classList.add('hidden');
	signInUsernameDiv.classList.remove('hidden');
	signInUsernameInput.required = true;
	signInEmailInput.required = false;
	
});

signInWithEmail.addEventListener('click', () => {
	signInUsernameDiv.classList.add('hidden');
	signInEmailDiv.classList.remove('hidden');
	signInEmailInput.required = true;
	signInUsernameInput.required = false;
});


const signInPasswordInput = document.getElementById('sign-in-password-input') as HTMLInputElement ;
const signInPasswordBtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement ;
const signInPasswordIcon = document.getElementById('sign-in-password-icon') as HTMLImageElement;

const signUpPasswordInput = document.getElementById('sign-up-password-input') as HTMLInputElement ;
const signUpPasswordBtn = document.getElementById('sign-up-password-btn') as HTMLButtonElement;
const signUpPasswordIcon = document.getElementById('sign-up-password-icon') as HTMLImageElement;

const signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input') as HTMLInputElement;
const signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn') as HTMLButtonElement;
const signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon') as HTMLImageElement;



if (signInPasswordInput && signInPasswordBtn && signInPasswordIcon) {
	togglePassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);
}

if (signUpPasswordInput && signUpPasswordBtn && signUpPasswordIcon) {
	togglePassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
}

if (signUpConfirmPasswordInput && signUpConfirmPasswordBtn && signUpConfirmPasswordIcon) {
	togglePassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);
}

const badPasswordIcon = document.getElementById('badPasswordIcon') as HTMLImageElement;
const goodPasswordIcon = document.getElementById('goodPasswordIcon') as HTMLImageElement;
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon') as HTMLImageElement;
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon') as HTMLImageElement;


if (signUpPasswordInput && signUpConfirmPasswordInput)
{
	signUpPasswordInput.addEventListener('input', () => { checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon)});
	signUpConfirmPasswordInput.addEventListener('input', () => { checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon)});
}

const signupform = document.getElementById('sign-up') as HTMLFormElement;

if (signupform)
{
	signupform.addEventListener('submit', (event) => {
		event.preventDefault();
	if (signUpPasswordInput && signUpConfirmPasswordInput)
	{
		if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value)
		{
			alert('les mots de passe sont pas bon');
			return ;
		}
		window.location.href = "../../index.html";
	}
		
	})
}

const signinform = document.getElementById('sign-in') as HTMLFormElement;

if (signinform)
{
	signinform.addEventListener('submit', (event) => {
		event.preventDefault();
			window.location.href = "../../index.html";
	});
}

