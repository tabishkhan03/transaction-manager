import { useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';

const expenseCategories = ['Transport', 'Food', 'Clothes', 'Accessories', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];

export default function TransactionForm({ onSubmit, initialData = null }) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [type, setType] = useState(initialData?.type || 'expense');
  const [category, setCategory] = useState(initialData?.category || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description, amount: parseFloat(amount), type, category });
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="input-field w-full"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="input-field w-full"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field w-full"
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-full"
          required
        >
          <option value="">Select category</option>
          {type === 'expense'
            ? expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            : incomeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
        </select>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
}