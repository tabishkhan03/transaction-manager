import { useState } from 'react';

export default function TransactionFilter({ onFilter }) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ month, year, type, category });
  };

  return (
    <form onSubmit={handleFilter} className="mb-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input-field w-full"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="input-field w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field w-full"
        >
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-full"
        >
          <option value="">All Categories</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
          <option value="Accessories">Accessories</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Investment">Investment</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="btn-primary"
        >
          Filter
        </button>
      </div>
    </form>
  );
}
