// import { Chart } from 'chart.js';

// const pieChart = new Chart(document.getElementById('pieChart') as HTMLCanvasElement, {
//   type: 'pie',
//   data: {
//     labels: ['Victoires', 'Défaites'],
//     datasets: [{
//       data: [110, 46],
//       backgroundColor: ['#22c55e', '#ef4444'],
//     }],
//   },
//   options: {
//     responsive: true,
//   },
// });

// const lineChart = new Chart(document.getElementById('lineChart') as HTMLCanvasElement, {
//   type: 'line',
//   data: {
//     labels: Array.from({ length: 10 }, (_, i) => `Jour ${i + 1}`),
//     datasets: [
//       {
//         label: 'Partie jouées',
//         data: [10, 12, 15, 9, 13, 14, 16, 18, 20, 22],
//         borderColor: '#facc15',
//         hidden: true,
//       },
//       {
//         label: 'Victoires',
//         data: [5, 7, 6, 4, 8, 9, 10, 11, 12, 14],
//         borderColor: '#22c55e',
//         hidden: true,
//       },
//       {
//         label: 'Défaites',
//         data: [5, 5, 9, 5, 5, 5, 6, 7, 8, 8],
//         borderColor: '#ef4444',
//         hidden: true,
//       },
//       {
//         label: 'Points gagnés',
//         data: [30, 40, 50, 35, 45, 48, 55, 60, 70, 75],
//         borderColor: '#3b82f6',
//         hidden: true,
//       }
//     ],
//   },
//   options: {
//     responsive: true,
//   }
// });

// // Ajouter la logique des checkboxes
// document.getElementById('filter-games')?.addEventListener('change', function () {
//   lineChart.data.datasets[0].hidden = !(this as HTMLInputElement).checked;
//   lineChart.update();
// });

// document.getElementById('filter-victories')?.addEventListener('change', function () {
//   lineChart.data.datasets[1].hidden = !(this as HTMLInputElement).checked;
//   lineChart.update();
// });

// document.getElementById('filter-defeats')?.addEventListener('change', function () {
//   lineChart.data.datasets[2].hidden = !(this as HTMLInputElement).checked;
//   lineChart.update();
// });

// document.getElementById('filter-points')?.addEventListener('change', function () {
//   lineChart.data.datasets[3].hidden = !(this as HTMLInputElement).checked;
//   lineChart.update();
// });
