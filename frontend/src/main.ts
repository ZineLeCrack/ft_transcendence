import '../src/css/style.css';

import loginHtml from '../src/pages/login.html?raw';
import registerHtml from '../src/pages/register.html?raw';
import homeHTML from '../src/pages/home.html?raw';
import a2fHTML from '../src/pages/a2f.html?raw';

// import { loginModule } from './login/login';
// import { registerModule } from './login/register';

const notFoundPageContent = `
    <div class="text-center p-8 bg-red-100 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold text-red-800 mb-4">Erreur 404 - Page Introuvable</h1>
        <p class="text-lg text-red-700">Désolé, la page que vous recherchez n'existe pas.</p>
        <a href="/home" class="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" data-link>Retour à l'accueil</a>
    </div>
`;

interface Route {
    view: string; // Le HTML de la page
    modulePath?: string; // Chemin vers le fichier TS à charger pour cette page
    // requiresAppLayout: boolean; Indique si la page doit avoir la top bar
}

const routes: { [path: string]: Route } = {
    
	'/login': 
	{
        view: loginHtml,
        modulePath: './login/login.ts',
    },
	'/register': 
	{
        view: registerHtml,
        modulePath: './login/register.ts',
    },
	// '/login/a2f': 
	// {
    //     view: a2fHTML,
    //     // modulePath: '/src/login/test.ts',
    // },
	// '/home':
	// {
	// 	view: homeHTML,
	// 	// modulePath: '/src/login/test.ts',
	// }	
};

const loadRoutes = async (path: string) => {
	const appContainer = document.getElementById('app-container');
	if (!appContainer) return;

	const route = routes[path];

	if (route)
	{
		appContainer.innerHTML = route.view;

		if (route.modulePath)
		{
			const module = await import(route.modulePath);
			if (module && typeof module.init === 'function')
			{
				module.init();
			}
		}
	}
	else
	{
		appContainer.innerHTML = notFoundPageContent;
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