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

const togglePassword = document.getElementById('togglePassword') as HTMLButtonElement | null;
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword') as HTMLButtonElement | null;
const password = document.getElementById('password') as HTMLInputElement | null;

const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement | null;
const eyeIcon = document.getElementById('eyeIcon') as HTMLImageElement | null;
const eyeIconConfirm = document.getElementById('eyeIconConfirm') as HTMLImageElement | null;

const passwordSignUp = document.getElementById('passwordSignUp') as HTMLInputElement | null;
const togglePasswordSignUp = document.getElementById('togglePasswordSignUp') as HTMLImageElement | null;
const eyeIconSignUp = document.getElementById('eyeIconSignUp') as HTMLImageElement | null;

if (togglePassword && password && eyeIcon) {
	togglePassword.addEventListener('click', () =>
	{
		const isVisible = password.type === 'text';
		password.type = isVisible ? 'password' : 'text';
		eyeIcon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

if (toggleConfirmPassword && confirmPassword && eyeIconConfirm) {
	toggleConfirmPassword.addEventListener('click', () => 
	{
		const isVisible = confirmPassword.type === 'text';
		confirmPassword.type = isVisible ? 'password' : 'text';
		eyeIconConfirm.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

if (togglePasswordSignUp && passwordSignUp && eyeIconSignUp) {
	togglePasswordSignUp.addEventListener('click', () => 
	{
		const isVisible = passwordSignUp.type === 'text';
		passwordSignUp.type = isVisible ? 'password' : 'text';
		eyeIconSignUp.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
	});
}

const badPasswordIcon = document.getElementById('badPasswordIcon') as HTMLImageElement | null;
const goodPasswordIcon = document.getElementById('goodPasswordIcon') as HTMLImageElement | null;
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon') as HTMLImageElement | null;
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon') as HTMLImageElement | null;

function checkPasswordMatch() {

	if (passwordSignUp && confirmPassword && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon)
	{
		if (confirmPassword.value === "" && passwordSignUp.value === "")
		{
			badConfirmPasswordIcon.classList.add('hidden');
			badPasswordIcon.classList.add('hidden');
			goodConfirmPasswordIcon.classList.add('hidden');
			goodPasswordIcon.classList.add('hidden');
			return ;
		}
		else if (passwordSignUp.value === confirmPassword.value)
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

if (passwordSignUp && confirmPassword)
{
	passwordSignUp.addEventListener('input', checkPasswordMatch);
	confirmPassword.addEventListener('input', checkPasswordMatch);
}

const signUpbtn = document.getElementById('signUp-btn')as HTMLButtonElement | null;
const usernameinput = document.getElementById('username-input') as HTMLInputElement | null;
const emailinput = document.getElementById('email-input') as HTMLInputElement | null;

function checkSignUpbtn() {

	if (signUpbtn && emailinput && usernameinput && passwordSignUp && confirmPassword && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon)
		{
			if (emailinput.value === "" && usernameinput.value === "" && confirmPassword.value === "" && passwordSignUp.value === "")
			{
				signUpbtn.disabled = true;
				alert("Un champs n'est pas remplie");
			}
			else if (passwordSignUp.value !== confirmPassword.value)
			{
				signUpbtn.disabled = true;
				alert("les mots de passe ne sont pas les meme");
			}
			else
			{
				alert("tous est good");
				signUpbtn.disabled = false;
			}
	
	}
}

if (signUpbtn){
	signUpbtn.disabled = false;
	signUpbtn.addEventListener("click", checkSignUpbtn);
}