import React from 'react';
import jsPDF from 'jspdf';
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
  // Helper functions to determine status color and text
  const getStatusColor = (compliance: number) => (compliance >= 100 ? '#28a745' : '#dc3545');
  const getStatusText = (compliance: number) => (compliance >= 100 ? 'Pass' : 'Fail');

  // Function to generate the PDF
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

    // Add Current NFA Details
    yPosition = doc.lastAutoTable.finalY || yPosition + 20;
    doc.text(`Required NFA: ${requiredNFA.toFixed(2)} sq inches`, 10, yPosition + 10);
    doc.text(`Current Exhaust NFA: ${exhaustNFA.toFixed(2)} sq inches`, 10, yPosition + 20);
    doc.text(`Current Intake NFA: ${intakeNFA.toFixed(2)} sq inches`, 10, yPosition + 30);

    // Compliance Status
    doc.setTextColor(getStatusColor(exhaustCompliance));
    doc.text(`Exhaust Compliance: ${exhaustCompliance.toFixed(2)}% (${getStatusText(exhaustCompliance)})`, 10, yPosition + 40);
    doc.setTextColor(getStatusColor(intakeCompliance));
    doc.text(`Intake Compliance: ${intakeCompliance.toFixed(2)}% (${getStatusText(intakeCompliance)})`, 10, yPosition + 50);

    // Proposed Ventilation System
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Proposed Ventilation System', 10, yPosition + 65);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: yPosition + 70,
      head: [['Vent Type', 'Quantity']],
      body: proposedVentilation.map((vent) => [vent.ventType, vent.quantity]),
    });

    // Add Proposed NFA Details
    yPosition = doc.lastAutoTable.finalY || yPosition + 70;
    doc.text(`Proposed Exhaust NFA: ${proposedExhaustNFA.toFixed(2)} sq inches`, 10, yPosition + 10);
    doc.text(`Proposed Intake NFA: ${proposedIntakeNFA.toFixed(2)} sq inches`, 10, yPosition + 20);

    // Proposed Compliance Status
    doc.setTextColor(getStatusColor(proposedExhaustCompliance));
    doc.text(`Proposed Exhaust Compliance: ${proposedExhaustCompliance.toFixed(2)}% (${getStatusText(proposedExhaustCompliance)})`, 10, yPosition + 30);
    doc.setTextColor(getStatusColor(proposedIntakeCompliance));
    doc.text(`Proposed Intake Compliance: ${proposedIntakeCompliance.toFixed(2)}% (${getStatusText(proposedIntakeCompliance)})`, 10, yPosition + 40);

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      'Balanced intake and exhaust ventilation prevents moisture buildup in winter and reduces heat in summer to extend the life of your roof.',
      10,
      yPosition + 55,
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
