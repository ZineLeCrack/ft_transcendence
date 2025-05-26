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
    secondBtn.classList.remove('bg-[#00FFFF]');
    secondBtn.classList.remove('shadow-[0_0_10px_#00FFFF]');
    firstBtn.classList.remove('bg-gray-200');
    firstBtn.classList.add('bg-[#00FFFF]');
    firstBtn.classList.add('text-black');
    firstBtn.classList.remove('text-gray-700');
    firstBtn.classList.add('shadow-[0_0_10px_#00FFFF]');
    secondBtn.classList.remove('text-black');
    secondBtn.classList.add('text-gray-700');
    secondBtn.classList.remove('hover:brightness-125');
    secondBtn.classList.add('hover:bg-gray-300');
    firstBtn.classList.remove('hover:bg-gray-300');
    firstBtn.classList.add('hover:brightness-125');
    secondDiv.classList.add('hidden');
    firstDiv.classList.remove('hidden');
    if (thirdBtn && thirdDiv) {
        thirdDiv.classList.add('hidden');
        thirdBtn.classList.remove('text-black');
        thirdBtn.classList.add('text-gray-700');
        thirdBtn.classList.remove('hover:brightness-125');
        thirdBtn.classList.add('hover:bg-gray-300');
        thirdBtn.classList.add('bg-gray-200');
        thirdBtn.classList.remove('bg-[#00FFFF]');
        thirdBtn.classList.remove('shadow-[0_0_10px_#00FFFF]');
    }
}
