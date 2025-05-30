import {togglePassword, checkPasswordMatch } from './utils.js';

export default async function initEditPassword() {

	const editPasswordForm = document.getElementById('edit-password-form') as HTMLFormElement;
	
	const editCurrentPasswordInput = document.getElementById('edit-currentpassword-input') as HTMLInputElement;
	const editNewPasswordInput = document.getElementById('edit-newpassword-input') as HTMLInputElement;
	const editConfirmNewPasswordInput = document.getElementById('edit-confirmpassword-input') as HTMLInputElement;
	
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
			try {
                const EditData =
                {
                    current: editCurrentPasswordInput.value,
                    newpass: editConfirmNewPasswordInput.value,
                    IdUser : localStorage.getItem('userId'),
                }
                const response = await fetch(`/api/edit`,
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
		});
	}

}