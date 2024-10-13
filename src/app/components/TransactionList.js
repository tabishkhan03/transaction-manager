import React from 'react';
import { FaTrash, FaEdit, FaRupeeSign } from 'react-icons/fa';

export default function TransactionList({ transactions, onDelete, onEdit, carriedCashBalance = 0, carriedOnlineBalance = 0 }) {
  // Sort transactions by date, oldest first
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Initialize balances with carried-over values
  let cashBalance = carriedCashBalance;
  let onlineBalance = carriedOnlineBalance;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-600">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Mode</th>
            <th className="px-4 py-2 text-left">Balance (Cash / Online)</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            // Update balances as we iterate through transactions
            if (transaction.mode === 'cash') {
              cashBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
            } else if (transaction.mode === 'online') {
              onlineBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
            }

            const currentBalance = transaction.mode === 'cash' ? cashBalance : onlineBalance;

            // Format date as dd/mm/yy
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB');

            return (
              <tr key={transaction._id} className="border-b dark:border-gray-600">
                <td className="px-4 py-2">{formattedDate}</td>
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2 flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {transaction.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2">{transaction.type}</td>
                <td className="px-4 py-2">{transaction.mode}</td>
                <td className={`px-4 py-2 flex items-center ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentBalance >= 0 ? '' : '- '}
                  <FaRupeeSign className="mr-1" />
                  {Math.abs(currentBalance).toFixed(2)}
                  {currentBalance >= 0 ? ' CR' : ' DR'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="mr-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
