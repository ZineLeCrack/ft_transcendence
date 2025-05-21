import { userData } from "../game/game.js";

interface CardHistory {
	imageplayer1: string;
	imageplayer2: string;
	usernameplayer2: string;
	pointplayer1: number;
	pointplayer2: number;
	date: string;
	result: 'win' | 'lose';
}

const cardsHistory: CardHistory[] = [
  {
	imageplayer1: "/src/images/pdp_cle-berr.png",
	imageplayer2: "/src/images/pdp_rlebaill.jpeg",
	usernameplayer2: "rlebaill",
	pointplayer1: 5,
	pointplayer2: 3,
	date: "20/05/25 at 9:58",
	result: 'win',
  },

  {
	imageplayer1: "/src/images/pdp_cle-berr.png",
	imageplayer2: "/src/images/pdp_rlebaill.jpeg",
	usernameplayer2: "rlebaill",
	pointplayer1: 2,
	pointplayer2: 5,
	date: "20/05/25 at 10:00",
	result: 'lose',
  },
  {
	imageplayer1: "/src/images/pdp_cle-berr.png",
	imageplayer2: "/src/images/pdp_rlebaill.jpeg",
	usernameplayer2: "rlebaill",
	pointplayer1: 5,
	pointplayer2: 0,
	date: "20/03/25 at 10:00",
	result: 'win',
  },


];

function generateCards(cardsHistory: CardHistory[]): void 
{
	const container = document.getElementById('History-Div');
	if (container)
	{
		cardsHistory.forEach(CardHistory => {
			const cardElement = document.createElement('div');
			if (CardHistory.result === 'lose')
			{
				cardElement.className = 'bg-red-600/30 border-4 border-red-500 shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
			}
			else
			{
				cardElement.className = 'bg-[#00ff88]/30 border-4 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
			}
	  
			cardElement.innerHTML = `
					<div class=" ml-28 flex flex-col items-center">
      					<img src="${CardHistory.imageplayer1}" class="rounded-full w-[150px]" alt="">
     					<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">You</div>
    				</div>
					<div class="text-center text-8xl ml-28 font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]">${CardHistory.pointplayer1}</div>
					<img src="/src/images/VS.png" class="rounded-full ml-14 w-[270px] h-[270px] "alt="">
					<div class="text-center text-8xl ml-14 font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A]">${CardHistory.pointplayer2}</div>
					<div class=" ml-28 flex flex-col items-center">
      					<img src="${CardHistory.imageplayer2}" class="rounded-full w-[150px]" alt="">
     					<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer2}</div>
    				</div>
				</div>
			`;

			container.appendChild(cardElement);
		});
 	}
}

document.addEventListener('DOMContentLoaded', async () => {

	try
	{
		const response = await fetch('https://10.12.200.86:3453/history',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({userId: userData.userId}),
		});

		const data = await response.json();
		console.log(data.point_player1);
		generateCards(data);
	}
	catch (err)
	{
		console.error('Erreur lors de la récupération de l\'historique :', err);
	}
});
