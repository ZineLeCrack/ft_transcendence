import { userData } from "../game/choosegame.js";
import initError from "../error.js";
import { loadRoutes } from "../main.js";
import { loadProfilePicture } from "./editinfo.js";
import { initLanguageSelector } from "../language.js";
import { translate } from "../i18n.js";

export interface CardHistory {
	imageplayer1: string;
	imageplayer2: string;
	usernameplayer1: string;
	usernameplayer2: string;
	pointplayer1: number;
	pointplayer2: number;
	date: string;
}

export function generateCardsHistory(div: string ,cardsHistory: CardHistory[], username: string): void 
{
	const container = document.getElementById(div);
	if (container)
	{
		if (cardsHistory.length === 0)
		{
			const message = document.createElement('div');
			message.className = 'text-center text-white font-bold text-8xl mt-10';
			const mess = translate("history_mess")
			message.textContent = mess;
			container.appendChild(message);
			return;
		}
		cardsHistory.forEach(CardHistory => {
			const cardElement = document.createElement('div');
			if (username === CardHistory.usernameplayer1)
			{
				const id = Math.random() * 1000000000;
				if (CardHistory.pointplayer1 > CardHistory.pointplayer2)
				{
					cardElement.className = 'relative w-4/5 h-[195px] mx-auto grid grid-cols-5 items-center rounded-xl border-4 p-4 bg-[#00ff88]/30 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88]';
				}
				else
				{
					cardElement.className = 'relative w-4/5 h-[195px] mx-auto grid grid-cols-5 items-center rounded-xl border-4 p-4 bg-[#ff0000]/30 border-[#ff0000] shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000]';
				}

				cardElement.innerHTML = `
					<div class="flex flex-col items-center">
						<div id="profile-pic-player1-${id}" class="w-[120px] h-[120px] overflow-hidden rounded-full"></div>
						<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">${CardHistory.usernameplayer1}</div>
					</div>

					<div class="text-8xl font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF] text-center">${CardHistory.pointplayer1}</div>

					<img src="/images/VS.png" class="w-[160px] h-[160px] mx-auto" alt="VS">

					<div class="text-8xl font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A] text-center">${CardHistory.pointplayer2}</div>

					<div class="flex flex-col items-center">
						<div id="profile-pic-player2-${id}" class="w-[120px] h-[120px] overflow-hidden rounded-full"></div>
						<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer2}</div>
					</div>

					<div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white font-semibold drop-shadow-[0_0_5px_#00FFFF]">${CardHistory.date}</div>
				`;

				loadProfilePicture(`profile-pic-player1-${id}`, CardHistory.usernameplayer1);
				loadProfilePicture(`profile-pic-player2-${id}`, CardHistory.usernameplayer2);
			}
			else
			{
				const id = Math.random() * 1000000000;
				if (CardHistory.pointplayer1 < CardHistory.pointplayer2)
				{
					cardElement.className = 'relative w-4/5 h-[195px] mx-auto grid grid-cols-5 items-center rounded-xl border-4 p-4 bg-[#00ff88]/30 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88]';
				}
				else
				{
					cardElement.className = 'relative w-4/5 h-[195px] mx-auto grid grid-cols-5 items-center rounded-xl border-4 p-4 bg-[#ff0000]/30 border-[#ff0000] shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000]';
				}
				cardElement.innerHTML =`
					<div class="flex flex-col items-center">
						<div id="profile-lose1-${id}" class="w-[120px] h-[120px] overflow-hidden rounded-full"></div>
						<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">${CardHistory.usernameplayer2}</div>
					</div>
					
					<div class="text-8xl font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF] text-center">${CardHistory.pointplayer2}</div>
					
					<img src="/images/VS.png" class="w-[160px] h-[160px] mx-auto" alt="VS">
					<div class="text-8xl font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A] text-center">${CardHistory.pointplayer1}</div>
					
					<div class="flex flex-col items-center">
						<div id="profile-lose2-${id}" class="w-[120px] h-[120px] overflow-hidden rounded-full"></div>
						<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer1}</div>
					</div>
					
					<div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-white font-semibold drop-shadow-[0_0_5px_#00FFFF]">${CardHistory.date}</div>
				`;

				loadProfilePicture(`profile-lose1-${id}`, CardHistory.usernameplayer2);
				loadProfilePicture(`profile-lose2-${id}`, CardHistory.usernameplayer1);
			}
			container.appendChild(cardElement);
		});
	}
}

export default async function initHistory() 
{
	await initLanguageSelector();
	const token = sessionStorage.getItem('token');
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	if (!response.ok)
	{
		initError(translate('Error_co'));
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return;
	}
	const name = await response.json();
	try
	{
		const response = await fetch(`/api/history`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});

		const data = await response.json();
		generateCardsHistory('History-Div', data, name.original);
	}
	catch (err)
	{
		console.error('Erreur lors de la récupération de l\'historique :', err);
	}

}