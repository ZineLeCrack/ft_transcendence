var signIn = document.getElementById('sign-in');
var signUp = document.getElementById('sign-up');
var toSignUp = document.getElementById('to-sign-up');
var toSignIn = document.getElementById('to-sign-in');
toSignUp.addEventListener('click', function () {
    signIn.classList.add('hidden');
    signUp.classList.remove('hidden');
});
toSignIn.addEventListener('click', function () {
    signUp.classList.add('hidden');
    signIn.classList.remove('hidden');
});
var signInUsernameDiv = document.getElementById('sign-in-username-div');
var signInEmailDiv = document.getElementById('sign-in-email-div');
var signInWithEmail = document.getElementById('sign-in-with-email');
var signInWithUsername = document.getElementById('sign-in-with-Username');
var signInUsernameInput = document.getElementById('Sign-in-username');
var signInEmailInput = document.getElementById('Sign-in-email');
signInWithUsername.addEventListener('click', function () {
    signInEmailDiv.classList.add('hidden');
    signInUsernameDiv.classList.remove('hidden');
    signInEmailInput.required = false;
    signInUsernameInput.required = true;
});
signInWithEmail.addEventListener('click', function () {
    signInUsernameDiv.classList.add('hidden');
    signInEmailDiv.classList.remove('hidden');
    signInUsernameInput.required = false;
    signInEmailInput.required = true;
});
var signInPasswordInput = document.getElementById('sign-in-password-input');
var signInPasswordBtn = document.getElementById('sign-in-password-btn');
var signInPasswordIcon = document.getElementById('sign-in-password-icon');
var signUpPasswordInput = document.getElementById('sign-up-password-input');
var signUpPasswordBtn = document.getElementById('sign-up-password-btn');
var signUpPasswordIcon = document.getElementById('sign-up-password-icon');
var signUpConfirmPasswordInput = document.getElementById('sign-up-confirmpassword-input');
var signUpConfirmPasswordBtn = document.getElementById('sign-up-confirmpassword-btn');
var signUpConfirmPasswordIcon = document.getElementById('sign-up-confirmpassword-icon');
//importer togglepassword : import { togglepassword } from '?';
// if (signInPasswordInput && signInPasswordBtn && signInPasswordIcon) {
// 	togglepassword(signInPasswordInput, signInPasswordBtn, signInPasswordIcon);
// }
if (signUpPasswordInput && signUpPasswordBtn && signUpPasswordIcon) {
    signUpPasswordBtn.addEventListener('click', function () {
        var isVisible = signUpPasswordInput.type === 'text';
        signUpPasswordInput.type = isVisible ? 'password' : 'text';
        signUpPasswordIcon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (signUpConfirmPasswordInput && signUpConfirmPasswordBtn && signUpConfirmPasswordIcon) {
    signUpConfirmPasswordBtn.addEventListener('click', function () {
        var isVisible = signUpConfirmPasswordInput.type === 'text';
        signUpConfirmPasswordInput.type = isVisible ? 'password' : 'text';
        signUpConfirmPasswordIcon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
var badPasswordIcon = document.getElementById('badPasswordIcon');
var goodPasswordIcon = document.getElementById('goodPasswordIcon');
var badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
var goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
//refaire fonction pour qu'elle soit utilisable partout
function checkPasswordMatch() {
    if (signUpPasswordInput && signUpConfirmPasswordInput && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon) {
        if (signUpConfirmPasswordInput.value === "" && signUpPasswordInput.value === "") {
            badConfirmPasswordIcon.classList.add('hidden');
            badPasswordIcon.classList.add('hidden');
            goodConfirmPasswordIcon.classList.add('hidden');
            goodPasswordIcon.classList.add('hidden');
            return;
        }
        else if (signUpPasswordInput.value === signUpConfirmPasswordInput.value) {
            badConfirmPasswordIcon.classList.add('hidden');
            badPasswordIcon.classList.add('hidden');
            goodConfirmPasswordIcon.classList.remove('hidden');
            goodPasswordIcon.classList.remove('hidden');
        }
        else {
            goodConfirmPasswordIcon.classList.add('hidden');
            goodPasswordIcon.classList.add('hidden');
            badConfirmPasswordIcon.classList.remove('hidden');
            badPasswordIcon.classList.remove('hidden');
        }
    }
}
if (signUpPasswordInput && signUpConfirmPasswordInput) {
    signUpPasswordInput.addEventListener('input', checkPasswordMatch);
    signUpConfirmPasswordInput.addEventListener('input', checkPasswordMatch);
}
var signupform = document.getElementById('sign-up');
if (signupform) {
    signupform.addEventListener('submit', function (event) {
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
var signinform = document.getElementById('sign-in');
if (signinform) {
    signinform.addEventListener('submit', function (event) {
        event.preventDefault();
        window.location.href = "../../index.html";
    });
}
