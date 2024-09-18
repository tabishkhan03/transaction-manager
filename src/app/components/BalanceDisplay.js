import { useEffect, useState } from 'react';

export default function BalanceDisplay({ transactions }) {
  const [cashBalance, setCashBalance] = useState(0);
  const [onlineBalance, setOnlineBalance] = useState(0);

  useEffect(() => {
    const cash = transactions.reduce((acc, transaction) => {
      if (transaction.mode === 'cash') {
        return transaction.type === 'income'
          ? acc + transaction.amount
          : acc - transaction.amount;
      }
      return acc;
    }, 0);

    const online = transactions.reduce((acc, transaction) => {
      if (transaction.mode === 'online') {
        return transaction.type === 'income'
          ? acc + transaction.amount
          : acc - transaction.amount;
      }
      return acc;
    }, 0);

    setCashBalance(cash);
    setOnlineBalance(online);
  }, [transactions]);

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">Balance</h2>
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg">Cash Balance</h3>
          <p>₹{cashBalance.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-lg">Online Balance</h3>
          <p>₹{onlineBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
