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
