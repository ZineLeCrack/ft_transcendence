const usernameInput = document.getElementById("edit-username-input") as HTMLInputElement;
const emailInput = document.getElementById("edit-email-input") as HTMLInputElement;
const IP_NAME = import.meta.env.VITE_IP_NAME;

const editProfileForm = document.getElementById("edit-profile-form") as HTMLFormElement;

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
            const response = await fetch(`https://${IP_NAME}:3451/info`,
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
            } 
            catch (error) 
            {
                console.log(error);
            }
	});
}