export function togglePassword(Input, Btn, Icon) {
    Btn.addEventListener('click', () => {
        const isVisible = Input.type === 'text';
        Input.type = isVisible ? 'password' : 'text';
        Icon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
export function hidePassword(Input, Icon) {
    Input.type = 'password';
    Icon.src = '../images/cacher.svg';
}
export function checkPasswordMatch(firstPassword, secondPassword, badFirstPasswordIcon, badSecondPasswordIcon, goodFirstPasswordIcon, goodSecondPasswordIcon) {
    if (firstPassword && secondPassword && badFirstPasswordIcon && badSecondPasswordIcon && goodFirstPasswordIcon && goodSecondPasswordIcon) {
        if (firstPassword.value === "" && secondPassword.value === "") {
            badSecondPasswordIcon.classList.add('hidden');
            goodFirstPasswordIcon.classList.add('hidden');
            badFirstPasswordIcon.classList.add('hidden');
            goodSecondPasswordIcon.classList.add('hidden');
            return;
        }
        else if (firstPassword.value === secondPassword.value) {
            badSecondPasswordIcon.classList.add('hidden');
            badFirstPasswordIcon.classList.add('hidden');
            goodSecondPasswordIcon.classList.remove('hidden');
            goodFirstPasswordIcon.classList.remove('hidden');
        }
        else {
            goodFirstPasswordIcon.classList.add('hidden');
            goodSecondPasswordIcon.classList.add('hidden');
            badSecondPasswordIcon.classList.remove('hidden');
            badFirstPasswordIcon.classList.remove('hidden');
        }
    }
}
