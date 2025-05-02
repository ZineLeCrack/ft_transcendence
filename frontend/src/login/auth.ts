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
  togglePassword.addEventListener('click', () => {
    const isVisible = password.type === 'text';
    password.type = isVisible ? 'password' : 'text';
    eyeIcon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
  });
}

if (toggleConfirmPassword && confirmPassword && eyeIconConfirm) {
  toggleConfirmPassword.addEventListener('click', () => {
    const isVisible = confirmPassword.type === 'text';
    confirmPassword.type = isVisible ? 'password' : 'text';
    eyeIconConfirm.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
  });
}

if (togglePasswordSignUp && passwordSignUp && eyeIconSignUp) {
	togglePasswordSignUp.addEventListener('click', () => {
	  const isVisible = passwordSignUp.type === 'text';
	  passwordSignUp.type = isVisible ? 'password' : 'text';
	  eyeIconSignUp.src = isVisible ? '../images/cacher.svg' : '../images/content.svg'; // Change l'image
	});
}