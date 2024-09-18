"use client";
import { useState, useEffect } from "react";
import {
  BalanceDisplay,
  ExportButtons,
  MonthlyChart,
  TransactionFilter,
  TransactionForm,
  TransactionList,
  YearlyChart,
} from "./components";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const handleFilter = (filters) => {
    const filtered = transactions.filter((transaction) => {
      return (
        (filters.month ? new Date(transaction.date).getMonth() + 1 === parseInt(filters.month) : true) &&
        (filters.year ? new Date(transaction.date).getFullYear() === parseInt(filters.year) : true) &&
        (filters.type ? transaction.type === filters.type : true) &&
        (filters.category ? transaction.category === filters.category : true)
      );
    });

    setFilteredTransactions(filtered);
  };

  const handleClearFilter = () => {
    setFilteredTransactions(transactions); // Reset to all transactions
  };

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setFilteredTransactions(data); // Initialize filteredTransactions with all data
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (transaction) => {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    fetchTransactions();
  };

  const handleDeleteTransaction = async (id) => {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const handleEditTransaction = async (transaction) => {
    await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    fetchTransactions();
  };

  return (
    <div className="container mx-auto p-4">
      <BalanceDisplay transactions={filteredTransactions} />
      <ExportButtons transactions={filteredTransactions} />
      <TransactionForm onSubmit={handleAddTransaction} />
      <TransactionFilter onFilter={handleFilter} />
      <button onClick={handleClearFilter} className="btn-secondary mb-4">
        Clear Filter
      </button>
      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
      />
      <MonthlyChart transactions={filteredTransactions} />
      <YearlyChart transactions={filteredTransactions} year={new Date().getFullYear()} />
    </div>
  );
}
