
export default async function initGlobalstats(username: string) {
	try {
		const statsRes = await fetch('/api/stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username }),
			credentials: 'include',
		});
		const stats = await statsRes.json();

		const totalgame = document.getElementById('total_games') as HTMLParagraphElement;
		const winsgame = document.getElementById('wins_game') as HTMLParagraphElement;
		const lostgame = document.getElementById('lost_game') as HTMLParagraphElement;
		const tournamentp = document.getElementById('tournament_played') as HTMLParagraphElement;
		const tournamentw = document.getElementById('tournament_won') as HTMLParagraphElement;
		const tournamentl = document.getElementById('tournament_lost') as HTMLParagraphElement;
		const totalpoints = document.getElementById('total_points') as HTMLParagraphElement;
		const averagepoint = document.getElementById('average_points') as HTMLParagraphElement;

		totalgame.textContent = `${stats.games_played}`;
		winsgame.textContent = `${stats.wins}`;
		lostgame.textContent = `${stats.loses}`;
		tournamentp.textContent = `${stats.tournaments_played}`;
		tournamentw.textContent = `${stats.tournaments_win}`;
		tournamentl.textContent = `${stats.tournaments_lose}`;
		totalpoints.textContent = `${stats.total_points}`;
		if (stats.games_played > 0) {
			averagepoint.textContent = `${(stats.total_points / stats.games_played).toFixed(2)}`;
		}
	} catch (err) {
		console.error('Error initializing global statistics:', err);
	}
}
