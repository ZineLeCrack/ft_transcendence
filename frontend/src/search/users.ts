import { generateCardsHistory} from "../profile/history.js";
import type {CardHistory} from "../profile/history.js";

export default function initUsers(username?: string) {
const cardsHistory: CardHistory[] = [
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
	  imageplayer1: "/images/pdp_cle-berr.png",
	  imageplayer2: "/images/pdp_rlebaill.jpeg",
	  usernameplayer1: "cle-berr",
	  usernameplayer2: "rlebaill",
	  pointplayer1: 5,
	  pointplayer2: 0,
	  date: "20/03/25 at 10:00"
	},
	
  ];

generateCardsHistory('history-div-search', cardsHistory);

if (username) {
	const usernameh2 = document.getElementById('username-h2');
	if (usernameh2) {
		usernameh2.textContent = username;
	}
	// Add additional logic to load user data
}

}