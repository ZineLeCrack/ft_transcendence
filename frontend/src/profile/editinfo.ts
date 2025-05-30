
export default async function initEditProfile() {

const usernameInput = document.getElementById("edit-username-input") as HTMLInputElement;
const emailInput = document.getElementById("edit-email-input") as HTMLInputElement;

const editProfileForm = document.getElementById("edit-profil-form") as HTMLFormElement;

if (editProfileForm) {
	editProfileForm.addEventListener('submit', async (event) =>{
		event.preventDefault();
		try {
			const EditData =
			{
				username: usernameInput.value,
				email: emailInput.value,
				IdUser : localStorage.getItem('userId'),
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
}