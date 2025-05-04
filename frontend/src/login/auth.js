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
var togglePassword = document.getElementById('togglePassword');
var toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
var password = document.getElementById('password');
var confirmPassword = document.getElementById('confirmPassword');
var eyeIcon = document.getElementById('eyeIcon');
var eyeIconConfirm = document.getElementById('eyeIconConfirm');
var passwordSignUp = document.getElementById('passwordSignUp');
var togglePasswordSignUp = document.getElementById('togglePasswordSignUp');
var eyeIconSignUp = document.getElementById('eyeIconSignUp');
if (togglePassword && password && eyeIcon) {
    togglePassword.addEventListener('click', function () {
        var isVisible = password.type === 'text';
        password.type = isVisible ? 'password' : 'text';
        eyeIcon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (toggleConfirmPassword && confirmPassword && eyeIconConfirm) {
    toggleConfirmPassword.addEventListener('click', function () {
        var isVisible = confirmPassword.type === 'text';
        confirmPassword.type = isVisible ? 'password' : 'text';
        eyeIconConfirm.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
if (togglePasswordSignUp && passwordSignUp && eyeIconSignUp) {
    togglePasswordSignUp.addEventListener('click', function () {
        var isVisible = passwordSignUp.type === 'text';
        passwordSignUp.type = isVisible ? 'password' : 'text';
        eyeIconSignUp.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
var badPasswordIcon = document.getElementById('badPasswordIcon');
var goodPasswordIcon = document.getElementById('goodPasswordIcon');
var badConfirmPasswordIcon = document.getElementById('badConfirmPasswordIcon');
var goodConfirmPasswordIcon = document.getElementById('goodConfirmPasswordIcon');
function checkPasswordMatch() {
    if (passwordSignUp && confirmPassword && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon) {
        if (confirmPassword.value === "" && passwordSignUp.value === "") {
            badConfirmPasswordIcon.classList.add('hidden');
            badPasswordIcon.classList.add('hidden');
            goodConfirmPasswordIcon.classList.add('hidden');
            goodPasswordIcon.classList.add('hidden');
            return;
        }
        else if (passwordSignUp.value === confirmPassword.value) {
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
if (passwordSignUp && confirmPassword) {
    passwordSignUp.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);
}
var signUpbtn = document.getElementById('signUp-btn');
var usernameinput = document.getElementById('username-input');
var emailinput = document.getElementById('email-input');
function checkSignUpbtn() {
    if (signUpbtn && emailinput && usernameinput && passwordSignUp && confirmPassword && badPasswordIcon && goodPasswordIcon && badConfirmPasswordIcon && goodConfirmPasswordIcon) {
        if (emailinput.value === "" && usernameinput.value === "" && confirmPassword.value === "" && passwordSignUp.value === "") {
            signUpbtn.disabled = true;
            alert("Un champs n'est pas remplie");
        }
        else if (passwordSignUp.value !== confirmPassword.value) {
            signUpbtn.disabled = true;
            alert("les mots de passe ne sont pas les meme");
        }
        else {
            alert("tous est good");
            signUpbtn.disabled = false;
        }
    }
}
if (signUpbtn) {
    signUpbtn.disabled = false;
    signUpbtn.addEventListener("click", checkSignUpbtn);
}
