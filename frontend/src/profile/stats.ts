import { setButton } from "./utils.js";

const historyBtn = document.getElementById("History-btn") as HTMLButtonElement;
const globalBtn = document.getElementById("Global-btn") as HTMLButtonElement;
const tournamentBtn = document.getElementById("Tournament-btn") as HTMLButtonElement;


const historyDiv = document.getElementById("History-Div") as HTMLDivElement;
const globalDiv = document.getElementById("Global-Div") as HTMLDivElement;
const tournamentDiv = document.getElementById("Tournament-Div") as HTMLDivElement;


const buttonStatesStats =
{
	historyIsActive: false,
	globalIsActive: true,
	tournamentIsActive: false,
}

historyBtn.addEventListener('click', () => {

	setButton(historyBtn, globalBtn, tournamentBtn, historyDiv, globalDiv, tournamentDiv, buttonStatesStats, "historyIsActive", "globalIsActive", "tournamentIsActive");
});

globalBtn.addEventListener('click', () => {

	setButton(globalBtn, historyBtn, tournamentBtn, globalDiv, historyDiv, tournamentDiv, buttonStatesStats, "globalIsActive", "historyIsActive", "tournamentIsActive");
});

tournamentBtn.addEventListener('click', () => {
	setButton(tournamentBtn, globalBtn, historyBtn, tournamentDiv, globalDiv, historyDiv, buttonStatesStats, "tournamentIsActive", "globalIsActive", "historyIsActive" );
});


interface CardHistory {
	imageplayer1: string;
	imageplayer2: string;
	usernameplayer2: string;
	pointplayer1: number;
	pointplayer2: number;
	date: string;
	result: 'win' | 'loose';
}

const cardsHistory: CardHistory[] = [
  {
	imageplayer1: "/frontend/src//images/pdp_cle-berr.png",
	imageplayer2: "/frontend/src/images/pdp_rlebaill.jpeg",
	usernameplayer2: "rlebaill",
	pointplayer1: 5,
	pointplayer2: 3,
	date: "20/05/25 at 9:58",
	result: 'win',
  },

  {
	imageplayer1: "/frontend/src/images/pdp_cle-berr.png",
	imageplayer2: "/frontend/src/images/pdp_rlebaill.jpeg",
	usernameplayer2: "rlebaill",
	pointplayer1: 2,
	pointplayer2: 5,
	date: "20/05/25 at 10:00",
	result: 'loose',
  },
  {
	imageplayer1: "/frontend/src/images/pdp_cle-berr.png",
	imageplayer2: "/frontend/src/images/pdp_rlebaill.jpeg",
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
			if (CardHistory.result === 'loose')
			{
				cardElement.className = 'bg-red-600/30 border-4 border-red-500 shadow-[0_0_10px_#ff0000,0_0_20px_#ff0000,0_0_40px_#ff0000] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
			}
			else
			{
				cardElement.className = 'bg-[#00ff88]/30 border-4 border-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88,0_0_40px_#00ff88] w-4/5 h-[195px] mx-auto flex items-center justify-start rounded-xl';
			}
	  
			cardElement.innerHTML = `
					<div class=" ml-28 flex flex-col items-center">
      					<img src="${CardHistory.imageplayer1}" class="rounded-full w-[140px] h-[150px]" alt="">
     					<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#00FFFF] mt-1">You</div>
    				</div>
					<div class="text-center text-8xl ml-28 font-bold text-[#00FFFF] drop-shadow-[0_0_10px_#00FFFF]">${CardHistory.pointplayer1}</div>
					<img src="/frontend/src/images/VS.png" class="rounded-full ml-14 w-[270px] h-[270px] "alt="">
					<div class="text-center text-8xl ml-14 font-bold text-[#FF007A] drop-shadow-[0_0_10px_#FF007A]">${CardHistory.pointplayer2}</div>
					<div class=" ml-28 flex flex-col items-center">
      					<img src="${CardHistory.imageplayer2}" class="rounded-full w-[140px] h-[150px]" alt="">
     					<div class="text-lg font-bold text-white drop-shadow-[0_0_10px_#FF007A] mt-1">${CardHistory.usernameplayer2}</div>
    				</div>
				</div>
			`;

			container.appendChild(cardElement);
		});
 	}
}

document.addEventListener('DOMContentLoaded', () => {
  generateCards(cardsHistory);
});
