import { loadRoutes } from "../main.js";

export default async function initSearch() 
{

	const searchBar = document.getElementById("search-bar") as HTMLInputElement;
	
	searchBar?.addEventListener("keydown", async (event) => {
		if (event.key === "Enter") {
			const username = searchBar.value.trim();
			if (!username) return;
	
			try {
				const res = await fetch(`/api/search`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({username: username}),
				});
	
				const { exists } = await res.json();
				
				if (exists) {
					history.pushState(null, '', '/users/' + username);
					await loadRoutes('/users/' + username);
				} else {
					alert("Utilisateur non trouvé !");
				}
			} catch (err) {
				console.error("Erreur lors de la vérification de l'utilisateur :", err);
			}
		}
	});
}