var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setButton } from "./utils.js";
import { userData } from "../game/game.js";
const historyBtn = document.getElementById("History-btn");
const globalBtn = document.getElementById("Global-btn");
const tournamentBtn = document.getElementById("Tournament-btn");
const historyDiv = document.getElementById("History-Div");
const globalDiv = document.getElementById("Global-Div");
const tournamentDiv = document.getElementById("Tournament-Div");
const buttonStatesStats = {
    historyIsActive: false,
    globalIsActive: true,
    tournamentIsActive: false,
};
historyBtn.addEventListener('click', () => {
    setButton(historyBtn, globalBtn, tournamentBtn, historyDiv, globalDiv, tournamentDiv, buttonStatesStats, "historyIsActive", "globalIsActive", "tournamentIsActive");
});
globalBtn.addEventListener('click', () => {
    setButton(globalBtn, historyBtn, tournamentBtn, globalDiv, historyDiv, tournamentDiv, buttonStatesStats, "globalIsActive", "historyIsActive", "tournamentIsActive");
});
tournamentBtn.addEventListener('click', () => {
    setButton(tournamentBtn, globalBtn, historyBtn, tournamentDiv, globalDiv, historyDiv, buttonStatesStats, "tournamentIsActive", "globalIsActive", "historyIsActive");
});
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('https://10.12.200.87:3451/global', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userData.userId }),
        });
        const data = yield response.json();
        console.log(data);
    }
    catch (err) {
        console.error('Erreur lors de la récupération de l\'historique :', err);
    }
}));
