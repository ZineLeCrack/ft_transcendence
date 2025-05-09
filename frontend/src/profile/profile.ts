const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;
const statsBtn = document.getElementById('stats-btn') as HTMLButtonElement;
const statsForm = document.getElementById('stats-form') as HTMLFormElement;
const editProfilForm = document.getElementById('edit-profil-form') as HTMLFormElement;

let editBtnIsActive = false;
let statsBtnIsActive = true;


    editBtn.addEventListener('click', () => {

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

    statsBtn.addEventListener('click', () => {

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


const editPasswordBtn = document.getElementById('edit-password-btn') as HTMLButtonElement;
const editPasswordForm = document.getElementById('edit-password-form') as HTMLFormElement;

editPasswordBtn.addEventListener('click', () => {

    editProfilForm.classList.add('hidden');
    editPasswordForm.classList.remove('hidden');
    editPasswordBtn.classList.add('hidden');

});

const unsaveBtn = document.getElementById('unsave-btn') as HTMLButtonElement;
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
const editUsernameInput = document.getElementById('edit-username-input') as HTMLInputElement;
const editEmailInput = document.getElementById('edit-email-input') as HTMLInputElement;
const editCurrentPasswordInput = document.getElementById('edit-currentpassword-input') as HTMLInputElement;
const editNewPasswordInput = document.getElementById('edit-newpassword-input') as HTMLInputElement;
const editConfirmNewPasswordInput = document.getElementById('edit-confirmpassword-input') as HTMLInputElement;
const unsaveBtnEditPassword = document.getElementById('unsave-btn-edit-password') as HTMLButtonElement;

unsaveBtn.addEventListener('click', () =>{

    editUsernameInput.value = "";
    editEmailInput.value = "";
});

unsaveBtnEditPassword.addEventListener('click', () =>{

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

const profileBadPasswordIcon = document.getElementById('profile-badPasswordIcon') as HTMLImageElement;
const profileGoodPasswordIcon = document.getElementById('profile-goodPasswordIcon') as HTMLImageElement;
const profileBadConfirmPasswordIcon = document.getElementById('profile-badConfirmPasswordIcon') as HTMLImageElement;
const profileGoodConfirmPasswordIcon = document.getElementById('profile-goodConfirmPasswordIcon') as HTMLImageElement;

//fonction a enlever quand checkpassword sera utilisable partout
function checkPasswordMatchinprofile() {

	if (editNewPasswordInput && editConfirmNewPasswordInput && profileBadPasswordIcon && profileGoodPasswordIcon && profileBadConfirmPasswordIcon && profileGoodConfirmPasswordIcon)
	{
		if (editNewPasswordInput.value === "" && editConfirmNewPasswordInput.value === "")
		{
			profileBadConfirmPasswordIcon.classList.add('hidden');
			profileGoodPasswordIcon.classList.add('hidden');
			profileBadPasswordIcon.classList.add('hidden');
			profileGoodConfirmPasswordIcon.classList.add('hidden');
			return ;
		}
		else if (editNewPasswordInput.value === editConfirmNewPasswordInput.value)
		{
			profileBadConfirmPasswordIcon.classList.add('hidden');
			profileBadPasswordIcon.classList.add('hidden');
			profileGoodConfirmPasswordIcon.classList.remove('hidden');
			profileGoodPasswordIcon.classList.remove('hidden');
		}
		else
		{
			profileGoodPasswordIcon.classList.add('hidden');
			profileGoodConfirmPasswordIcon.classList.add('hidden');
			profileBadConfirmPasswordIcon.classList.remove('hidden');
			profileBadPasswordIcon.classList.remove('hidden');
		}

	}
}

const editConfirmPasswordBtn = document.getElementById('edit-confirmpassword-btn') as HTMLButtonElement | null;
const editConfirmPasswordIcon = document.getElementById('edit-confirmpassword-icon') as HTMLImageElement | null;

const editNewPasswordBtn = document.getElementById('edit-newpassword-btn') as HTMLButtonElement | null;
const editNewPasswordIcon = document.getElementById('edit-newpassword-icon') as HTMLImageElement | null;

const editCurrentPasswordBtn = document.getElementById('edit-currentpassword-btn') as HTMLButtonElement | null;
const editCurrentPasswordIcon = document.getElementById('edit-currentpassword-icon') as HTMLImageElement | null;

if (editNewPasswordInput && editConfirmNewPasswordInput)
{
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

export function togglepassword(Input: HTMLInputElement, Btn: HTMLButtonElement, Icon: HTMLImageElement)
{
    Btn.addEventListener('click', () => {
        const isVisible = Input.type === 'text';
        Input.type = isVisible ? 'password' : 'text';
        Icon.src = isVisible ? '../images/cacher.svg' : '../images/content.svg';

    })
}

//const saveBtnEditPassword = document.getElementById('save-btn-edit-password') as HTMLButtonElement;

if (editPasswordForm)
{
    editPasswordForm.addEventListener('submit', (event) =>{
        event.preventDefault();
        if (editNewPasswordInput.value !== editConfirmNewPasswordInput.value)
        {
            alert('les mots de passe sont pas bon');
			return ;
        }
        else if (editNewPasswordInput.value === editCurrentPasswordInput.value)
        {
            alert('change pas ton mot de passe par le meme debile !!!');
			return ;
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