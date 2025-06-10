import {Chart, PieController, ArcElement, Tooltip, Legend,LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement ,Filler} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartConfiguration } from 'chart.js';
import initError from '../error';
import { loadRoutes } from '../main';

export default async function initTournamentStats() {

	const token = sessionStorage.getItem('token');
	const response = await fetch('/api/verifuser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token }),
	});
	if (!response.ok) {
		initError('Please Sign in or Sign up !');
		setTimeout(async () => {
			history.pushState(null, '', '/login');
			await loadRoutes('/login');
		}, 1000);
		return;
	}
	const info = await response.json();
	initGlobalGraph(info.id_user, info.original)
}

export async function initGlobalGraph(userId: string, originalUsername: string) {

	Chart.register(
		PieController, ArcElement, Tooltip, Legend,
		LineController, LineElement, PointElement,
		LinearScale, CategoryScale, Filler,
		ChartDataLabels, BarController, BarElement
	);
	const statsRes = await fetch('/api/stats', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId })
	});
	const stats = await statsRes.json();

	const historyRes = await fetch('/api/history', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId })
	});
	const history = await historyRes.json();

	const tournaments_played = document.getElementById('tournaments_played') as HTMLDivElement;
	tournaments_played.textContent = `${stats.tournaments_played}`;
	const best_ranking = document.getElementById('best_ranking') as HTMLDivElement;
	best_ranking.textContent = `final`;

	const historyMap = new Map<string, { points: number, wins: number, loses: number }>();
	history.forEach((match: any) => {
		if (match.tournament === 0) return;
		const date = match.date.split('T')[0];
		const isWin = match.usernameplayer1 === originalUsername
			? match.pointplayer1 > match.pointplayer2
			: match.pointplayer2 > match.pointplayer1;

		if (!historyMap.has(date)) {
			historyMap.set(date, { points: 0, wins: 0, loses: 0 });
		}

		const entry = historyMap.get(date)!;
		entry.points += match.usernameplayer1 === originalUsername ? match.pointplayer1 : match.pointplayer2;
		if (isWin) entry.wins += 1;
		else entry.loses += 1;
	});

	const labels = Array.from(historyMap.keys()).sort();
	const pointsData = labels.map(date => historyMap.get(date)!.points);
	const winsData = labels.map(date => historyMap.get(date)!.wins);
	const losesData = labels.map(date => historyMap.get(date)!.loses);

	const canvasHistory = document.getElementById('graph-history-trend') as HTMLCanvasElement | null;

	if (canvasHistory) {
		const ctx = canvasHistory.getContext('2d');
		if (!ctx) throw new Error("Canvas context not found");

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Points',
						data: pointsData,
						borderColor: '#FFD700',
					},
					{
						label: 'Wins',
						data: winsData,
						borderColor: '#00FF00',
					},
					{
						label: 'Loses',
						data: losesData,
						borderColor: '#FF007A',
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
							return `${percentage}%`;
						}
					}
				}
			},
			plugins: [ChartDataLabels]
		};
	
		new Chart(ctx, config);
	}
}