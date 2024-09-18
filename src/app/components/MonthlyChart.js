import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MonthlyChart({ transactions }) {
  const expenseData = {};
  const incomeData = {};

  transactions?.forEach((transaction) => {
    const data = transaction.type === 'expense' ? expenseData : incomeData;
    if (data[transaction.category]) {
      data[transaction.category] += transaction.amount;
    } else {
      data[transaction.category] = transaction.amount;
    }
  });

  const expenseChartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        data: Object.values(expenseData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const incomeChartData = {
    labels: Object.keys(incomeData),
    datasets: [
      {
        data: Object.values(incomeData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row justify-around mt-8">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <h2 className="text-xl font-bold mb-2">Expense Breakdown</h2>
        <Pie data={expenseChartData} />
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-bold mb-2">Income Breakdown</h2>
        <Pie data={incomeChartData} />
      </div>
    </div>
  );
}