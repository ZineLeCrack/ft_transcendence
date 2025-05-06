"use strict";
const signIn = document.getElementById('sign-in');
const signUp = document.getElementById('sign-up');
const toSignUp = document.getElementById('to-sign-up');
const toSignIn = document.getElementById('to-sign-in');
toSignUp.addEventListener('click', () => {
    signIn.classList.add('hidden');
    signUp.classList.remove('hidden');
});
toSignIn.addEventListener('click', () => {
    signUp.classList.add('hidden');
    signIn.classList.remove('hidden');
});
const signinusernamediv = document.getElementById('sign-in-username-div');
const signinemaildiv = document.getElementById('sign-in-email-div');
const signinwithemail = document.getElementById('sign-in-with-email');
const signinwithUsername = document.getElementById('sign-in-with-Username');
const signinusernameinput = document.getElementById('Sign-in-username');
const signinemailinput = document.getElementById('Sign-in-email');
signinwithUsername.addEventListener('click', () => {
    signinemaildiv.classList.add('hidden');
    signinusernamediv.classList.remove('hidden');
    signinemailinput.required = false;
    signinusernameinput.required = true;
});
signinwithemail.addEventListener('click', () => {
    signinusernamediv.classList.add('hidden');
    signinemaildiv.classList.remove('hidden');
    signinusernameinput.required = false;
    signinemailinput.required = true;
});
const signinpasswordinput = document.getElementById('sign-in-password-input');
const signinpasswordbtn = document.getElementById('sign-in-password-btn');
const signinpasswordicon = document.getElementById('sign-in-password-icon');
const signuppasswordinput = document.getElementById('sign-up-password-input');
const signuppasswordbtn = document.getElementById('sign-up-password-btn');
const signuppasswordicon = document.getElementById('sign-up-password-icon');
const signupconfirmpasswordinput = document.getElementById('sign-up-confirmpassword-input');
const signupconfirmpasswordbtn = document.getElementById('sign-up-confirmpassword-btn');
const signupconfirmpasswordicon = document.getElementById('sign-up-confirmpassword-icon');
if (signinpasswordinput && signinpasswordbtn && signinpasswordicon) {
    signinpasswordbtn.addEventListener('click', () => {
        const isVisible = signinpasswordinput.type === 'text';
        signinpasswordinput.type = isVisible ? 'password' : 'text';
        signinpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (signuppasswordinput && signuppasswordbtn && signuppasswordicon) {
    signuppasswordbtn.addEventListener('click', () => {
        const isVisible = signuppasswordinput.type === 'text';
        signuppasswordinput.type = isVisible ? 'password' : 'text';
        signuppasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (signupconfirmpasswordinput && signupconfirmpasswordbtn && signupconfirmpasswordicon) {
    signupconfirmpasswordbtn.addEventListener('click', () => {
        const isVisible = signupconfirmpasswordinput.type === 'text';
        signupconfirmpasswordinput.type = isVisible ? 'password' : 'text';
        signupconfirmpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
const badPasswordIcon = document.getElementById('badPasswordIcon');
const goodPasswordIcon = document.getElementById('goodPasswordIcon');
const badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
const goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
function checkPasswordMatch() {
    if (signuppasswordinput && signupconfirmpasswordinput && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon) {
        if (signupconfirmpasswordinput.value === "" && signuppasswordinput.value === "") {
            badConfirmPasswordIcon.classList.add('hidden');
            badPasswordIcon.classList.add('hidden');
            goodConfirmPasswordIcon.classList.add('hidden');
            goodPasswordIcon.classList.add('hidden');
            return;
        }
        else if (signuppasswordinput.value === signupconfirmpasswordinput.value) {
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
if (signuppasswordinput && signupconfirmpasswordinput) {
    signuppasswordinput.addEventListener('input', checkPasswordMatch);
    signupconfirmpasswordinput.addEventListener('input', checkPasswordMatch);
}
const signupform = document.getElementById('sign-up');
if (signupform) {
    signupform.addEventListener('submit', (event) => {
        event.preventDefault();
        if (signuppasswordinput && signupconfirmpasswordinput) {
            if (signuppasswordinput.value !== signupconfirmpasswordinput.value) {
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
