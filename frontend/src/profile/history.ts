import { userData } from "../game/choosegame.js";
import initError from "../error.js";
import { loadRoutes } from "../main.js";

export interface CardHistory {
	imageplayer1: string;
	imageplayer2: string;
	usernameplayer1: string;
	usernameplayer2: string;
	pointplayer1: number;
	pointplayer2: number;
	date: string;
}

export function generateCardsHistory(div: string ,cardsHistory: CardHistory[]): void 
{
	const container = document.getElementById(div);
	if (container)
	{
		if (cardsHistory.length === 0)
		{
			const message = document.createElement('div');
			message.className = 'text-center text-white font-bold text-8xl mt-10';
			message.textContent = "There are no history for the moment play a game in Multiplayer or tournament!!";
			container.appendChild(message);
			return;
		}
		cardsHistory.forEach(CardHistory => {
			const cardElement = document.createElement('div');
			if (userData.userName === CardHistory.usernameplayer1)
			{
				if (CardHistory.pointplayer1 > CardHistory.pointplayer2)
				{
					cardElement.className = 'bg-[#00ff88]/30 border-4 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
				}
				else
				{
					cardElement.className = 'bg-red-600/30 border-4 border-red-500 shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
				}

				cardElement.innerHTML = `
					<div class=" ml-28 flex flex-col items-center">
						  <img src="${CardHistory.imageplayer1}" class="rounded-full w-[150px]" alt="">
						 <div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">${CardHistory.usernameplayer1}</div>
					</div>
					<div class="text-center text-8xl ml-28 font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]">${CardHistory.pointplayer1}</div>
					<img src="/images/VS.png" class="rounded-full ml-14 w-[270px] h-[270px] "alt="">
					<div class="text-center text-8xl ml-14 font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A]">${CardHistory.pointplayer2}</div>
					<div class=" ml-28 flex flex-col items-center">
						  <img src="${CardHistory.imageplayer2}" class="rounded-full w-[150px]" alt="">
						 <div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer2}</div>
					</div>
				</div>
				`;
			}
			else
			{
				if (CardHistory.pointplayer1 < CardHistory.pointplayer2)
				{
					cardElement.className = 'bg-[#00ff88]/30 border-4 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
				}
				else
				{
					cardElement.className = 'bg-red-600/30 border-4 border-red-500 shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
				}
					cardElement.innerHTML = `
					<div class=" ml-28 flex flex-col items-center">
						  <img src="${CardHistory.imageplayer2}" class="rounded-full w-[150px]" alt="">
						 <div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">${CardHistory.usernameplayer2}</div>
					</div>
					<div class="text-center text-8xl ml-28 font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]">${CardHistory.pointplayer2}</div>
					<img src="/images/VS.png" class="rounded-full ml-14 w-[270px] h-[270px] "alt="">
					<div class="text-center text-8xl ml-14 font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A]">${CardHistory.pointplayer1}</div>
					<div class=" ml-28 flex flex-col items-center">
						  <img src="${CardHistory.imageplayer1}" class="rounded-full w-[150px]" alt="">
						 <div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer1}</div>
					</div>
				</div>
				`;
			}

			container.appendChild(cardElement);
		});
	 }
}

export default async function  initHistory() 
{
	const token = sessionStorage.getItem('token');
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	if (!response.ok)
	{
		initError('Please Sign in or Sign up !');
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return;
	}

	try
	{
		const response = await fetch(`/api/history`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({userId: userData.userId}),
		});

		const data = await response.json();
		generateCardsHistory('History-Div', data);
	}
	catch (err)
	{
		console.error('Erreur lors de la récupération de l\'historique :', err);
	}

}