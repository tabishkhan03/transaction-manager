import { FaTrash, FaEdit, FaRupeeSign } from 'react-icons/fa';

export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-600">
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Mode</th> {/* New column */}
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-b dark:border-gray-600">
              <td className="px-4 py-2">{transaction.description}</td>
              <td className="px-4 py-2 flex items-center">
                <FaRupeeSign className="mr-1" />
                {transaction.amount.toFixed(2)}
              </td>
              <td className="px-4 py-2">{transaction.type}</td>
              <td className="px-4 py-2">{transaction.category}</td>
              <td className="px-4 py-2">{transaction.mode}</td> {/* New mode column */}
              <td className="px-4 py-2">
                {new Date(transaction.date).toLocaleDateString('en-GB')} {/* Updated to DD/MM/YYYY format */}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
