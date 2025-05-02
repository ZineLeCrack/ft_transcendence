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
        eyeIconSignUp.src = isVisible ? '../images/cacher.svg' : '../images/content.svg'; // Change l'image
    });
}
