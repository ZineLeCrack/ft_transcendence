// Récupère le formulaire
const form = document.getElementById("a2f") as HTMLFormElement;

// Récupère l'input
const codeInput = document.getElementById("code-input") as HTMLInputElement;

// Écoute la soumission du formulaire
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const Data =
    {
        code : codeInput.value,
        IdUser : localStorage.getItem('userId'),
    }
    const response = await fetch(`https://10.12.200.35:3534/a2f`, {
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