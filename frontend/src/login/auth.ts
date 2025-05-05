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


const signinusernamediv = document.getElementById('sign-in-username-div') as HTMLElement;
const signinemaildiv = document.getElementById('sign-in-email-div') as HTMLElement;
const signinwithemail = document.getElementById('sign-in-with-email') as HTMLElement;
const signinwithUsername = document.getElementById('sign-in-with-Username') as HTMLElement;

signinwithUsername.addEventListener('click', () => {
	signinemaildiv.classList.add('hidden');
	signinusernamediv.classList.remove('hidden');
});

signinwithemail.addEventListener('click', () => {
	signinusernamediv.classList.add('hidden');
	signinemaildiv.classList.remove('hidden');
});


const signinpasswordinput = document.getElementById('sign-in-password-input') as HTMLInputElement | null;
const signinpasswordbtn = document.getElementById('sign-in-password-btn') as HTMLButtonElement | null;
const signinpasswordicon = document.getElementById('sign-in-password-icon') as HTMLImageElement | null;

const signuppasswordinput = document.getElementById('sign-up-password-input') as HTMLInputElement | null;
const signuppasswordbtn = document.getElementById('sign-up-password-btn') as HTMLButtonElement | null;
const signuppasswordicon = document.getElementById('sign-up-password-icon') as HTMLImageElement | null;

const signupconfirmpasswordinput = document.getElementById('sign-up-confirmpassword-input') as HTMLInputElement | null;
const signupconfirmpasswordbtn = document.getElementById('sign-up-confirmpassword-btn') as HTMLButtonElement | null;
const signupconfirmpasswordicon = document.getElementById('sign-up-confirmpassword-icon') as HTMLImageElement | null;

if (signinpasswordinput && signinpasswordbtn && signinpasswordicon) {
	signinpasswordbtn.addEventListener('click', () =>
	{
		const isVisible = signinpasswordinput.type === 'text';
		signinpasswordinput.type = isVisible ? 'password' : 'text';
		signinpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

if (signuppasswordinput && signuppasswordbtn && signuppasswordicon) {
	signuppasswordbtn.addEventListener('click', () => 
	{
		const isVisible = signuppasswordinput.type === 'text';
		signuppasswordinput.type = isVisible ? 'password' : 'text';
		signuppasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

if (signupconfirmpasswordinput && signupconfirmpasswordbtn && signupconfirmpasswordicon) {
	signupconfirmpasswordbtn.addEventListener('click', () => 
	{
		const isVisible = signupconfirmpasswordinput.type === 'text';
		signupconfirmpasswordinput.type = isVisible ? 'password' : 'text';
		signupconfirmpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

const badPasswordIcon = document.getElementById('badPasswordIcon') as HTMLImageElement | null;
const goodPasswordIcon = document.getElementById('goodPasswordIcon') as HTMLImageElement | null;
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon') as HTMLImageElement | null;
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon') as HTMLImageElement | null;

function checkPasswordMatch() {

	if (signuppasswordinput && signupconfirmpasswordinput && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon)
	{
		if (signupconfirmpasswordinput.value === "" && signuppasswordinput.value === "")
		{
			badConfirmPasswordIcon.classList.add('hidden');
			badPasswordIcon.classList.add('hidden');
			goodConfirmPasswordIcon.classList.add('hidden');
			goodPasswordIcon.classList.add('hidden');
			return ;
		}
		else if (signuppasswordinput.value === signupconfirmpasswordinput.value)
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

if (signuppasswordinput && signupconfirmpasswordinput)
{
	signuppasswordinput.addEventListener('input', checkPasswordMatch);
	signupconfirmpasswordinput.addEventListener('input', checkPasswordMatch);
}

const signUpbtn = document.getElementById('signUp-btn')as HTMLButtonElement | null;
const usernameinput = document.getElementById('username-input') as HTMLInputElement | null;
const emailinput = document.getElementById('email-input') as HTMLInputElement | null;
const signupform = document.getElementById('sign-up') as HTMLFormElement | null;

if (signupform)
{
	signupform.addEventListener('submit', (event) => {
		event.preventDefault();
	if (signuppasswordinput && signupconfirmpasswordinput)
	{
		if (signuppasswordinput.value !== signupconfirmpasswordinput.value)
		{
			alert('les mots de passe sont pas bon');
			return ;
		}
		window.location.href = "../../index.html";
	}
		
	})
}