import React from 'react';
import ReportDownload from './ReportDownload';

interface ResultsDisplayProps {
  intakeCompliance: number;
  exhaustCompliance: number;
  intakeStatus: string;
  exhaustStatus: string;
  userInputs?: any[];
  proposedInputs?: any[];
  squareFootage: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  intakeCompliance,
  exhaustCompliance,
  intakeStatus,
  exhaustStatus,
  userInputs,
  proposedInputs,
  squareFootage,
}) => {
  // Ensure valid arrays before rendering lists
  const currentVentilation = Array.isArray(userInputs) ? userInputs : [];
  const proposedVentilation = Array.isArray(proposedInputs) ? proposedInputs : [];

  return (
    <div>
      <h2>Results</h2>
      <p>
        <strong>Exhaust Compliance:</strong> {exhaustCompliance}% ({exhaustStatus})
      </p>
      <p>
        <strong>Intake Compliance:</strong> {intakeCompliance}% ({intakeStatus})
      </p>
      <p>
        <strong>Attic Square Footage:</strong> {squareFootage} SF
      </p>

      {/* Only show current ventilation if data is available */}
      {currentVentilation.length > 0 && (
        <>
          <h3>Your Current Ventilation Plan:</h3>
          <ul>
            {currentVentilation.map((input, index) => (
              <li key={index}>
                {input.type}: {input.ventType} - {input.quantity} units
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Only show proposed ventilation if data is available */}
      {proposedVentilation.length > 0 && (
        <>
          <h3>Your Proposed Ventilation Plan:</h3>
          <ul>
            {proposedVentilation.map((input, index) => (
              <li key={index}>
                {input.type}: {input.ventType} - {input.quantity} units
              </li>
            ))}
          </ul>
        </>
      )}

      <ReportDownload
  customerAddress="123 Main St"
  currentVentilation={currentVentilation}
  proposedVentilation={proposedVentilation}
  intakeCompliance={intakeCompliance}
  exhaustCompliance={exhaustCompliance}
  proposedIntakeCompliance={intakeCompliance}
  proposedExhaustCompliance={exhaustCompliance}
  requiredNFA={squareFootage * 144 / 150}
  intakeNFA={currentVentilation.reduce((total, vent) => total + (vent.quantity * 18), 0)}
  exhaustNFA={proposedVentilation.reduce((total, vent) => total + (vent.quantity * 18), 0)}
  proposedIntakeNFA={proposedVentilation.reduce((total, vent) => total + (vent.quantity * 18), 0)}
  proposedExhaustNFA={proposedVentilation.reduce((total, vent) => total + (vent.quantity * 18), 0)}
/>
    </div>
  );
};

export default ResultsDisplay;
