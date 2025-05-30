const usernameInput = document.getElementById("edit-username-input") as HTMLInputElement;
const emailInput = document.getElementById("edit-email-input") as HTMLInputElement;

const editProfileForm = document.getElementById("edit-profile-form") as HTMLFormElement;

if (editProfileForm) {
	editProfileForm.addEventListener('submit', (event) =>{
		event.preventDefault();
		//ton code ici
	});
}