import { setButton } from "../profile/utils.js";
import { generateCardsHistory } from "../profile/history.js";
export const usernameh2 = document.getElementById("username-h2");
const globalbtnsearch = document.getElementById('global-btn-search');
const historybtnsearch = document.getElementById('history-btn-search');
const globaldivsearch = document.getElementById('global-div-search');
const historydivsearch = document.getElementById('history-div-search');
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
const cardsHistory = [
    {
        imageplayer1: "/src/images/pdp_cle-berr.png",
        imageplayer2: "/src/images/pdp_rlebaill.jpeg",
        usernameplayer1: "cle-berr",
        usernameplayer2: "rlebaill",
        pointplayer1: 5,
        pointplayer2: 3,
        date: "20/05/25 at 9:58"
    },
    {
        imageplayer1: "/src/images/pdp_cle-berr.png",
        imageplayer2: "/src/images/pdp_rlebaill.jpeg",
        usernameplayer1: "cle-berr",
        usernameplayer2: "rlebaill",
        pointplayer1: 2,
        pointplayer2: 5,
        date: "20/05/25 at 10:00"
    },
    {
        imageplayer1: "/src/images/pdp_cle-berr.png",
        imageplayer2: "/src/images/pdp_rlebaill.jpeg",
        usernameplayer1: "cle-berr",
        usernameplayer2: "rlebaill",
        pointplayer1: 5,
        pointplayer2: 0,
        date: "20/03/25 at 10:00"
    },
];
document.addEventListener('DOMContentLoaded', () => {
    generateCardsHistory('history-div-search', cardsHistory);
});
