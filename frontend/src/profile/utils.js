export function togglePassword(Input, Btn, Icon) {
    Btn.addEventListener('click', () => {
        const isVisible = Input.type === 'text';
        Input.type = isVisible ? 'password' : 'text';
        Icon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
export function hidePassword(Input, Icon, IconGood, IconBad) {
    Input.type = 'password';
    Icon.src = '../images/cacher.svg';
    if (IconGood)
        IconGood.classList.add('hidden');
    if (IconBad)
        IconBad.classList.add('hidden');
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
export function setButton(firstBtn, secondBtn, thirdBtn, firstDiv, secondDiv, thirdDiv, state, firstKey, secondKey, thirdKey) {
    if (state[firstKey])
        return;
    state[firstKey] = true;
    state[secondKey] = false;
    state[thirdKey] = false;
    secondBtn.classList.add('bg-gray-200');
    secondBtn.classList.remove('bg-blue-600');
    firstBtn.classList.remove('bg-gray-200');
    firstBtn.classList.add('bg-blue-500');
    firstBtn.classList.add('text-white');
    firstBtn.classList.remove('text-gray-700');
    secondBtn.classList.remove('text-white');
    secondBtn.classList.add('text-gray-700');
    secondBtn.classList.remove('hover:bg-blue-700');
    secondBtn.classList.add('hover:bg-gray-300');
    firstBtn.classList.remove('hover:bg-gray-300');
    firstBtn.classList.add('hover:bg-blue-700');
    secondDiv.classList.add('hidden');
    firstDiv.classList.remove('hidden');
    if (thirdBtn && thirdDiv) {
        thirdDiv.classList.add('hidden');
        thirdBtn.classList.remove('text-white');
        thirdBtn.classList.add('text-gray-700');
        thirdBtn.classList.remove('hover:bg-blue-700');
        thirdBtn.classList.add('hover:bg-gray-300');
        thirdBtn.classList.add('bg-gray-200');
        thirdBtn.classList.remove('bg-blue-600');
    }
}
