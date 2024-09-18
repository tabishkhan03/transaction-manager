import { useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';;

const expenseCategories = ['Transport', 'Food', 'Clothes', 'Accessories', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];

export default function TransactionForm({ onSubmit, initialData = null }) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [type, setType] = useState(initialData?.type || 'expense');
  const [category, setCategory] = useState(initialData?.category || '');
  const [mode, setMode] = useState(initialData?.mode || 'cash');  // New state for mode of payment
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '');  // New state for date

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description, amount: parseFloat(amount), type, category, mode, date });
    toast.success(`${initialData ? 'Updated' : 'Added'} Transaction Successfully`);
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setMode('cash');
    setDate('');
  };

  return (
    <>
    <ToastContainer />
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
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="input-field w-full"
          required
        >
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field w-full"
          required
        />
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
    </>
  );
}
