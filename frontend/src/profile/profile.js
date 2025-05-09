"use strict";
exports.__esModule = true;
exports.togglepassword = void 0;
var editBtn = document.getElementById('edit-btn');
var statsBtn = document.getElementById('stats-btn');
var statsForm = document.getElementById('stats-form');
var editProfilForm = document.getElementById('edit-profil-form');
var editBtnIsActive = false;
var statsBtnIsActive = true;
editBtn.addEventListener('click', function () {
    if (editBtnIsActive)
        return;
    editBtnIsActive = true;
    statsBtnIsActive = false;
    statsBtn.classList.add('bg-gray-200');
    statsBtn.classList.remove('bg-blue-600');
    editBtn.classList.remove('bg-gray-200');
    editBtn.classList.add('bg-blue-500');
    editBtn.classList.add('text-white');
    editBtn.classList.remove('text-gray-700');
    statsBtn.classList.remove('text-white');
    statsBtn.classList.add('text-gray-700');
    statsBtn.classList.remove('hover:bg-blue-700');
    statsBtn.classList.add('hover:bg-gray-300');
    editBtn.classList.remove('hover:bg-gray-300');
    editBtn.classList.add('hover:bg-blue-700');
    statsForm.classList.add('hidden');
    editProfilForm.classList.remove('hidden');
    editPasswordForm.classList.add('hidden');
    editPasswordBtn.classList.remove('hidden');
});
statsBtn.addEventListener('click', function () {
    if (statsBtnIsActive)
        return;
    editBtnIsActive = false;
    statsBtnIsActive = true;
    statsBtn.classList.remove('bg-gray-200');
    statsBtn.classList.add('bg-blue-600');
    editBtn.classList.add('bg-gray-200');
    editBtn.classList.remove('bg-blue-500');
    statsBtn.classList.add('text-white');
    statsBtn.classList.remove('text-gray-700');
    editBtn.classList.remove('text-white');
    editBtn.classList.add('text-gray-700');
    editBtn.classList.remove('hover:bg-blue-700');
    editBtn.classList.add('hover:bg-gray-300');
    statsBtn.classList.remove('hover:bg-gray-300');
    statsBtn.classList.add('hover:bg-blue-700');
    statsForm.classList.remove('hidden');
    editProfilForm.classList.add('hidden');
    editPasswordForm.classList.add('hidden');
    editPasswordBtn.classList.remove('hidden');
    editUsernameInput.value = "";
    editEmailInput.value = "";
    editCurrentPasswordInput.value = "";
    editNewPasswordInput.value = "";
    editConfirmNewPasswordInput.value = "";
});
var editPasswordBtn = document.getElementById('edit-password-btn');
var editPasswordForm = document.getElementById('edit-password-form');
editPasswordBtn.addEventListener('click', function () {
    editProfilForm.classList.add('hidden');
    editPasswordForm.classList.remove('hidden');
    editPasswordBtn.classList.add('hidden');
});
var unsaveBtn = document.getElementById('unsave-btn');
var saveBtn = document.getElementById('save-btn');
var editUsernameInput = document.getElementById('edit-username-input');
var editEmailInput = document.getElementById('edit-email-input');
var editCurrentPasswordInput = document.getElementById('edit-currentpassword-input');
var editNewPasswordInput = document.getElementById('edit-newpassword-input');
var editConfirmNewPasswordInput = document.getElementById('edit-confirmpassword-input');
var unsaveBtnEditPassword = document.getElementById('unsave-btn-edit-password');
unsaveBtn.addEventListener('click', function () {
    editUsernameInput.value = "";
    editEmailInput.value = "";
});
unsaveBtnEditPassword.addEventListener('click', function () {
    editCurrentPasswordInput.value = "";
    editNewPasswordInput.value = "";
    editConfirmNewPasswordInput.value = "";
    editProfilForm.classList.remove('hidden');
    editPasswordForm.classList.add('hidden');
    editPasswordBtn.classList.remove('hidden');
    profileBadConfirmPasswordIcon.classList.add('hidden');
    profileGoodPasswordIcon.classList.add('hidden');
    profileBadPasswordIcon.classList.add('hidden');
    profileGoodConfirmPasswordIcon.classList.add('hidden');
});
var profileBadPasswordIcon = document.getElementById('profile-badPasswordIcon');
var profileGoodPasswordIcon = document.getElementById('profile-goodPasswordIcon');
var profileBadConfirmPasswordIcon = document.getElementById('profile-badConfirmPasswordIcon');
var profileGoodConfirmPasswordIcon = document.getElementById('profile-goodConfirmPasswordIcon');
//fonction a enlever quand checkpassword sera utilisable partout
function checkPasswordMatchinprofile() {
    if (editNewPasswordInput && editConfirmNewPasswordInput && profileBadPasswordIcon && profileGoodPasswordIcon && profileBadConfirmPasswordIcon && profileGoodConfirmPasswordIcon) {
        if (editNewPasswordInput.value === "" && editConfirmNewPasswordInput.value === "") {
            profileBadConfirmPasswordIcon.classList.add('hidden');
            profileGoodPasswordIcon.classList.add('hidden');
            profileBadPasswordIcon.classList.add('hidden');
            profileGoodConfirmPasswordIcon.classList.add('hidden');
            return;
        }
        else if (editNewPasswordInput.value === editConfirmNewPasswordInput.value) {
            profileBadConfirmPasswordIcon.classList.add('hidden');
            profileBadPasswordIcon.classList.add('hidden');
            profileGoodConfirmPasswordIcon.classList.remove('hidden');
            profileGoodPasswordIcon.classList.remove('hidden');
        }
        else {
            profileGoodPasswordIcon.classList.add('hidden');
            profileGoodConfirmPasswordIcon.classList.add('hidden');
            profileBadConfirmPasswordIcon.classList.remove('hidden');
            profileBadPasswordIcon.classList.remove('hidden');
        }
    }
}
var editConfirmPasswordBtn = document.getElementById('edit-confirmpassword-btn');
var editConfirmPasswordIcon = document.getElementById('edit-confirmpassword-icon');
var editNewPasswordBtn = document.getElementById('edit-newpassword-btn');
var editNewPasswordIcon = document.getElementById('edit-newpassword-icon');
var editCurrentPasswordBtn = document.getElementById('edit-currentpassword-btn');
var editCurrentPasswordIcon = document.getElementById('edit-currentpassword-icon');
if (editNewPasswordInput && editConfirmNewPasswordInput) {
    editNewPasswordInput.addEventListener('input', checkPasswordMatchinprofile);
    editConfirmNewPasswordInput.addEventListener('input', checkPasswordMatchinprofile);
}
if (editNewPasswordInput && editNewPasswordBtn && editNewPasswordIcon) {
    togglepassword(editNewPasswordInput, editNewPasswordBtn, editNewPasswordIcon);
}
if (editConfirmNewPasswordInput && editConfirmPasswordBtn && editConfirmPasswordIcon) {
    togglepassword(editConfirmNewPasswordInput, editConfirmPasswordBtn, editConfirmPasswordIcon);
}
if (editCurrentPasswordInput && editCurrentPasswordBtn && editCurrentPasswordIcon) {
    togglepassword(editCurrentPasswordInput, editCurrentPasswordBtn, editCurrentPasswordIcon);
}
function togglepassword(Input, Btn, Icon) {
    Btn.addEventListener('click', function () {
        var isVisible = Input.type === 'text';
        Input.type = isVisible ? 'password' : 'text';
        Icon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';
    });
}
exports.togglepassword = togglepassword;
//const saveBtnEditPassword = document.getElementById('save-btn-edit-password') as HTMLButtonElement;
if (editPasswordForm) {
    editPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (editNewPasswordInput.value !== editConfirmNewPasswordInput.value) {
            alert('les mots de passe sont pas bon');
            return;
        }
        else if (editNewPasswordInput.value === editCurrentPasswordInput.value) {
            alert('change pas ton mot de passe par le meme debile !!!');
            return;
        }
        editCurrentPasswordInput.value = "";
        editNewPasswordInput.value = "";
        editConfirmNewPasswordInput.value = "";
        editProfilForm.classList.remove('hidden');
        editPasswordForm.classList.add('hidden');
        editPasswordBtn.classList.remove('hidden');
        profileBadConfirmPasswordIcon.classList.add('hidden');
        profileGoodPasswordIcon.classList.add('hidden');
        profileBadPasswordIcon.classList.add('hidden');
        profileGoodConfirmPasswordIcon.classList.add('hidden');
    });
}
