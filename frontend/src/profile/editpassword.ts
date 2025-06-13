import {togglePassword, checkPasswordMatch } from './utils.js';
import { loadRoutes } from '../main.js';
import initError from '../error.js';
import initSuccess from '../success.js';
import { loadProfilePicture } from './editinfo.js';
import { initLanguageSelector } from '../language.js';
import { translate } from '../i18n.js';

export default async function initEditPassword() {
	initLanguageSelector();
	const token = sessionStorage.getItem('token');
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});
		if (!response.ok)
		{
			initError(translate('Error_co'));
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return;
		}
		const res = await response.json();
		const username = res.original;
		const email = res.email;
		const usernamediv = document.getElementById("username-pass");
		const emaildiv = document.getElementById("mail-pass");
		if (usernamediv)
		{
			const for_username = document.createElement('span');
			for_username.classList = `text-[#FFD700] text-2xl font-bold`;
			for_username.textContent = `${username}`;
			usernamediv.appendChild(for_username);
		}
		if (emaildiv)
		{
			const for_mail = document.createElement('span');
			for_mail.classList= `text-[#FFD700] text-2xl font-bold`;
			for_mail.textContent = `${email}`;
			emaildiv?.appendChild(for_mail);
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
				initError(translate('no_pass'));
				return ;
			}
			else if (editNewPasswordInput.value === editCurrentPasswordInput.value)
			{
				initError(translate("same_pass"));
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
                    initError(translate("not_the_current"));
                    const err = await response.text();
                    throw new Error(err || "Fail change");
                }
				initSuccess(translate("password_edit_success"));
				history.pushState(null, '', '/profile/edit');
				await loadRoutes('/profile/edit');
            }
            catch (error) 
            {
                initError(translate("not_the_current"));
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