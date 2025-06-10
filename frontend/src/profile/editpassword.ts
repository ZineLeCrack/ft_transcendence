import {togglePassword, checkPasswordMatch } from './utils.js';
import { loadRoutes } from '../main.js';
import initError from '../error.js';
import { loadProfilePicture } from './editinfo.js';

export default async function initEditPassword() {
	const token = sessionStorage.getItem('token');
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});
		if (!response.ok)
		{
			initError('Please Sign in or Sign up !');
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return;
		}

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
                    token: sessionStorage.getItem('token'),
                }
                const response = await fetch(`/api/edit`,
                {
			        method: 'POST',
			        headers: { 'Content-Type': 'application/json' },
			        body: JSON.stringify(EditData),
                });
                if (!response.ok)
                {
                    // alert("Your current password is not the current password");
                    const err = await response.text();
                    throw new Error(err || "Fail change");
                }
				alert("password edit success");
				history.pushState(null, '', '/profile/edit');
				await loadRoutes('/profile/edit');

            }
            catch (error) 
            {
                alert(error);
				console.log(error);
            }
		});
	}


	function validatePasswordField(input: HTMLInputElement) {
		const errorElement = document.getElementById('edit-password-error');
		if (!errorElement) return;
	
		const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(input.value);
		
		if (!isValid && input.value.length >= 1) {
			errorElement.classList.remove('hidden');
			input.classList.add('border-red-500');
		} else {
			errorElement.classList.add('hidden');
			input.classList.remove('border-red-500');
		}
	}
	
	if (editNewPasswordInput) {
		editNewPasswordInput.addEventListener('input', () => validatePasswordField(editNewPasswordInput));
		editNewPasswordInput.addEventListener('invalid', (e) => {
			e.preventDefault();
			validatePasswordField(editNewPasswordInput);
		});
	}
loadProfilePicture("profile-pic-pass", "l");
}