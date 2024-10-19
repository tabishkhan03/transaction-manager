import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function ExportButtons({carriedOnlineBalance, carriedCashBalance, transactions, cashBalance, onlineBalance, totalCashExpense, totalOnlineExpense }) {
  // Sort transactions by date, oldest first
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate running balances
  let runningCashBalance = carriedCashBalance;
  let runningOnlineBalance = carriedOnlineBalance;
  
  const transactionsWithBalance = sortedTransactions.map(transaction => {
    if (transaction.mode === 'cash') {
      runningCashBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      return { ...transaction, balance: runningCashBalance };
    } else {
      runningOnlineBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      return { ...transaction, balance: runningOnlineBalance };
    }
  });

  // Handle PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    doc.text('Transaction Report', 14, 16);

    // Add balance and expense information at the top
    doc.text(`Cash Balance: \u20B9${cashBalance.toFixed(2)}`, 14, 24);
    doc.text(`Online Balance: \u20B9${onlineBalance.toFixed(2)}`, 14, 32);
    doc.text(`Total Cash Expense: \u20B9${totalCashExpense.toFixed(2)}`, 14, 40);
    doc.text(`Total Online Expense: \u20B9${totalOnlineExpense.toFixed(2)}`, 14, 48);

    // Create a table for transactions
    autoTable(doc, {
      startY: 56,
      head: [['Date', 'Description', 'Amount', 'Type', 'Category', 'Mode', 'Balance']],
      body: transactionsWithBalance.map((transaction) => [
        new Date(transaction.date).toLocaleDateString('en-GB'),
        transaction.description,
        `\u20B9${transaction.amount.toFixed(2)}`,
        transaction.type,
        transaction.category,
        transaction.mode,
        transaction.balance >= 0 
      ? [`₹${transaction.balance.toFixed(2)}`, 'CR'] 
      : [`-₹${Math.abs(transaction.balance).toFixed(2)}`, 'DR']
      ]),
      didParseCell: (data) => {
        const transaction = transactions[data.row.index];
    
        // Highlight rows based on income/expense
        if (transaction?.type === 'income') {
          data.cell.styles.fillColor = [144, 238, 144]; // Light green for income rows
        }
    
        // Style balance column in red or green
        if (data.column.index === 6) { // Check if the current column is the Balance column
          const balance = data.cell.raw; // Get the raw value of the cell
          if (balance[1] === 'CR') {
            data.cell.styles.textColor = [0, 128, 0]; // Green for positive balances
          } else {
            data.cell.styles.textColor = [255, 0, 0]; // Red for negative balances
          }
        }
      },
      styles: { font: 'Roboto' },
      headStyles: { font: 'Roboto', fillColor: [200, 220, 240] },
    });

    doc.save('transactions.pdf');
  };

  // Prepare CSV data
  const csvData = [
    { Date: '', Description: 'Cash Balance', Amount: `₹${cashBalance.toFixed(2)}`, Type: '', Category: '', Mode: '', Balance: '' },
    { Date: '', Description: 'Online Balance', Amount: `₹${onlineBalance.toFixed(2)}`, Type: '', Category: '', Mode: '', Balance: '' },
    { Date: '', Description: 'Total Cash Expense', Amount: `₹${totalCashExpense.toFixed(2)}`, Type: '', Category: '', Mode: '', Balance: '' },
    { Date: '', Description: 'Total Online Expense', Amount: `₹${totalOnlineExpense.toFixed(2)}`, Type: '', Category: '', Mode: '', Balance: '' },
    ...transactionsWithBalance.map((transaction) => ({
      Date: new Date(transaction.date).toLocaleDateString('en-GB'),
      Description: transaction.description,
      Amount: `₹${transaction.amount.toFixed(2)}`,
      Type: transaction.type,
      Category: transaction.category,
      Mode: transaction.mode,
      Balance: `${transaction.balance >= 0 ? '' : '-'}₹${Math.abs(transaction.balance).toFixed(2)} ${transaction.balance >= 0 ? 'CR' : 'DR'}`
    }))
  ];

  return (
    <div className="flex gap-4 mb-4">
      <button onClick={handleExportPDF} className="btn-primary">
        Download PDF
      </button>
      <CSVLink data={csvData} filename="transactions.csv" className="btn-primary">
        Download Excel
      </CSVLink>
    </div>
  );
}