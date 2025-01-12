import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const doc = new jsPDF();
autoTable(doc, {
  head: [['Column 1', 'Column 2']],
  body: [['Data 1', 'Data 2']],
});

interface ReportDownloadProps {
  customerAddress: string;
  currentVentilation: any[];
  intakeCompliance: number | null;
  exhaustCompliance: number | null;
  proposedVentilation: any[];
  proposedIntakeCompliance: number | null;
  proposedExhaustCompliance: number | null;
  requiredNFA: number | null;
  intakeNFA: number | null;
  exhaustNFA: number | null;
  proposedIntakeNFA: number | null;
  proposedExhaustNFA: number | null;
}

const ReportDownload: React.FC<ReportDownloadProps> = ({
  customerAddress,
  currentVentilation,
  intakeCompliance,
  exhaustCompliance,
  proposedVentilation,
  proposedIntakeCompliance,
  proposedExhaustCompliance,
  requiredNFA,
  intakeNFA,
  exhaustNFA,
  proposedIntakeNFA,
  proposedExhaustNFA,
}) => {
  const getStatusColor = (compliance: number) => (compliance >= 100 ? '#28a745' : '#dc3545');
  const getStatusText = (compliance: number) => (compliance >= 100 ? 'Pass' : 'Fail');

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Ready Roof VentCheck Scorecard', 105, 15, { align: 'center' });

    // Add spacing after title (3 line breaks)
    let yPosition = 45;

    // Customer Address
    if (customerAddress) {
      doc.setFontSize(12);
      doc.text(`Customer Address: ${customerAddress}`, 10, yPosition);
      yPosition += 10;
    }

    // Current Ventilation System
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Current Ventilation System', 10, yPosition + 15);
    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: yPosition + 20,
      head: [['Vent Type', 'Quantity']],
      body: currentVentilation.map((vent) => [vent.ventType, vent.quantity]),
    });
    doc.text(`Required NFA: ${requiredNFA?.toFixed(2)} square inches`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Current Exhaust NFA: ${exhaustNFA?.toFixed(2)} square inches`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Current Intake NFA: ${intakeNFA?.toFixed(2)} square inches`, 10, doc.lastAutoTable.finalY + 30);
    doc.setTextColor(getStatusColor(exhaustCompliance || 0));
    doc.text(`Exhaust Compliance: ${exhaustCompliance?.toFixed(2)}% (${getStatusText(exhaustCompliance || 0)})`, 10, doc.lastAutoTable.finalY + 40);
    doc.setTextColor(getStatusColor(intakeCompliance || 0));
    doc.text(`Intake Compliance: ${intakeCompliance?.toFixed(2)}% (${getStatusText(intakeCompliance || 0)})`, 10, doc.lastAutoTable.finalY + 50);

    // Proposed Ventilation System
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Proposed Ventilation System', 10, doc.lastAutoTable.finalY + 65);
    doc.setFont('helvetica', 'normal');
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 70,
      head: [['Vent Type', 'Quantity']],
      body: proposedVentilation.map((vent) => [vent.ventType, vent.quantity]),
    });
    doc.text(`Proposed Exhaust NFA: ${proposedExhaustNFA?.toFixed(2)} square inches`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Proposed Intake NFA: ${proposedIntakeNFA?.toFixed(2)} square inches`, 10, doc.lastAutoTable.finalY + 20);
    doc.setTextColor(getStatusColor(proposedExhaustCompliance || 0));
    doc.text(`Proposed Exhaust Compliance: ${proposedExhaustCompliance?.toFixed(2)}% (${getStatusText(proposedExhaustCompliance || 0)})`, 10, doc.lastAutoTable.finalY + 30);
    doc.setTextColor(getStatusColor(proposedIntakeCompliance || 0));
    doc.text(`Proposed Intake Compliance: ${proposedIntakeCompliance?.toFixed(2)}% (${getStatusText(proposedIntakeCompliance || 0)})`, 10, doc.lastAutoTable.finalY + 40);

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      'Balanced intake and exhaust ventilation prevents moisture buildup in winter and reduces heat in summer to extend the life of your roof.',
      10,
      doc.lastAutoTable.finalY + 55,
      { maxWidth: 190 }
    );

    // Save the PDF
    doc.save('VentScore_Report.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
    >
      Download PDF Report
    </button>
  );
};

export default ReportDownload;
