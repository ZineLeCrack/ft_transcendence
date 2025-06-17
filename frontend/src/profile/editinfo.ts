import initError from '../error';
import { initLanguageSelector } from '../language';
import { loadRoutes } from '../main';
import initSuccess from '../success';
import { initWebSocket } from '../websocket';
import { translate } from '../i18n';
import { validateEmail, validateUsername } from '../utils';

export async function loadProfilePicture(div: string, name: string) {
	const token = sessionStorage.getItem("token");
	if (!token) return;

	const response = await fetch('/api/picture', {
		headers: {
			'Authorization': `Bearer ${token} ${name}`,
		}
	});

	if (!response.ok) {
		console.error("Failed to load profile picture");
		return;
	}

	const blob = await response.blob();
	const imageUrl = URL.createObjectURL(blob);

	const profilPicDiv = document.getElementById(div);
	if (profilPicDiv) {
		const Img = document.createElement('img');
		Img.src = `${imageUrl}`;
		Img.classList = `w-full h-full object-cover rounded-full`;
		Img.alt = 'Profile Pic';
		profilPicDiv.appendChild(Img);
	}
}

export default async function initEditProfile() {

	await initLanguageSelector();
	const token = sessionStorage.getItem('token');
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	if (!response.ok)
	{
		initError(translate("Error_co"));
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return;
	}
	const res = await response.json();
	const username = res.original;
	const email = res.email;
	const usernamediv = document.getElementById("username");
	const emaildiv = document.getElementById("mail");
	
	initWebSocket(username);
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

	const usernameInput = document.getElementById("edit-username-input") as HTMLInputElement;
	const emailInput = document.getElementById("edit-email-input") as HTMLInputElement;
	const picturebutton = document.getElementById("button-edit-profile") as HTMLInputElement;
	const unsavebutton = document.getElementById("unsave-btn") as HTMLInputElement;
	const pictureInput = document.getElementById("pictureInput") as HTMLInputElement;
	const editProfileForm = document.getElementById("edit-profil-form") as HTMLFormElement;

	if (editProfileForm)
	{
		editProfileForm.addEventListener('submit', async (event) =>{
			event.preventDefault();
			try
			{
				const EditData =
				{
					username: usernameInput.value,
					email: emailInput.value,
					token: sessionStorage.getItem('token'),
				}
				if(!EditData.email && !EditData.username)
				{
					return;
				}
				if ((EditData.email && !validateEmail(EditData.email)) || (EditData.username && !validateUsername(EditData.username)))
				{
					initError(translate("touch_html"));
					return;
				}
				const response = await fetch(`/api/info`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(EditData),
				});
				if (!response.ok)
				{
					const err = await response.text();
					if (err === "incomplete data")
					{
						throw new Error(translate("incomplete_data"));
					}
					else
					{
						throw new Error(translate("touch_html"))
					}
				}
					const res = await response.text();
					if (res === "User already exists")
					{
						throw new Error(translate("user_error"));
					}
					initSuccess(translate("edit_success"));
					editProfileForm.reset();
					setTimeout(() => window.location.reload(), 1000);
			}
			catch (error)
			{
				initError((error as string).toString().substring(7));
			}
		});
	}

	unsavebutton.addEventListener('click', (event) =>{
		const errorElement = document.getElementById('edit-username-error')!;
		const emailElement = document.getElementById('edit-email-error');
		event.preventDefault();
		editProfileForm.reset();
		errorElement.classList.add('hidden');
		emailElement?.classList.add('hidden');
		emailInput.classList.remove('border-red-500');
		usernameInput.classList.remove('border-red-500');
	});


	picturebutton.addEventListener('click', async (event) =>{
		event.preventDefault();

		const file = pictureInput.files![0];
		if (!file)
		{
			initError(translate("picture_no"));
			pictureInput.value = '';
			return;
		}
		try {

			const formData = new FormData();
			formData.append('picture', file);

			const response = await fetch('/api/picture', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`
	  			},
			});
			if (!response.ok)
			{
				const err = await response.text();
				throw new Error(err || "Fail change");
			}
				const err = await response.text();
				if (err === "Please a valid image (PNG, JPG, WEBP, ...)")
				{
					throw new Error(translate("bad_picture"));
				}
				loadProfilePicture("profil-pic", "l");
				pictureInput.value = '';
				window.location.reload();
				console.log("Your profile has been updated successfully");
			} 
			catch (error) 
			{
				initError((error as string).toString().substring(7));
			}
	});

	function validateUsernameField(input: HTMLInputElement) {
		const errorElement = document.getElementById('edit-username-error');
		if (!errorElement) return;

		const isValid = /^[a-zA-Z0-9_]{3,14}$/.test(input.value);

		if (!isValid && input.value.length >= 1) {
			errorElement.classList.remove('hidden');
			input.classList.add('border-red-500');
		} else {
			errorElement.classList.add('hidden');
			input.classList.remove('border-red-500');
		}
	}

	if (usernameInput) {
		usernameInput.addEventListener('input', () => validateUsernameField(usernameInput));
		usernameInput.addEventListener('invalid', (e) => {
			e.preventDefault();
			validateUsernameField(usernameInput);
		});
	}

	function validateEmailField(input: HTMLInputElement) {
		const errorElement = document.getElementById('edit-email-error');
		if (!errorElement) return;
		const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
		
		if ((!isValid && input.value.length >= 1) || input.validity.typeMismatch) {
			errorElement.classList.remove('hidden');
			input.classList.add('border-red-500');
		} else {
			errorElement.classList.add('hidden');
			input.classList.remove('border-red-500');
		}
	}

	if (emailInput) {
		emailInput.addEventListener('input', () => validateEmailField(emailInput));
		emailInput.addEventListener('invalid', (e) => {
			e.preventDefault();
			validateEmailField(emailInput);
		});
	}
	loadProfilePicture("profil-pic", "l");
}