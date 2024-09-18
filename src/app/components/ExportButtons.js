import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function ExportButtons({ transactions }) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [['Description', 'Amount', 'Type', 'Category', 'Mode', 'Date']],
      body: transactions.map((transaction) => [
        transaction.description,
        transaction.amount.toFixed(2),
        transaction.type,
        transaction.category,
        transaction.mode,
        new Date(transaction.date).toLocaleDateString('en-GB'),
      ]),
    });
    doc.save('transactions.pdf');
  };

  const csvData = transactions.map((transaction) => ({
    Description: transaction.description,
    Amount: transaction.amount.toFixed(2),
    Type: transaction.type,
    Category: transaction.category,
    Mode: transaction.mode,
    Date: new Date(transaction.date).toLocaleDateString('en-GB'),
  }));

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
