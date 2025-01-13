import React from 'react';
import { jsPDF } from 'jspdf';

const ReportDownload: React.FC = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Hello! This is a test PDF.', 10, 10);
    doc.save('Test_Report.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
    >
      Download Test PDF
    </button>
  );
};

export default ReportDownload;
