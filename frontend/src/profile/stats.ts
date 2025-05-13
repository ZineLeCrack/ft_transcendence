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


// interface CardHistory {
// 	imageplayer1: string;
// 	imageplayer2: string;
// 	nameplayer1: string;
// 	nameplayer2: string;
// 	pointplayer1: number;
// 	pointplayer2: number;
// }

// const cardsHistory: CardHistory[] = [
//   {
// 	imageplayer1: "frontend/src/images/backgroundlogin.png",
// 	imageplayer2: "frontend/src/images/logincyberpunk.png",
// 	nameplayer1: "lelanglo",
// 	nameplayer2: "cle-berr",
// 	pointplayer1: 5,
// 	pointplayer2: 3,
//   },
  
// ];

// function generateCards(cardsHistory: CardHistory[]): void 
// {
//   const container = document.getElementById('cards-container');
//   if (container) {
// 	cardsHistory.forEach(CardHistory => {
// 	  const cardElement = document.createElement('div');
// 	  cardElement.className = 'max-w-sm bg-white rounded-lg overflow-hidden shadow-md';

// 	  cardElement.innerHTML = `
// 		<img id="imageplayer1" class="card-image w-full object-cover" src="${CardHistory.imageplayer1}">
// 		<img id="imageplayer2" class="card-image w-full object-cover" src="${CardHistory.imageplayer2}">
// 		<div class="p-4">
		  
// 		</div>
// 	  `;

// 	  container.appendChild(cardElement);
// 	});
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   generateCards(cardsHistory);
// });
