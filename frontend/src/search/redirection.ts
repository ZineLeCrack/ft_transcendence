import { usernameh2 } from "./btn.js";


const searchBar = document.getElementById("search-bar") as HTMLInputElement;
const IP_NAME = '10.12.200.87';

searchBar?.addEventListener("keydown", async (event) => {
	if (event.key === "Enter") {
		const username = searchBar.value.trim();
		if (!username) return;

		try {
			const res = await fetch(`https://${IP_NAME}:3451/search`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: username}),
            });

			const { exists } = await res.json();

			if (exists) {
				window.location.href = `src/search/search.html`;
                usernameh2.textContent = username;
			} else {
				alert("Utilisateur non trouvé !");
			}
		} catch (err) {
			console.error("Erreur lors de la vérification de l'utilisateur :", err);
		}
	}
});
