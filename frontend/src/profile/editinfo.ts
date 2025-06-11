import initError from '../error';
import { loadRoutes } from '../main';
import initSuccess from '../success';
import { initWebSocket } from '../websocket';

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
				const response = await fetch(`/api/info`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(EditData),
				});
				if (!response.ok)
				{
					const err = await response.text();
					throw new Error(err || "Fail change");
				}
					initSuccess("Your profile has been updated successfully");
					editProfileForm.reset();
					window.location.reload();
			}
			catch (error) 
			{
				initError(error as string);
			}
		});
	}


	picturebutton.addEventListener('click', async (event) =>{
		event.preventDefault();

		const file = pictureInput.files![0];
		if (!file)
		{
			initError("Please select a picture");
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
				loadProfilePicture("profil-pic", "l");
				pictureInput.value = '';
				window.location.reload();
				console.log("Your profile has been updated successfully");
			} 
			catch (error) 
			{
				initError(error as string);
			}
	});

	function validateUsernameField(input: HTMLInputElement) {
		const errorElement = document.getElementById('edit-username-error');
		if (!errorElement) return;

		const isValid = /^[a-zA-Z0-9_-]{3,18}$/.test(input.value);

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

		if (!isValid && input.value.length >= 1) {
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