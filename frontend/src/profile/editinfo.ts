import  imageCompression  from 'browser-image-compression';
import initError from '../error';
import { loadRoutes } from '../main';

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

const usernameInput = document.getElementById("edit-username-input") as HTMLInputElement;
const emailInput = document.getElementById("edit-email-input") as HTMLInputElement;
const picturebutton = document.getElementById("button-edit-profile") as HTMLInputElement;
const pictureInput = document.getElementById("pictureInput") as HTMLInputElement;
const editProfileForm = document.getElementById("edit-profil-form") as HTMLFormElement;

if (editProfileForm) {
	editProfileForm.addEventListener('submit', async (event) =>{
		event.preventDefault();
		try {
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
				alert("Your profile has been updated successfully");
				editProfileForm.reset();
			} 
			catch (error) 
			{
				alert(error);
			}
	});
}

picturebutton.addEventListener('click', async (event) =>{
	event.preventDefault();

	const file = pictureInput.files![0];
	const Token = sessionStorage.getItem('token')!;
	if (!file)
	{
		alert("Please select a picture");
	}
	try {
		
		const formData = new FormData();
		const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
		formData.append('picture', file, file.name);
		formData.append('token', Token);

		const response = await fetch('/api/picture', {
			method: 'POST',
			body: formData,
		});
		if (!response.ok)
		{
			const err = await response.text();
			throw new Error(err || "Fail change");
		}
			console.log("Your profile has been updated successfully");
		} 
		catch (error) 
		{
			alert(error);
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

}