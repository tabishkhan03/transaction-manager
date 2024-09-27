// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';

// export default function ExportButtons({ transactions, cashBalance, onlineBalance, totalCashExpense, totalOnlineExpense }) {
//   // Handle PDF Export
//   const handleExportPDF = () => {
//     const doc = new jsPDF();
    
//     // Add a Unicode-compatible font
//     doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
//     doc.setFont('Roboto');

//     doc.text('Transaction Report', 14, 16);

//     // Function to add text with rupee symbol
//     const addRupeeText = (text, x, y) => {
//       doc.text('\u20B9 ' + text, x, y); // \u20B9 is the Unicode for the rupee symbol
//     };

//     // Add balance and expense information at the top
//     addRupeeText(`Cash Balance: ${cashBalance.toFixed(2)}`, 14, 24);
//     addRupeeText(`Online Balance: ${onlineBalance.toFixed(2)}`, 14, 32);
//     addRupeeText(`Total Cash Expense: ${totalCashExpense.toFixed(2)}`, 14, 40);
//     addRupeeText(`Total Online Expense: ${totalOnlineExpense.toFixed(2)}`, 14, 48);

//     // Create a table for transactions
//     autoTable(doc, {
//       startY: 56,
//       head: [['Description', 'Amount', 'Type', 'Category', 'Mode', 'Date']],
//       body: transactions.map((transaction) => [
//         transaction.description,
//         `\u20B9 ${transaction.amount.toFixed(2)}`,
//         transaction.type,
//         transaction.category,
//         transaction.mode,
//         new Date(transaction.date).toLocaleDateString('en-GB'),
//       ]),
//       didParseCell: (data) => {
//         // Highlight income rows in green
//         if (data.row.index > 0 && transactions[data.row.index - 1].type === 'income') {
//           data.cell.styles.fillColor = [144, 238, 144]; // light green color for income rows
//         }
//       },
//       styles: { font: 'Roboto' },
//       headStyles: { font: 'Roboto' },
//     });

//     doc.save('transactions.pdf');
//   };

//   // Prepare CSV data (unchanged)
//   const csvData = [
//     {
//       Description: 'Cash Balance',
//       Amount: `₹${cashBalance.toFixed(2)}`,
//       Type: '',
//       Category: '',
//       Mode: '',
//       Date: ''
//     },
//     {
//       Description: 'Online Balance',
//       Amount: `₹${onlineBalance.toFixed(2)}`,
//       Type: '',
//       Category: '',
//       Mode: '',
//       Date: ''
//     },
//     {
//       Description: 'Total Cash Expense',
//       Amount: `₹${totalCashExpense.toFixed(2)}`,
//       Type: '',
//       Category: '',
//       Mode: '',
//       Date: ''
//     },
//     {
//       Description: 'Total Online Expense',
//       Amount: `₹${totalOnlineExpense.toFixed(2)}`,
//       Type: '',
//       Category: '',
//       Mode: '',
//       Date: ''
//     },
//     ...transactions.map((transaction) => ({
//       Description: transaction.description,
//       Amount: `₹${transaction.amount.toFixed(2)}`,
//       Type: transaction.type,
//       Category: transaction.category,
//       Mode: transaction.mode,
//       Date: new Date(transaction.date).toLocaleDateString('en-GB'),
//     }))
//   ];

//   return (
//     <div className="flex gap-4 mb-4">
//       <button onClick={handleExportPDF} className="btn-primary">
//         Download PDF
//       </button>
//       <CSVLink data={csvData} filename="transactions.csv" className="btn-primary">
//         Download Excel
//       </CSVLink>
//     </div>
//   );
// }


import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function ExportButtons({ transactions, cashBalance, onlineBalance, totalCashExpense, totalOnlineExpense }) {
  // Sort transactions by date, oldest first
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate running balances
  let runningCashBalance = 0;
  let runningOnlineBalance = 0;
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
        `\u20B9${Math.abs(transaction.balance).toFixed(2)} ${transaction.balance >= 0 ? 'CR' : 'DR'}`
      ]),
      didParseCell: (data) => {
        if (data.row.index > 0 && transactionsWithBalance[data.row.index - 1].type === 'income') {
          data.cell.styles.fillColor = [144, 238, 144]; // light green color for income rows
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
      Balance: `₹${Math.abs(transaction.balance).toFixed(2)} ${transaction.balance >= 0 ? 'CR' : 'DR'}`
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