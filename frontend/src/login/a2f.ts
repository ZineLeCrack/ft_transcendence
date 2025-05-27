
const form = document.getElementById("a2f") as HTMLFormElement;
const sendBtn = document.getElementById('to-send-a2f') as HTMLButtonElement;
const codeInput = document.getElementById("code-input") as HTMLInputElement;


sendBtn.addEventListener("click", async () => {
    const Data =
    {
        IdUser : localStorage.getItem('userId'),
    }
    const response = await fetch(`https://10.12.200.87:3451/a2f/send`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Data),
	});
	if (!response.ok)
	{
		const error = await response.text();
		throw new Error(error || 'Erreur lors de la connection');
	}
    alert("Mail envoye");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const Data =
    {
        code : codeInput.value,
        IdUser : localStorage.getItem('userId'),
    }
    const response = await fetch(`https://10.12.200.87:3451/a2f/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Data),
	});
	if (!response.ok)
	{
		const error = await response.text();
		alert("Mauvais code a2f");
		throw new Error(error || 'Erreur lors de la connection');
	}
    console.log("Code 2FA saisi :", Data.code);
    window.location.href = "../../index.html";
});