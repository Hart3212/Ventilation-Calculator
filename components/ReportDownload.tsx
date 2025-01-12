import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportDownloadProps {
  currentVentilation: any[];
  proposedVentilation: any[];
  currentExhaustCompliance: number;
  currentIntakeCompliance: number;
  proposedExhaustCompliance: number;
  proposedIntakeCompliance: number;
}

const ReportDownload: React.FC<ReportDownloadProps> = ({
  currentVentilation,
  proposedVentilation,
  currentExhaustCompliance,
  currentIntakeCompliance,
  proposedExhaustCompliance,
  proposedIntakeCompliance,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text('Ready Roof Ventilation Check Scorecard', 14, 20);

    // Add a line break
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Current Ventilation Plan
    doc.setFontSize(14);
    doc.text('Current Ventilation System:', 14, 35);

    doc.autoTable({
      startY: 40,
      head: [['Vent Type', 'Quantity']],
      body: currentVentilation.map((vent) => [vent.ventType, vent.quantity]),
      theme: 'grid',
    });

    doc.text(`Exhaust Compliance: ${currentExhaustCompliance}% (${getStatusText(currentExhaustCompliance)})`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Intake Compliance: ${currentIntakeCompliance}% (${getStatusText(currentIntakeCompliance)})`, 14, doc.lastAutoTable.finalY + 20);

    // Proposed Ventilation Plan
    doc.text('Proposed Ventilation System:', 14, doc.lastAutoTable.finalY + 40);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 45,
      head: [['Vent Type', 'Quantity']],
      body: proposedVentilation.map((vent) => [vent.ventType, vent.quantity]),
      theme: 'grid',
    });

    doc.text(
      `Exhaust Compliance: ${proposedExhaustCompliance}% (${getStatusText(proposedExhaustCompliance)})`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Intake Compliance: ${proposedIntakeCompliance}% (${getStatusText(proposedIntakeCompliance)})`,
      14,
      doc.lastAutoTable.finalY + 20
    );

    // Footer with recommendation
    doc.setFontSize(12);
    doc.text(
      'Balanced intake and exhaust ventilation prevents moisture buildup in winter and reduces heat in summer, extending shingle life.',
      14,
      doc.lastAutoTable.finalY + 40
    );

    // Save the PDF
    doc.save('Ventilation_Report.pdf');
  };

  const getStatusText = (compliance: number) => (compliance >= 100 ? 'Pass' : 'Fail');

  return <button onClick={generatePDF}>Download PDF Report</button>;
};

export default ReportDownload;