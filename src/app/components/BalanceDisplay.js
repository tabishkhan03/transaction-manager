import React from 'react';
import { FaRupeeSign } from 'react-icons/fa';

export default function BalanceDisplay({ cashBalance, onlineBalance, totalCashExpense, totalOnlineExpense, carriedCashBalance, carriedOnlineBalance }) {
  // Include carried balances in the total balances
  const totalCashBalance = cashBalance + carriedCashBalance;
  const totalOnlineBalance = onlineBalance + carriedOnlineBalance;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Cash Balance</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {totalCashBalance.toFixed(2)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Online Balance</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {totalOnlineBalance.toFixed(2)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Total Cash Expense</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {totalCashExpense.toFixed(2)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Total Online Expense</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {totalOnlineExpense.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
