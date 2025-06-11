import { loadRoutes } from "../main.js";

import initError from '../error.js';

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
	
				const data = await res.json();
				
				if (data.exists) {
					history.pushState(null, '', '/users/' + username);
					await loadRoutes('/users/' + username);
				} else {
					initError("User not found !");
				}
			} catch (err) {
				initError("An error occurred while verifying the user.");
			}
		}
	});
}