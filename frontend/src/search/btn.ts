import { setButton } from "../profile/utils.js";
import { generateCardsHistory} from "../profile/history.js";
import type {CardHistory} from "../profile/history.js";
import { userData } from "../game/game.js";


const IP_NAME = import.meta.env.VITE_IP_NAME;

const username = userData.searchUserName;
const usernameh2 = document.getElementById("username-h2") as HTMLHeadingElement;

const globalbtnsearch = document.getElementById('global-btn-search') as HTMLButtonElement;
const historybtnsearch = document.getElementById('history-btn-search') as HTMLButtonElement;

const globaldivsearch = document.getElementById('global-div-search') as HTMLDivElement;
const historydivsearch = document.getElementById('history-div-search') as HTMLDivElement;

const buttonStatessearch = {
	globalBtnIsActive: true,
	historyBtnIsActive: false
   };

globalbtnsearch.addEventListener('click', () => {

	setButton(globalbtnsearch, historybtnsearch, null, globaldivsearch, historydivsearch, null, buttonStatessearch, "globalBtnIsActive", "historyBtnIsActive", "");
});

historybtnsearch.addEventListener('click', () => {

	setButton(historybtnsearch, globalbtnsearch, null, historydivsearch, globaldivsearch, null, buttonStatessearch, "historyBtnIsActive", "globalBtnIsActive", "");
});

document.addEventListener('DOMContentLoaded', async () => {

	console.log(username);
	usernameh2.textContent = username;
	document.title = `${username}`;
	try
	{
		const response = await fetch(`https://${IP_NAME}:3451/history`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({userId: username}),
		});

		const data = await response.json();
		generateCardsHistory('history-div-search', data);
		
	}
	catch (err)
	{
		console.error('Erreur lors de la récupération de l\'historique :', err);
	}
});