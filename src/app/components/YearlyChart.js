import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function YearlyChart({ transactions, year }) {
  const monthlyCashTotals = Array(12).fill(0);
  const monthlyOnlineTotals = Array(12).fill(0);

  transactions?.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (date.getFullYear() === year) {
      const month = date.getMonth(); // 0 = January, 11 = December
      if (transaction.mode === 'cash') {
        monthlyCashTotals[month] += transaction.amount;
      } else {
        monthlyOnlineTotals[month] += transaction.amount;
      }
    }
  });

  const chartData = {
    labels: [...Array(12)].map((_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'long' })
    ),
    datasets: [
      {
        label: 'Cash Transactions',
        data: monthlyCashTotals,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Online Transactions',
        data: monthlyOnlineTotals,
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
}
