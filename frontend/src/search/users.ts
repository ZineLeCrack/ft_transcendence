import { loadRoutes } from '../main';
import initPrivateChat from './privatechat';
import initBlockPlayer from './block';
import initAddFriend from './friend';

import { generateCardsHistory} from "../profile/history.js";
import type {CardHistory} from "../profile/history.js";

import initSearch from './search.js';


export default async function initUsers(username?: string, isHistory: boolean = false) {
    if (username) {
        // Set username in h2
        const usernameh2 = document.getElementById('username-h2');
        if (usernameh2) {
            usernameh2.textContent = username;
        }

		const globalBtn = document.getElementById('global-btn-search');
		const historyBtn = document.getElementById('history-btn-search');

        updateView(isHistory);

        historyBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            history.pushState(null, `${username}`, `/users/${username}/history`);
            updateView(true);
        });

        globalBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            history.pushState(null, `${username}`, `/users/${username}`);
            updateView(false);
        });
        initSearch();
        initPrivateChat(username);
        initBlockPlayer();
        initAddFriend();

        if (isHistory) {
            await loadHistoryContent(username);
        } else {
            await loadOverallContent(username);
        }
    }
}

function updateView(isHistory: boolean) {
    const globalBtn = document.getElementById('global-btn-search');
    const globalDiv = document.getElementById('global-div-search');
    const historyBtn = document.getElementById('history-btn-search');
    const historyDiv = document.getElementById('history-div-search');

    if (isHistory) {
        globalDiv?.classList.add('hidden');
        historyDiv?.classList.remove('hidden');
        globalBtn?.classList.remove('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
        globalBtn?.classList.add('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
        historyBtn?.classList.remove('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
        historyBtn?.classList.add('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
        
        // Load history content when switching to history view
        const username = document.getElementById('username-h2')?.textContent;
        if (username) {
            loadHistoryContent(username);
        }
    } else {
        globalDiv?.classList.remove('hidden');
        historyDiv?.classList.add('hidden');
        globalBtn?.classList.add('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
        globalBtn?.classList.remove('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
        historyBtn?.classList.add('border-[#00FFFF]', 'text-[#00FFFF]', 'hover:bg-[#00FFFF]/20', 'shadow-[0_0_10px_#00FFFF]');
        historyBtn?.classList.remove('border-[#FFD700]', 'text-[#FFD700]', 'hover:bg-[#FFD700]/20', 'shadow-[0_0_10px_#FFD700]');
        
        // Load overall content when switching to overall view
        const username = document.getElementById('username-h2')?.textContent;
        if (username) {
            loadOverallContent(username);
        }
    }
}

const cardsHistory: CardHistory[] = [
		{
		  imageplayer1: "/images/pdp_cle-berr.png",
		  imageplayer2: "/images/pdp_rlebaill.jpeg",
		  usernameplayer1: "cle-berr",
		  usernameplayer2: "rlebaill",
		  pointplayer1: 5,
		  pointplayer2: 3,
		  date: "20/05/25 at 9:58"
		},
	  
		{
		  imageplayer1: "/images/pdp_cle-berr.png",
		  imageplayer2: "/images/pdp_rlebaill.jpeg",
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

async function loadHistoryContent(username: string) {
    const historyDiv = document.getElementById('history-div-search');
    if (historyDiv) {
        generateCardsHistory('history-div-search', cardsHistory);
    }
}

async function loadOverallContent(username: string) {
    const globalDiv = document.getElementById('global-div-search');
    if (globalDiv) {
        // Load and display overall content
        // Add your overall content logic here
    }
}