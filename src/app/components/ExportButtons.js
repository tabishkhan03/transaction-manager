import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function ExportButtons({ transactions, cashBalance, onlineBalance }) {
  // Handle PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 16);

    // Add balance information at the top
    doc.text(`Cash Balance: ₹${cashBalance.toFixed(2)}`, 14, 24);
    doc.text(`Online Balance: ₹${onlineBalance.toFixed(2)}`, 14, 32);

    // Create a table for transactions
    autoTable(doc, {
      startY: 40,
      head: [['Description', 'Amount', 'Type', 'Category', 'Mode', 'Date']],
      body: transactions.map((transaction) => [
        transaction.description,
        transaction.amount.toFixed(2),
        transaction.type,
        transaction.category,
        transaction.mode,
        new Date(transaction.date).toLocaleDateString('en-GB'),
      ]),
      didParseCell: (data) => {
        // Highlight income rows in green
        if (transactions[data.row.index].type === 'income') {
          data.cell.styles.fillColor = [144, 238, 144]; // light green color for income rows
        }
      }
    });

    doc.save('transactions.pdf');
  };

  // Prepare CSV data
  const csvData = [
    {
      Description: 'Cash Balance',
      Amount: `₹${cashBalance.toFixed(2)}`,
      Type: '',
      Category: '',
      Mode: '',
      Date: ''
    },
    {
      Description: 'Online Balance',
      Amount: `₹${onlineBalance.toFixed(2)}`,
      Type: '',
      Category: '',
      Mode: '',
      Date: ''
    },
    ...transactions.map((transaction) => ({
      Description: transaction.description,
      Amount: transaction.amount.toFixed(2),
      Type: transaction.type,
      Category: transaction.category,
      Mode: transaction.mode,
      Date: new Date(transaction.date).toLocaleDateString('en-GB'),
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
