import {Chart, PieController, ArcElement, Tooltip, Legend,LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement ,Filler} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartConfiguration } from 'chart.js';
import initError from '../error';
import { loadRoutes } from '../main';
import { initLanguageSelector } from '../language';
import { translate } from '../i18n';

export default async function initTournamentStats() {
	try {
		const token = sessionStorage.getItem('token');
		const response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
			credentials: 'include',
		});
		if (!response.ok) {
			initError(translate('Error_co'));
			setTimeout(async () => {
				history.pushState(null, '', '/login');
				await loadRoutes('/login');
			}, 1000);
			return ;
		}
		const info = await response.json();
		await initLanguageSelector(info.original);
		initTournamentGraph(info.original);
	} catch (err) {
		console.error('Error verifying user:', err);
	}
}

let chartHistory: Chart | undefined;
let chartPie: Chart | undefined;

export async function initTournamentGraph(originalUsername: string) {
	try {
		const token = sessionStorage.getItem('token');

		Chart.register(
			PieController, ArcElement, Tooltip, Legend,
			LineController, LineElement, PointElement,
			LinearScale, CategoryScale, Filler,
			ChartDataLabels, BarController, BarElement
		);

		const statsRes = await fetch('/api/stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
			credentials: 'include',
		});
		const stats = await statsRes.json();

		const historyRes = await fetch('/api/history', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
			credentials: 'include',
		});
		const history = await historyRes.json();

		const tournaments_played = document.getElementById('tournaments_played') as HTMLDivElement;
		tournaments_played.textContent = `${stats.tournaments_played}`;

		const last_ranking = document.getElementById('last_ranking') as HTMLDivElement;
		if (stats.last_ranking.length === 6)
			last_ranking.textContent = translate('quarter-finalist');
		else if (stats.last_ranking.length === 17)
			last_ranking.textContent = translate('semi-finalist');
		else if (stats.last_ranking.length === 11)
			last_ranking.textContent = translate('finalist');
		else if (stats.last_ranking.length === 12)
			last_ranking.textContent = translate('winner');

		const tournamentMap = new Map<number, { date: string, points: number, wins: number, loses: number }>();

		history.forEach((match: any) => {
			if (match.tournament === 0) return;

			const tournamentId = match.tournamentId;

			const isWin = match.usernameplayer1 === originalUsername
				? match.pointplayer1 > match.pointplayer2
				: match.pointplayer2 > match.pointplayer1;

			const matchDate = new Date(match.date).toISOString().slice(0, 16).replace('T', ' ');
			if (!tournamentMap.has(tournamentId)) {
				tournamentMap.set(tournamentId, {
					date: matchDate,
					points: 0,
					wins: 0,
					loses: 0
				});
			}

			const entry = tournamentMap.get(tournamentId)!;
			entry.points += match.usernameplayer1 === originalUsername ? match.pointplayer1 : match.pointplayer2;
			if (isWin) entry.wins += 1;
			else entry.loses += 1;
		});

		const tournamentMapToArray = Array.from(tournamentMap.values());
		tournamentMapToArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		const labels = tournamentMapToArray.map(entry => entry.date);
		const pointsData = tournamentMapToArray.map(entry => entry.points);
		const winsData = tournamentMapToArray.map(entry => entry.wins);
		const losesData = tournamentMapToArray.map(entry => entry.loses);

		const canvasHistory = document.getElementById('graph-history-trend') as HTMLCanvasElement | null;
		if (canvasHistory) {
			const ctx = canvasHistory.getContext('2d');
			if (!ctx) throw new Error("Canvas context not found");

			if (chartHistory) chartHistory.destroy();

			chartHistory = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [
						{
							label: translate('point_trad'),
							data: pointsData,
							borderColor: '#FFD700',
							backgroundColor: '#FFD700',
						},
						{
							label: translate('win_trad'),
							data: winsData,
							borderColor: '#00FF00',
							backgroundColor: '#00FF00',
						},
						{
							label: translate('lose_trad'),
							data: losesData,
							borderColor: '#FF007A',
							backgroundColor: '#FF007A',
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true,
							grid: { color: '#00FFFF30' },
							ticks: { color: '#FFD700' }
						},
						x: {
							grid: { color: '#00FFFF30' },
							ticks: { color: '#FFD700' }
						}
					},
					plugins: {
						legend: {
							labels: { color: '#FFD700' }
						}
					}
				}
			});
		}

		const canvas = document.getElementById('graph-win-lose') as HTMLCanvasElement | null;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error("Canvas context not found");

			if (chartPie) chartPie.destroy();
			const wins = stats.tournaments_win;
			const loses = stats.tournaments_lose;

			const config: ChartConfiguration<'pie'> = {
				type: 'pie',
				data: {
					labels: ['Wins', 'Loses'],
					datasets: [{
						data: [wins, loses],
						backgroundColor: ['#00FF00', '#FF007A'],
						borderWidth: 0
					}]
				},
				options: {
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									const label = context.label || '';
									const value = context.raw as number;
									const total = context.dataset.data.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
									const percentage = ((value / total) * 100).toFixed(1);
									if (total === 0) return `${label}: ${value} 0%`;
									return `${label}: ${value} (${percentage}%)`;
								}
							}
						},
						legend: {
							display: false
						},
						datalabels: {
							color: '#fff',
							font: {
								weight: 'bold',
								size: 32
							},
							formatter: (value, context) => {
								const data = context.chart.data.datasets[0].data as number[];
								const total = data.reduce((a, b) => a + b, 0);
								const percentage = ((value / total) * 100).toFixed(1);
								if (total === 0) return `0%`;
								return `${percentage}%`;
							}
						}
					}
				},
				plugins: [ChartDataLabels]
			};

			chartPie = new Chart(ctx, config);
		}
	} catch (err) {
		console.error('Error loading graph:', err);
	}
}
