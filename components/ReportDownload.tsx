import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportDownloadProps {
  customerAddress: string;
  currentVentilation: { ventType: string; quantity: number }[];
  proposedVentilation: { ventType: string; quantity: number }[];
  intakeCompliance: number;
  exhaustCompliance: number;
  proposedIntakeCompliance: number;
  proposedExhaustCompliance: number;
  requiredNFA: number;
  intakeNFA: number;
  exhaustNFA: number;
  proposedIntakeNFA: number;
  proposedExhaustNFA: number;
}

const ReportDownload: React.FC<ReportDownloadProps> = ({
  customerAddress,
  currentVentilation = [],
  intakeCompliance,
  exhaustCompliance,
  proposedVentilation = [],
  proposedIntakeCompliance,
  proposedExhaustCompliance,
  requiredNFA,
  intakeNFA,
  exhaustNFA,
  proposedIntakeNFA,
  proposedExhaustNFA,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Ready Roof VentCheck Scorecard', 105, 15, { align: 'center' });

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
    autoTable(doc, {
      startY: yPosition + 20,
      head: [['Vent Type', 'Quantity']],
      body: currentVentilation.map((vent) => [vent.ventType, vent.quantity]),
    });

    yPosition = (doc as any).getLastAutoTable().finalY + 10;

    // Current NFA Details
    doc.text(`Required NFA: ${requiredNFA.toFixed(2)} sq inches`, 10, yPosition);
    doc.text(`Current Exhaust NFA: ${exhaustNFA.toFixed(2)} sq inches`, 10, yPosition + 10);
    doc.text(`Current Intake NFA: ${intakeNFA.toFixed(2)} sq inches`, 10, yPosition + 20);

    // Proposed Ventilation System
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Proposed Ventilation System', 10, yPosition + 35);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: yPosition + 40,
      head: [['Vent Type', 'Quantity']],
      body: proposedVentilation.map((vent) => [vent.ventType, vent.quantity]),
    });

    yPosition = (doc as any).getLastAutoTable().finalY + 10;

    // Proposed NFA Details
    doc.text(`Proposed Exhaust NFA: ${proposedExhaustNFA.toFixed(2)} sq inches`, 10, yPosition);
    doc.text(`Proposed Intake NFA: ${proposedIntakeNFA.toFixed(2)} sq inches`, 10, yPosition + 10);

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
