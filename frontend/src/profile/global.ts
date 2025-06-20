import {Chart, PieController, ArcElement, Tooltip, Legend,LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement ,Filler} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartConfiguration } from 'chart.js';
import initError from '../error';
import { loadRoutes } from '../main';
import { initLanguageSelector } from '../language';
import { translate } from '../i18n';

export default async function initOverallStats() {
	let response;
	try {
		response = await fetch('/api/verifuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
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
	} catch (err) {
		console.error('Error verifying user:', err);
		return ;
	}
	const info = await response.json();
	await initLanguageSelector(info.original);
	initGlobalGraph(info.original);
}

let lineChartInstance: Chart | null = null;
let pieChartInstance: Chart | null = null;

export async function initGlobalGraph(originalUsername: string) {
	try {
		Chart.register(
			PieController, ArcElement, Tooltip, Legend,
			LineController, LineElement, PointElement,
			LinearScale, CategoryScale, Filler,
			ChartDataLabels, BarController, BarElement
		);

		const statsRes = await fetch('/api/stats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});
		const stats = await statsRes.json();

		const historyRes = await fetch('/api/history', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ }),
			credentials: 'include',
		});
		const history = await historyRes.json();

		const point_earned = document.getElementById('point_earned') as HTMLDivElement;
		point_earned.textContent = `${stats.total_points}`;
		const game_played = document.getElementById('game_played') as HTMLDivElement;
		game_played.textContent = `${stats.games_played}`;
		const averagepoint = document.getElementById('avg_point') as HTMLDivElement;
		if (stats.games_played > 0) {
			averagepoint.textContent = `${(stats.total_points / stats.games_played).toFixed(2)}`;
		}
		else averagepoint.textContent = '0';

		const historyMap = new Map<string, { points: number, wins: number, loses: number }>();
		history.forEach((match: any) => {
			const date = new Date(match.date);
			const isWin = match.usernameplayer1 === originalUsername
				? match.pointplayer1 > match.pointplayer2
				: match.pointplayer2 > match.pointplayer1;

			const roundedDate = new Date(Math.floor(date.getTime() / (10 * 60 * 1000)) * (10 * 60 * 1000));
			const roundedKey = roundedDate.toISOString().slice(0, 16).replace('T', ' ');

			if (!historyMap.has(roundedKey)) {
				historyMap.set(roundedKey, { points: 0, wins: 0, loses: 0 });
			}

			const entry = historyMap.get(roundedKey)!;
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

			if (lineChartInstance) {
				lineChartInstance.destroy();
			}
			lineChartInstance = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [
						{
							label: translate("point_trad"),
							data: pointsData,
							borderColor: '#FFD700',
						},
						{
							label: translate("win_trad"),
							data: winsData,
							borderColor: '#00FF00',
						},
						{
							label: translate("lose_trad"),
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

			if (pieChartInstance) {
				pieChartInstance.destroy();
			}
			const wins = stats.wins;
			const winsText = translate('win_trad')
			const loses = stats.loses;
			const loseText = translate('lose_trad');

			const config: ChartConfiguration<'pie'> = {
				type: 'pie',
				data: {
					labels: [winsText, loseText],
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

			pieChartInstance = new Chart(ctx, config);
		}
	} catch (err) {
		console.error('Error loading graph:', err);
	}
}
