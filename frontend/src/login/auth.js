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
var signinusernamediv = document.getElementById('sign-in-username-div');
var signinemaildiv = document.getElementById('sign-in-email-div');
var signinwithemail = document.getElementById('sign-in-with-email');
var signinwithUsername = document.getElementById('sign-in-with-Username');
signinwithUsername.addEventListener('click', function () {
    signinemaildiv.classList.add('hidden');
    signinusernamediv.classList.remove('hidden');
});
signinwithemail.addEventListener('click', function () {
    signinusernamediv.classList.add('hidden');
    signinemaildiv.classList.remove('hidden');
});
var signinpasswordinput = document.getElementById('sign-in-password-input');
var signinpasswordbtn = document.getElementById('sign-in-password-btn');
var signinpasswordicon = document.getElementById('sign-in-password-icon');
var signuppasswordinput = document.getElementById('sign-up-password-input');
var signuppasswordbtn = document.getElementById('sign-up-password-btn');
var signuppasswordicon = document.getElementById('sign-up-password-icon');
var signupconfirmpasswordinput = document.getElementById('sign-up-confirmpassword-input');
var signupconfirmpasswordbtn = document.getElementById('sign-up-confirmpassword-btn');
var signupconfirmpasswordicon = document.getElementById('sign-up-confirmpassword-icon');
if (signinpasswordinput && signinpasswordbtn && signinpasswordicon) {
    signinpasswordbtn.addEventListener('click', function () {
        var isVisible = signinpasswordinput.type === 'text';
        signinpasswordinput.type = isVisible ? 'password' : 'text';
        signinpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (signuppasswordinput && signuppasswordbtn && signuppasswordicon) {
    signuppasswordbtn.addEventListener('click', function () {
        var isVisible = signuppasswordinput.type === 'text';
        signuppasswordinput.type = isVisible ? 'password' : 'text';
        signuppasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (signupconfirmpasswordinput && signupconfirmpasswordbtn && signupconfirmpasswordicon) {
    signupconfirmpasswordbtn.addEventListener('click', function () {
        var isVisible = signupconfirmpasswordinput.type === 'text';
        signupconfirmpasswordinput.type = isVisible ? 'password' : 'text';
        signupconfirmpasswordicon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
var badPasswordIcon = document.getElementById('badPasswordIcon');
var goodPasswordIcon = document.getElementById('goodPasswordIcon');
var badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
var goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
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
var signUpbtn = document.getElementById('signUp-btn');
var usernameinput = document.getElementById('username-input');
var emailinput = document.getElementById('email-input');
var signupform = document.getElementById('sign-up');
if (signupform) {
    signupform.addEventListener('submit', function (event) {
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
