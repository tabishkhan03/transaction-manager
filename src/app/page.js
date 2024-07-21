'use client';

import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import TransactionFilter from './components/TransactionFilter';
import MonthlyChart from './components/MonthlyChart';
// import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    const queryParams = new URLSearchParams(filter).toString();
    const res = await fetch(`/api/transactions?${queryParams}`);
    const data = await res.json();
    setTransactions(data);
  };

  const handleSubmit = async (transactionData) => {
    if (editingTransaction) {
      await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
      setEditingTransaction(null);
    } else {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });
    }
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleFilter = (filterData) => {
    setFilter(filterData);
  };

  return (
    <>
      {/* <ThemeToggle /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Transaction Tracker</h1>
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <TransactionForm onSubmit={handleSubmit} initialData={editingTransaction} />
        </div>
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Transactions</h2>
          <TransactionFilter onFilter={handleFilter} />
        </div>
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
          <MonthlyChart transactions={transactions} />
        </div>
      </div>
    </>
  );
}