import { togglePassword, checkPasswordMatch, hidePassword } from '../profile/utils.js';
const signIn = document.getElementById('sign-in');
const signUp = document.getElementById('sign-up');
const toSignUp = document.getElementById('to-sign-up');
const toSignIn = document.getElementById('to-sign-in');
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
const signInUsernameDiv = document.getElementById('sign-in-username-div');
const signInEmailDiv = document.getElementById('sign-in-email-div');
const signInWithEmail = document.getElementById('sign-in-with-email');
const signInWithUsername = document.getElementById('sign-in-with-Username');
const signInUsernameInput = document.getElementById('Sign-in-username');
const signInEmailInput = document.getElementById('Sign-in-email');
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
const signInPasswordInput = document.getElementById('sign-in-password-input');
const signInPasswordBtn = document.getElementById('sign-in-password-btn');
const signInPasswordIcon = document.getElementById('sign-in-password-icon');
const signUpPasswordInput = document.getElementById('sign-up-password-input');
const signUpPasswordBtn = document.getElementById('sign-up-password-btn');
const signUpPasswordIcon = document.getElementById('sign-up-password-icon');
const signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input');
const signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn');
const signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon');
if (signInPasswordInput && signInPasswordBtn && signInPasswordIcon) {
    togglePassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);
}
if (signUpPasswordInput && signUpPasswordBtn && signUpPasswordIcon) {
    togglePassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
}
if (signUpConfirmPasswordInput && signUpConfirmPasswordBtn && signUpConfirmPasswordIcon) {
    togglePassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);
}
const badPasswordIcon = document.getElementById('badPasswordIcon');
const goodPasswordIcon = document.getElementById('goodPasswordIcon');
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
if (signUpPasswordInput && signUpConfirmPasswordInput) {
    signUpPasswordInput.addEventListener('input', () => { checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon); });
    signUpConfirmPasswordInput.addEventListener('input', () => { checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon); });
}
const signupform = document.getElementById('sign-up');
if (signupform) {
    signupform.addEventListener('submit', (event) => {
        event.preventDefault();
        if (signUpPasswordInput && signUpConfirmPasswordInput) {
            if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value) {
                alert('les mots de passe sont pas bon');
                return;
            }
            window.location.href = "../../index.html";
        }
    });
}
const signinform = document.getElementById('sign-in');
if (signinform) {
    signinform.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.href = "../../index.html";
    });
}
