
const IP_NAME = import.meta.env.VITE_IP_NAME;

const searchBar = document.getElementById("search-bar") as HTMLInputElement;

// export let username = "";

searchBar.addEventListener("keydown", async (e) => {
	if (e.key === "Enter")
	{
		console.log('touche entree');
		try
		{
			const res = await fetch(`https://${IP_NAME}:3451/search`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: searchBar.value}),
            });
			console.log('fetch ok');
			const { exists } = await res.json();

			if (exists)
			{
				localStorage.setItem("searchUserName", searchBar.value);
				window.location.href = `src/search/search.html`;
			}
			else
			{
				alert("Utilisateur non trouvé !");
			}
		}
		catch (err)
		{
			console.error("Erreur lors de la vérification de l'utilisateur :", err);
		}
	}
});