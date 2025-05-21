var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { togglePassword, checkPasswordMatch, hidePassword } from '../profile/utils.js';
// Elements de navigation
const signIn = document.getElementById('sign-in');
const signUp = document.getElementById('sign-up');
const toSignUp = document.getElementById('to-sign-up');
const toSignIn = document.getElementById('to-sign-in');
// Champs mots de passe
const signInPasswordInput = document.getElementById('sign-in-password-input');
const signInPasswordBtn = document.getElementById('sign-in-password-btn');
const signInPasswordIcon = document.getElementById('sign-in-password-icon');
const signUpPasswordInput = document.getElementById('sign-up-password-input');
const signUpPasswordBtn = document.getElementById('sign-up-password-btn');
const signUpPasswordIcon = document.getElementById('sign-up-password-icon');
const signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input');
const signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn');
const signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon');
const badPasswordIcon = document.getElementById('badPasswordIcon');
const goodPasswordIcon = document.getElementById('goodPasswordIcon');
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
toSignUp.addEventListener('click', () => {
    signIn.classList.add('hidden');
    signUp.classList.remove('hidden');
    hidePassword(signInPasswordInput, signInPasswordIcon, null, null);
});
toSignIn.addEventListener('click', () => {
    signUp.classList.add('hidden');
    signIn.classList.remove('hidden');
    hidePassword(signUpPasswordInput, signUpPasswordIcon, goodPasswordIcon, badPasswordIcon);
    hidePassword(signUpConfirmPasswordInput, signUpConfirmPasswordIcon, goodConfirmPasswordIcon, badConfirmPasswordIcon);
});
// Switch entre email / username
const signInUsernameDiv = document.getElementById('sign-in-username-div');
const signInEmailDiv = document.getElementById('sign-in-email-div');
const signInWithEmail = document.getElementById('sign-in-with-email');
const signInWithUsername = document.getElementById('sign-in-with-Username');
const signInUsernameInput = document.getElementById('Sign-in-username');
const signInEmailInput = document.getElementById('Sign-In-email');
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
// Affichage mot de passe
togglePassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);
togglePassword(signUpPasswordInput, signUpPasswordBtn, signUpPasswordIcon);
togglePassword(signUpConfirmPasswordInput, signUpConfirmPasswordBtn, signUpConfirmPasswordIcon);
// Vérification des mots de passe en temps réel
signUpPasswordInput.addEventListener('input', () => {
    checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon);
});
signUpConfirmPasswordInput.addEventListener('input', () => {
    checkPasswordMatch(signUpPasswordInput, signUpConfirmPasswordInput, badPasswordIcon, badConfirmPasswordIcon, goodPasswordIcon, goodConfirmPasswordIcon);
});
// Soumission du formulaire d'inscription
const signupform = document.getElementById('sign-up');
signupform === null || signupform === void 0 ? void 0 : signupform.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (signUpPasswordInput.value !== signUpConfirmPasswordInput.value) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    const usernameInput = document.getElementById('sign-up-username');
    const emailInput = document.getElementById('sign-up-email');
    const userData = {
        username: usernameInput.value,
        email: emailInput.value,
        password: signUpPasswordInput.value,
    };
    try {
        const response = yield fetch('https://10.12.200.87:3451/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(error || 'Erreur lors de l\'inscription');
        }
        // alert('Inscription réussie !');
        window.location.href = "login.html";
    }
    catch (err) {
        alert('Erreur : ' + err.message);
    }
}));
const signinform = document.getElementById('sign-in');
signinform === null || signinform === void 0 ? void 0 : signinform.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const userData = {
        required: signInEmailInput.required ? "email" : "name",
        login: signInEmailInput.required ? signInEmailInput.value : signInUsernameInput.value,
        password: signInPasswordInput.value
    };
    try {
        const response = yield fetch('https://10.12.200.87:3451/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(error || 'Erreur lors de la connection');
        }
        const data = yield response.json();
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        window.location.href = "../../index.html";
    }
    catch (err) {
        console.log('Erreur : ' + err.message);
    }
}));
