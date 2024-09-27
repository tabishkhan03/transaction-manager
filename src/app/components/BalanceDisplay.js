// export default function BalanceDisplay({ cashBalance, onlineBalance }) {
//   return (
//     <div className="mb-4">
//       <h2 className="text-2xl font-bold">Balance</h2>
//       <div className="flex justify-between">
//         <div>
//           <h3 className="text-lg">Cash Balance</h3>
//           <p>₹{cashBalance.toFixed(2)}</p>
//         </div>
//         <div>
//           <h3 className="text-lg">Online Balance</h3>
//           <p>₹{onlineBalance.toFixed(2)}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { FaRupeeSign } from 'react-icons/fa';

export default function BalanceDisplay({ cashBalance, onlineBalance, totalCashExpense, totalOnlineExpense }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Cash Balance</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {cashBalance.toFixed(2)}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Online Balance</h2>
        <p className="text-2xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" />
          {onlineBalance.toFixed(2)}
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