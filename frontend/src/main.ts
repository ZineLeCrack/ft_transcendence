import './css/style.css';

import loginHtml from './pages/login.html?raw';
import registerHtml from './pages/register.html?raw';
import a2fHTML from './pages/a2f.html?raw';

import homeHTML from './pages/home.html?raw';

import localGameHTML from './pages/localgame.html?raw';
import multiGameHTML from './pages/multigame.html?raw';
import aiGameHTML from './pages/aigame.html?raw';

import editprofileHTML from './pages/edit_info.html?raw';
import editpasswordHTML from './pages/edit_password.html?raw';
import overallStatHTML from './pages/overall_statistics.html?raw';
import historyStatHTML from './pages/history_statistics.html?raw';
import tournamentsStatHTML from './pages/tournament_statistics.html?raw';

import SearchHTML from './pages/search.html?raw';

import initError from './error.js';

const notFoundPageContent = `
    <div class="text-center p-8 bg-transparent rounded-lg shadow-lg">
		<a href="/home" data-link class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] px-6 py-2 rounded-xl  hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]">Return Home</a>
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
		script: async () => {
			const {default: initPong} = await import ('./game/ai/pong-ai.ts');
			initPong();
		},
		bodyClass: "m-0 justify-center backdrop-blur items-center h-screenbg-cover bg-center bg-no-repeat h-screen flex",
		bodyStyleImage: "url('/images/pong.png')",
	},
	'/profile/statistics': 
	{
		view: overallStatHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
		script: async () => {
			const {default: initOverallStats} = await import ('./profile/global.ts');
			initOverallStats();
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
		script: async () => {
			const {default: initTournamentStats} = await import ('./profile/tournament.ts');
			initTournamentStats();
		}
	},
	'/profile/edit': 
	{
		view: editprofileHTML,
		bodyStyleImage: "url('/images/statscyberpunk.png')",
		script: async () => {
			const {default: initEditProfile} = await import ('./profile/editinfo.ts');
			initEditProfile();
		}
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
        pattern: /^\/users\/([^\/]+)(?:\/history)?$/,
        script: async (username?: string) => {
            const {default: initUsers} = await import('./search/users.ts');
			const isHistory = window.location.pathname.endsWith('/history');
            initUsers(username, isHistory);
        },
        bodyStyleImage: "url('/images/statscyberpunk.png')",
        bodyClass: "bg-cover bg-center bg-no-repeat h-screen flex",
    },
	
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
                try {
                    const res = await fetch(`/api/search`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                    });
                    const { exists } = await res.json();
                    
                    if (!exists) {
						body.className = "bg-black bg-center bg-no-repeat min-h-screen flex items-center justify-center";
						body.style.backgroundSize = "1920px 920px"; 
						body.style.backgroundImage = "url('/images/404notfound.jpg')";
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
					initError ("An error occurred while verifying the user. Please try again later.");
					body.className = "bg-black bg-center bg-no-repeat min-h-screen flex items-center justify-center";
					body.style.backgroundSize = "1920px 920px"; 
					body.style.backgroundImage = "url('/images/404notfound.jpg')";
                    body.innerHTML = notFoundPageContent;
                    return;
                }
            }
        }
    }

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
		body.className = "bg-black bg-center bg-no-repeat min-h-screen flex items-center justify-center";
		body.style.backgroundSize = "1920px 920px"; 
		body.style.backgroundImage = "url('/images/404notfound.jpg')";
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
