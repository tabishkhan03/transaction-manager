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
  const [cashBalance, setCashBalance] = useState(0);
  const [onlineBalance, setOnlineBalance] = useState(0);
  const [totalCashExpense, setTotalCashExpense] = useState(0);
  const [totalOnlineExpense, setTotalOnlineExpense] = useState(0);
  const [carriedCashBalance, setCarriedCashBalance] = useState(0);
  const [carriedOnlineBalance, setCarriedOnlineBalance] = useState(0);

  // Filter Transactions
  const handleFilter = async (filters) => {
    let filtered = transactions.filter((transaction) => {
      return (
        (filters.month
          ? new Date(transaction.date).getMonth() + 1 === parseInt(filters.month)
          : true) &&
        (filters.year
          ? new Date(transaction.date).getFullYear() === parseInt(filters.year)
          : true) &&
        (filters.type ? transaction.type === filters.type : true) &&
        (filters.category ? transaction.category === filters.category : true)
      );
    });

    // Fetch previous month transactions to calculate the balance
    if (filters.month && filters.year) {
      const previousMonth = filters.month === '1' ? 12 : parseInt(filters.month) - 1;
      const previousYear = filters.month === '1' ? parseInt(filters.year) - 1 : filters.year;

      const previousMonthTransactions = transactions.filter((transaction) => {
        return (
          new Date(transaction.date).getMonth() + 1 === previousMonth &&
          new Date(transaction.date).getFullYear() === parseInt(previousYear)
        );
      });

      // Calculate the remaining balance from the previous month
      let carriedCash = 0;
      let carriedOnline = 0;

      previousMonthTransactions.forEach((transaction) => {
        if (transaction.mode === 'cash') {
          carriedCash +=
            transaction.type === 'income' ? transaction.amount : -transaction.amount;
        } else if (transaction.mode === 'online') {
          carriedOnline +=
            transaction.type === 'income' ? transaction.amount : -transaction.amount;
        }
      });

      // Set carried balances for the filtered month
      setCarriedCashBalance(carriedCash);
      setCarriedOnlineBalance(carriedOnline);
    }

    setFilteredTransactions(filtered);
    calculateBalances(filtered); // Update balances for the filtered data
  };

  // Reset filters
  const handleClearFilter = () => {
    setFilteredTransactions(transactions); // Reset to all transactions
    setCarriedCashBalance(0); // Reset Fcarried balance
    setCarriedOnlineBalance(0);
    calculateBalances(transactions); // Reset balances
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setFilteredTransactions(data); // Initialize filteredTransactions with all data
    calculateBalances(data); // Calculate initial balances
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add new transaction
  const handleAddTransaction = async (transaction) => {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    fetchTransactions();
  };

  // Delete a transaction
  const handleDeleteTransaction = async (id) => {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  // Edit a transaction
  const handleEditTransaction = async (transaction) => {
    await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    fetchTransactions();
  };

  // Calculate cash and online balances, and total expenses
  const calculateBalances = (transactions) => {
    let cash = 0;
    let online = 0;
    let cashExpense = 0;
    let onlineExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.mode === "cash") {
        if (transaction.type === "income") {
          cash += transaction.amount;
        } else {
          cash -= transaction.amount;
          cashExpense += transaction.amount;
        }
      } else if (transaction.mode === "online") {
        if (transaction.type === "income") {
          online += transaction.amount;
        } else {
          online -= transaction.amount;
          onlineExpense += transaction.amount;
        }
      }
    });

    setCashBalance(cash);
    setOnlineBalance(online);
    setTotalCashExpense(cashExpense);
    setTotalOnlineExpense(onlineExpense);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Display Balance */}
      <BalanceDisplay 
        cashBalance={cashBalance} 
        onlineBalance={onlineBalance} 
        totalCashExpense={totalCashExpense} 
        totalOnlineExpense={totalOnlineExpense} 
        carriedCashBalance={carriedCashBalance}
        carriedOnlineBalance={carriedOnlineBalance}
      />

      {/* Export Buttons with Transactions and Balances */}
      <ExportButtons 
        transactions={filteredTransactions} 
        cashBalance={cashBalance + carriedCashBalance} 
        onlineBalance={onlineBalance + carriedOnlineBalance}
        totalCashExpense={totalCashExpense}
        totalOnlineExpense={totalOnlineExpense}
        carriedCashBalance={carriedCashBalance}
        carriedOnlineBalance={carriedOnlineBalance}
      />


      {/* Transaction Form */}
      <TransactionForm onSubmit={handleAddTransaction} />

      {/* Transaction Filter */}
      <TransactionFilter onFilter={handleFilter} />
      <button onClick={handleClearFilter} className="btn-secondary mb-4">
        Clear Filter
      </button>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
        carriedCashBalance={carriedCashBalance}
        carriedOnlineBalance={carriedOnlineBalance}
      />

      {/* Monthly and Yearly Charts */}
      <MonthlyChart transactions={filteredTransactions} />
      <YearlyChart transactions={filteredTransactions} year={new Date().getFullYear()} />
    </div>
  );
}

