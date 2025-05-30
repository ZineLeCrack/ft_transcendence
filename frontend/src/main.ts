import '../src/css/style.css';

import loginHtml from '../src/pages/login.html?raw';
import registerHtml from '../src/pages/register.html?raw';
import a2fHTML from '../src/pages/a2f.html?raw';

import homeHTML from '../src/pages/home.html?raw';

import localGameHTML from '../src/pages/localgame.html?raw';
import multiGameHTML from '../src/pages/multigame.html?raw';
import aiGameHTML from '../src/pages/aigame.html?raw';

import editprofileHTML from '../src/pages/edit_info.html?raw';
import editpasswordHTML from '../src/pages/edit_password.html?raw';
import overallStatHTML from '../src/pages/overall_statistics.html?raw';
import historyStatHTML from '../src/pages/history_statistics.html?raw';
import tournamentsStatHTML from '../src/pages/tournament_statistics.html?raw';

import SearchHTML from '../src/pages/search.html?raw';
import searchHistoryHTML from '../src/pages/search_history.html?raw';


const notFoundPageContent = `
    <div class="text-center p-8 bg-red-100 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold text-red-800 mb-4">Erreur 404 - Page Introuvable</h1>
        <p class="text-lg text-red-700">Désolé, la page que vous recherchez n'existe pas.</p>
        <a href="/home" class="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" data-link>Retour à l'accueil</a>
    </div>
`;

interface Route {
    view: string;
    script?: (params?: string) => Promise<void>;
    bodyClass?: string;
    bodyStyleImage?: string;
    pattern?: RegExp;
}

const routes: { [path: string]: Route } = {
    
	'/login': 
	{
        view: loginHtml,
		script: async () => {
			const {default: initLogin} = await import ('./login/login.ts');
			initLogin();
		}
    },
	'/register': 
	{
        view: registerHtml,
		script: async () => {
			const {default: initRegister} = await import ('./login/register.ts');
			initRegister();
		}
    },
	'/login/a2f': 
	{
        view: a2fHTML,
		script: async () => {
			const {default: initA2f} = await import ('./login/a2f.ts');
			initA2f();
		}
    },
	'/home':
	{
		view: homeHTML,
		script: async () => {
			const {default: initHome} = await import ('./home/home.ts');
			initHome();
		},
		bodyClass: "bg-cover bg-center bg-no-repeat h-screen flex",
	},
	'/game/local':
	{
		view : localGameHTML,
		script: async () => {
			const {default: initPong} = await import ('./game/local/local.ts');
			initPong();
		},
		bodyClass: "m-0 justify-center backdrop-blur items-center h-screenbg-cover bg-center bg-no-repeat h-screen flex",
		bodyStyleImage: "url('/images/pong.png')",
	},
	'/game/multi':
	{
		view : multiGameHTML,
		script: async () => {
			const {default: initMultiplayer} = await import ('./game/multiplayer/multi.ts');
			initMultiplayer();
		},
		bodyClass: "m-0 justify-center backdrop-blur items-center h-screenbg-cover bg-center bg-no-repeat h-screen flex",
		bodyStyleImage: "url('/images/pong.png')",
	},
	'/game/ai':
	{
		view : aiGameHTML,
		bodyClass: "m-0 justify-center backdrop-blur items-center h-screenbg-cover bg-center bg-no-repeat h-screen flex",
		bodyStyleImage: "url('/images/pong.png')",
	},
	'/profile/statistics': 
	{
		view: overallStatHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
		script: async () => {
			const {default: initGlobalGraph} = await import ('./profile/global.ts');
			initGlobalGraph();
		}
	},
	'/profile/statistics/history': 
	{
		view: historyStatHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
		script: async () => {
			const {default: initHistory} = await import ('./profile/history.ts');
			initHistory();
		}
	},
	'/profile/statistics/tournaments':
	{
		view: tournamentsStatHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
	},
	'/profile/edit': 
	{
		view: editprofileHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
	},
	'/profile/edit/password': 
	{
		view: editpasswordHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
		script: async () => {
			const {default: initEditPassword} = await import ('./profile/editpassword.ts');
			initEditPassword();
		}
	},
	'/users': 
	{
        view: SearchHTML,
        pattern: /^\/users\/([^\/]+)$/,  // Matches /users/{username}
        script: async (username?: string) => {
            const {default: initUsers} = await import('./search/users.ts');
            initUsers(username);
        },
        bodyStyleImage: "url('/images/statscyberpunk.png')",
        bodyClass: "bg-cover bg-center bg-no-repeat h-screen flex",
    },
	'/users/:username/history': 
	{
    view: searchHistoryHTML,
    pattern: /^\/users\/([^\/]+)\/history$/,
    script: async (username?: string) => {
        const { default: initSearchHistory } = await import('./search/search_history.ts');
        await initSearchHistory(username);
    },
    bodyStyleImage: "url('/images/statscyberpunk.png')",
    bodyClass: "bg-cover bg-center bg-no-repeat h-screen flex",
}
};

export const loadRoutes = async (path: string) => {
    const body = document.body;

    body.style.backgroundSize = "1920px 1080px";

    // Check dynamic routes first
    for (const [_, route] of Object.entries(routes)) {
        if (route.pattern) {
            const match = path.match(route.pattern);
            if (match) {
                const username = match[1];
                // Verify if user exists before loading the page
                try {
                    const IP_NAME = import.meta.env.VITE_IP_NAME;
                    const res = await fetch(`/api/search`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                    });
                    const { exists } = await res.json();
                    
                    if (!exists) {
                        body.innerHTML = notFoundPageContent;
                        return;
                    }
                    
                    body.innerHTML = route.view;
                    body.style.backgroundImage = route?.bodyStyleImage || "url('/images/logincyberpunk.png')";
                    body.className = route?.bodyClass || "bg-center bg-no-repeat min-h-screen flex items-center justify-center";
                    
                    if (route.script) {
                        await route.script(username);
                    }
                    return;
                } catch (error) {
                    console.error("Error verifying user:", error);
                    body.innerHTML = notFoundPageContent;
                    return;
                }
            }
        }
    }

    // Handle static routes
    const route = routes[path];

    if (route) {
        body.innerHTML = route.view;
        
        body.style.backgroundImage = route?.bodyStyleImage || "url('/images/logincyberpunk.png')";
        body.className = route?.bodyClass || "bg-center bg-no-repeat min-h-screen flex items-center justify-center";
        if (route.script) {
            try {
                await route.script();
            } catch (error) {
                console.error(`Error loading script for ${path}:`, error);
            }
        }
    } else {
        body.innerHTML = notFoundPageContent;
    }
}

const router = async () => {
    await loadRoutes(window.location.pathname);
};

const navigate = (url: string) => {
    if (window.location.pathname === url) return;
    history.pushState(null, '', url); 
    loadRoutes(url);
};

document.addEventListener('click', (e) => {
	const target = e.target as HTMLElement;
	const link = target.closest('a[data-link]') as HTMLAnchorElement | null;
	if (link) {
		e.preventDefault();
		const url = link.getAttribute('href');
		if (url) navigate(url);
	}
});

window.addEventListener('popstate', () => {
	loadRoutes(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', async () => {
	if (window.location.pathname === '/') {
		navigate('/login');
	} else {
		await router();
	}
});