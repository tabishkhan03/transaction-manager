// "use client";
// import { useState, useEffect } from "react";
// import {
//   BalanceDisplay,
//   ExportButtons,
//   MonthlyChart,
//   TransactionFilter,
//   TransactionForm,
//   TransactionList,
//   YearlyChart,
// } from "./components";

// export default function Home() {
//   const [transactions, setTransactions] = useState([]);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [cashBalance, setCashBalance] = useState(0);
//   const [onlineBalance, setOnlineBalance] = useState(0);

//   // Filter Transactions
//   const handleFilter = (filters) => {
//     const filtered = transactions.filter((transaction) => {
//       return (
//         (filters.month
//           ? new Date(transaction.date).getMonth() + 1 === parseInt(filters.month)
//           : true) &&
//         (filters.year ? new Date(transaction.date).getFullYear() === parseInt(filters.year) : true) &&
//         (filters.type ? transaction.type === filters.type : true) &&
//         (filters.category ? transaction.category === filters.category : true)
//       );
//     });

//     setFilteredTransactions(filtered);
//     calculateBalances(filtered); // Update balances based on filtered data
//   };

//   // Reset filters
//   const handleClearFilter = () => {
//     setFilteredTransactions(transactions); // Reset to all transactions
//     calculateBalances(transactions); // Reset balances
//   };

//   // Fetch transactions from API
//   const fetchTransactions = async () => {
//     const res = await fetch("/api/transactions");
//     const data = await res.json();
//     setTransactions(data);
//     setFilteredTransactions(data); // Initialize filteredTransactions with all data
//     calculateBalances(data); // Calculate initial balances
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Add new transaction
//   const handleAddTransaction = async (transaction) => {
//     await fetch("/api/transactions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(transaction),
//     });
//     fetchTransactions();
//   };

//   // Delete a transaction
//   const handleDeleteTransaction = async (id) => {
//     await fetch(`/api/transactions/${id}`, {
//       method: "DELETE",
//     });
//     fetchTransactions();
//   };

//   // Edit a transaction
//   const handleEditTransaction = async (transaction) => {
//     await fetch(`/api/transactions/${transaction._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(transaction),
//     });
//     fetchTransactions();
//   };

//   // Calculate cash and online balances
//   const calculateBalances = (transactions) => {
//     const cash = transactions.reduce((acc, transaction) => {
//       if (transaction.mode === "cash") {
//         return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
//       }
//       return acc;
//     }, 0);

//     const online = transactions.reduce((acc, transaction) => {
//       if (transaction.mode === "online") {
//         return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
//       }
//       return acc;
//     }, 0);

//     setCashBalance(cash);
//     setOnlineBalance(online);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Display Balance */}
//       <BalanceDisplay transactions={filteredTransactions} cashBalance={cashBalance} onlineBalance={onlineBalance} />

//       {/* Export Buttons with Transactions and Balances */}
//       <ExportButtons transactions={filteredTransactions} cashBalance={cashBalance} onlineBalance={onlineBalance} />

//       {/* Transaction Form */}
//       <TransactionForm onSubmit={handleAddTransaction} />

//       {/* Transaction Filter */}
//       <TransactionFilter onFilter={handleFilter} />
//       <button onClick={handleClearFilter} className="btn-secondary mb-4">
//         Clear Filter
//       </button>

//       {/* Transaction List */}
//       <TransactionList
//         transactions={filteredTransactions}
//         onDelete={handleDeleteTransaction}
//         onEdit={handleEditTransaction}
//       />

//       {/* Monthly and Yearly Charts */}
//       <MonthlyChart transactions={filteredTransactions} />
//       <YearlyChart transactions={filteredTransactions} year={new Date().getFullYear()} />
//     </div>
//   );
// }



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

  // Filter Transactions
  const handleFilter = (filters) => {
    const filtered = transactions.filter((transaction) => {
      return (
        (filters.month
          ? new Date(transaction.date).getMonth() + 1 === parseInt(filters.month)
          : true) &&
        (filters.year ? new Date(transaction.date).getFullYear() === parseInt(filters.year) : true) &&
        (filters.type ? transaction.type === filters.type : true) &&
        (filters.category ? transaction.category === filters.category : true)
      );
    });

    setFilteredTransactions(filtered);
    calculateBalances(filtered); // Update balances based on filtered data
  };

  // Reset filters
  const handleClearFilter = () => {
    setFilteredTransactions(transactions); // Reset to all transactions
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
      />

      {/* Export Buttons with Transactions and Balances */}
      <ExportButtons 
        transactions={filteredTransactions} 
        cashBalance={cashBalance} 
        onlineBalance={onlineBalance}
        totalCashExpense={totalCashExpense}
        totalOnlineExpense={totalOnlineExpense}
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
      />

      {/* Monthly and Yearly Charts */}
      <MonthlyChart transactions={filteredTransactions} />
      <YearlyChart transactions={filteredTransactions} year={new Date().getFullYear()} />
    </div>
  );
}