import {Chart, PieController,ArcElement,Tooltip,Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartConfiguration } from 'chart.js';


export default function initGlobalGraph() {
	
	Chart.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels);
	
	const canvas = document.getElementById('graph-win-lose') as HTMLCanvasElement | null;
	
	if (canvas) {
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error("Canvas context not found");
	
		const wins = 110;
		const loses = 46;
	
		const config: ChartConfiguration<'pie'> = {
			type: 'pie',
			data: {
				labels: ['Wins', 'Loses'],
				datasets: [{
					data: [wins, loses],
					backgroundColor: ['#007f5c', '#FF007A'],
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