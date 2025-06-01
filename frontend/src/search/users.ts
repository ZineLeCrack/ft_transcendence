import { loadRoutes } from '../main';
import initPrivateChat from './privatechat';
import initBlockPlayer from './block';
import initAddFriend from './friend';


export default async function initUsers(username?: string) {
	
	if (username) {
		const usernameh2 = document.getElementById('username-h2');
		if (usernameh2) {
			usernameh2.textContent = username;
		}
	
		document.getElementById('history-btn-search')?.addEventListener('click', async (e) => {
			e.preventDefault();
			history.pushState(null, `${username}`, `/users/${username}/history`);
			await loadRoutes(`/users/${username}/history`);
		});
	
		document.getElementById('global-btn-search')?.addEventListener('click', async (e) => {
			e.preventDefault();
			history.pushState(null, `${username}`, `/users/${username}`);
			await loadRoutes(`/users/${username}`);
		});
	
		initPrivateChat(username);
		initBlockPlayer();
		initAddFriend();
	}

}