import { loadRoutes } from "../main.js";

import initError from '../error.js';
import { translate } from "../i18n.js";

export default async function initSearch() 
{

	const searchBar = document.getElementById("search-bar") as HTMLInputElement;

	searchBar?.addEventListener("keydown", async (event) => {
		if (event.key === "Enter") {
			const username = searchBar.value.trim();
			if (!username) return ;

			try {
				const res = await fetch(`/api/search`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({username: username}),
					credentials: 'include'
				});

				const data = await res.json();

				if (data.exists) {
					history.pushState(null, '', '/users/' + username);
					await loadRoutes('/users/' + username);
				} else {
					initError(translate("user_NOT_FOUND"));
				}
			} catch (err) {
				initError(translate("Error_verif_user"));
			}
		}
	});
}