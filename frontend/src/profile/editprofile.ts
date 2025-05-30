import { hidePassword, togglePassword, checkPasswordMatch, setButton } from './utils.js';

const IP_NAME = import.meta.env.VITE_IP_NAME;

const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;
const statsBtn = document.getElementById('stats-btn') as HTMLButtonElement;
const statsDiv = document.getElementById('stats-div') as HTMLFormElement;
const editProfilForm = document.getElementById('edit-profil-form') as HTMLFormElement;


const buttonStates = {
 editBtnIsActive: false,
 statsBtnIsActive: true
};


editBtn.addEventListener('click', () => {
    setButton(editBtn, statsBtn, null, editProfilForm,statsDiv, null ,buttonStates, "editBtnIsActive", "statsBtnIsActive", ""); 
});

statsBtn.addEventListener('click', () => {
    setButton (statsBtn, editBtn, null, statsDiv, editProfilForm, null ,buttonStates, "statsBtnIsActive", "editBtnIsActive", ""); 
    editUsernameInput.value = "";
    editEmailInput.value = "";
    editCurrentPasswordInput.value = "";
    editNewPasswordInput.value = "";
    editConfirmNewPasswordInput.value = "";
    editPasswordForm.classList.add('hidden');
    editPasswordBtn.classList.remove('hidden');
    if (editCurrentPasswordInput && editCurrentPasswordBtn && editCurrentPasswordIcon && editConfirmNewPasswordInput && editConfirmPasswordBtn && editConfirmPasswordIcon && editNewPasswordInput && editNewPasswordBtn && editNewPasswordIcon)
    {
            hidePassword(editCurrentPasswordInput, editCurrentPasswordIcon,null ,null);
            hidePassword(editConfirmNewPasswordInput, editConfirmPasswordIcon, profileGoodConfirmPasswordIcon ,profileBadConfirmPasswordIcon);
            hidePassword(editNewPasswordInput, editNewPasswordIcon,profileGoodPasswordIcon ,profileBadPasswordIcon);
    }


});

const editPasswordBtn = document.getElementById('edit-password-btn') as HTMLButtonElement;
const editPasswordForm = document.getElementById('edit-password-form') as HTMLFormElement;

editPasswordBtn.addEventListener('click', () => {

    editProfilForm.classList.add('hidden');
    editPasswordForm.classList.remove('hidden');
    editPasswordBtn.classList.add('hidden');

});

const unsaveBtn = document.getElementById('unsave-btn') as HTMLButtonElement;
// const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
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
    if (editCurrentPasswordInput && editCurrentPasswordBtn && editCurrentPasswordIcon && editConfirmNewPasswordInput && editConfirmPasswordBtn && editConfirmPasswordIcon && editNewPasswordInput && editNewPasswordBtn && editNewPasswordIcon)
    {
            hidePassword(editCurrentPasswordInput, editCurrentPasswordIcon,null ,null);
            hidePassword(editConfirmNewPasswordInput, editConfirmPasswordIcon, profileGoodConfirmPasswordIcon ,profileBadConfirmPasswordIcon);
            hidePassword(editNewPasswordInput, editNewPasswordIcon,profileGoodPasswordIcon ,profileBadPasswordIcon);
    }
});

const profileBadPasswordIcon = document.getElementById('profile-badPasswordIcon') as HTMLImageElement;
const profileGoodPasswordIcon = document.getElementById('profile-goodPasswordIcon') as HTMLImageElement;
const profileBadConfirmPasswordIcon = document.getElementById('profile-badConfirmPasswordIcon') as HTMLImageElement;
const profileGoodConfirmPasswordIcon = document.getElementById('profile-goodConfirmPasswordIcon') as HTMLImageElement;

const editConfirmPasswordBtn = document.getElementById('edit-confirmpassword-btn') as HTMLButtonElement | null;
const editConfirmPasswordIcon = document.getElementById('edit-confirmpassword-icon') as HTMLImageElement | null;

const editNewPasswordBtn = document.getElementById('edit-newpassword-btn') as HTMLButtonElement | null;
const editNewPasswordIcon = document.getElementById('edit-newpassword-icon') as HTMLImageElement | null;

const editCurrentPasswordBtn = document.getElementById('edit-currentpassword-btn') as HTMLButtonElement | null;
const editCurrentPasswordIcon = document.getElementById('edit-currentpassword-icon') as HTMLImageElement | null;

if (editNewPasswordInput && editConfirmNewPasswordInput)
{
    editNewPasswordInput.addEventListener('input', ()=> { checkPasswordMatch(editNewPasswordInput, editConfirmNewPasswordInput, profileBadPasswordIcon, profileBadConfirmPasswordIcon, profileGoodPasswordIcon, profileGoodConfirmPasswordIcon) });
    editConfirmNewPasswordInput.addEventListener('input',  ()=> { checkPasswordMatch(editNewPasswordInput, editConfirmNewPasswordInput, profileBadPasswordIcon, profileBadConfirmPasswordIcon, profileGoodPasswordIcon, profileGoodConfirmPasswordIcon) });
}


if (editNewPasswordInput && editNewPasswordBtn && editNewPasswordIcon) {
	togglePassword(editNewPasswordInput, editNewPasswordBtn, editNewPasswordIcon);
}

if (editConfirmNewPasswordInput && editConfirmPasswordBtn && editConfirmPasswordIcon) {
	togglePassword(editConfirmNewPasswordInput, editConfirmPasswordBtn, editConfirmPasswordIcon);
}

if (editCurrentPasswordInput && editCurrentPasswordBtn && editCurrentPasswordIcon) {
	togglePassword(editCurrentPasswordInput, editCurrentPasswordBtn, editCurrentPasswordIcon);
}


if (editPasswordForm)
{
    editPasswordForm.addEventListener('submit', async (event) =>{
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
        if (editCurrentPasswordInput && editCurrentPasswordBtn && editCurrentPasswordIcon && editConfirmNewPasswordInput && editConfirmPasswordBtn && editConfirmPasswordIcon && editNewPasswordInput && editNewPasswordBtn && editNewPasswordIcon)
        {
            //ici
            try {
                const EditData =
                {
                    current: editCurrentPasswordInput.value,
                    newpass: editConfirmNewPasswordInput.value,
                    IdUser : localStorage.getItem('userId'),
                }
                const response = await fetch(`https://${IP_NAME}:3451/edit`,
                {
			        method: 'POST',
			        headers: { 'Content-Type': 'application/json' },
			        body: JSON.stringify(EditData),
                });
                if (!response.ok)
                {
                    alert("Your current password is not the current password");
                    const err = await response.text();
                    throw new Error(err || "Fail change");
                }
            } 
            catch (error) 
            {
                console.log(error);
            }
            alert("password edit success");
            hidePassword(editCurrentPasswordInput, editCurrentPasswordIcon,null ,null);
            hidePassword(editConfirmNewPasswordInput, editConfirmPasswordIcon, profileGoodConfirmPasswordIcon ,profileBadConfirmPasswordIcon);
            hidePassword(editNewPasswordInput, editNewPasswordIcon,profileGoodPasswordIcon ,profileBadPasswordIcon);
        }
        editCurrentPasswordInput.value = "";
        editNewPasswordInput.value = "";
        editConfirmNewPasswordInput.value = "";
        editProfilForm.classList.remove('hidden');
        editPasswordForm.classList.add('hidden');
        editPasswordBtn.classList.remove('hidden');

    });
}