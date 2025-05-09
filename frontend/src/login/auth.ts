import { togglepassword } from '../profile/profile';


const signIn = document.getElementById('sign-in') as HTMLElement;
const signUp = document.getElementById('sign-up') as HTMLElement;
const toSignUp = document.getElementById('to-sign-up') as HTMLElement;
const toSignIn = document.getElementById('to-sign-in') as HTMLElement;

toSignUp.addEventListener('click', () => {
	signIn.classList.add('hidden');
	signUp.classList.remove('hidden');
});

toSignIn.addEventListener('click', () => {
	signUp.classList.add('hidden');
	signIn.classList.remove('hidden');
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
	signInEmailInput.required = false;
	signInUsernameInput.required = true;
	
});

signInWithEmail.addEventListener('click', () => {
	signInUsernameDiv.classList.add('hidden');
	signInEmailDiv.classList.remove('hidden');
	signInUsernameInput.required = false;
	signInEmailInput.required = true;
});


const signInPasswordInput = document.getElementById('sign-in-password-input') as HTMLInputElement | null;
const signInPasswordBtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement | null;
const signInPasswordIcon = document.getElementById('sign-in-password-icon') as HTMLImageElement | null;

const signUpPasswordInput = document.getElementById('sign-up-password-input') as HTMLInputElement | null;
const signUpPasswordBtn = document.getElementById('sign-up-password-btn') as HTMLButtonElement | null;
const signUpPasswordIcon = document.getElementById('sign-up-password-icon') as HTMLImageElement | null;

const signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input') as HTMLInputElement | null;
const signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn') as HTMLButtonElement | null;
const signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon') as HTMLImageElement | null;



if (signInPasswordInput && signInPasswordBtn && signInPasswordIcon) {
	togglepassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);
}

if (signUpPasswordInput && signUpPasswordBtn && signUpPasswordIcon) {
	togglepassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
}

if (signUpConfirmPasswordInput && signUpConfirmPasswordBtn && signUpConfirmPasswordIcon) {
	togglepassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);
}

const badPasswordIcon = document.getElementById('badPasswordIcon') as HTMLImageElement | null;
const goodPasswordIcon = document.getElementById('goodPasswordIcon') as HTMLImageElement | null;
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon') as HTMLImageElement | null;
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon') as HTMLImageElement | null;

//refaire fonction pour qu'elle soit utilisable partout
function checkPasswordMatch() {

	if (signUpPasswordInput && signUpConfirmPasswordInput && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon)
	{
		if (signUpConfirmPasswordInput.value === "" && signUpPasswordInput.value === "")
		{
			badConfirmPasswordIcon.classList.add('hidden');
			badPasswordIcon.classList.add('hidden');
			goodConfirmPasswordIcon.classList.add('hidden');
			goodPasswordIcon.classList.add('hidden');
			return ;
		}
		else if (signUpPasswordInput.value === signUpConfirmPasswordInput.value)
		{
			badConfirmPasswordIcon.classList.add('hidden');
			badPasswordIcon.classList.add('hidden');
			goodConfirmPasswordIcon.classList.remove('hidden');
			goodPasswordIcon.classList.remove('hidden');
		}
		else
		{
			goodConfirmPasswordIcon.classList.add('hidden');
			goodPasswordIcon.classList.add('hidden');
			badConfirmPasswordIcon.classList.remove('hidden');
			badPasswordIcon.classList.remove('hidden');
		}

	}
}

if (signUpPasswordInput && signUpConfirmPasswordInput)
{
	signUpPasswordInput.addEventListener('input', checkPasswordMatch);
	signUpConfirmPasswordInput.addEventListener('input', checkPasswordMatch);
}

const signupform = document.getElementById('sign-up') as HTMLFormElement | null;

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

const signinform = document.getElementById('sign-in') as HTMLFormElement | null;

if (signinform)
{
	signinform.addEventListener('submit', (event) => {
		event.preventDefault();
			window.location.href = "../../index.html";
	});
}

