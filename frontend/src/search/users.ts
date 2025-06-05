import initBlockPlayer from './block';
import initAddFriend from './friend';

import { generateCardsHistory} from "../profile/history.js";
import initSearch from './search.js';

export default async function initUsers(username?: string, isHistory: boolean = false) {
    const tokenID = sessionStorage.getItem("token");
    const friendbtn = document.getElementById("friend-btn") as HTMLButtonElement;
    const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;
    if (username) {
        const usernameh2 = document.getElementById('username-h2');
        if (usernameh2) {
            usernameh2.textContent = username;
        }

		const globalBtn = document.getElementById('global-btn-search');
		const historyBtn = document.getElementById('history-btn-search');

        updateView(isHistory);

        historyBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            const currentPath = window.location.pathname;
            const currentTargetPath = `/users/${username}/history`;
            if (currentPath !== currentTargetPath) {
                history.pushState(null, `${username}`, `/users/${username}/history`);
                updateView(true);
            }
        });

        globalBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            history.pushState(null, `${username}`, `/users/${username}`);
            updateView(false);
        });

        const res = await fetch("/api/verifuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenID })
        });

        const data = await res.json();
        if (data.original === username)
        {
            blockbtn.classList.add('hidden');
            friendbtn.classList.add('hidden');   
            initSearch();
        }
        else
        {
            initBlockPlayer(username);
            initAddFriend(username);
            initSearch();
        }

        if (isHistory) 
        {
            await loadHistoryContent(username);
        }
        else
        {
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

async function loadHistoryContent(username: string) {
    const historyDiv = document.getElementById('history-div-search');
    if (historyDiv) {
        try
        {
            const response = await fetch(`/api/history`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userId: username}),
            });

            const data = await response.json();
            generateCardsHistory('history-div-search', data);
            
        }
        catch (err)
        {
            console.error('Erreur lors de la récupération de l\'historique :', err);
        }
    }
}

async function loadOverallContent(username: string) {
    const globalDiv = document.getElementById('global-div-search');
    const historyDiv = document.getElementById('history-div-search');
    if (globalDiv) {
        // Load and display overall content
        // Add your overall content logic here
        if (historyDiv){
            historyDiv.innerHTML = '';
        }

    }
}