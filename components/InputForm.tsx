import React, { useState, useEffect } from 'react';
import ReportDownload from './ReportDownload';

const ventOptions = {
  exhaust: ['Ridge Vent', 'Box Vent', 'Turbine Vent', 'Wired Power Vent'],
  intake: ['Center Vent Soffit', 'Rectangular Soffit Vent (10x17)', 'Full Vent Soffit', 'Gable Vent'],
};

const ventNFAValues: Record<string, number> = {
  'Ridge Vent': 18,
  'Box Vent': 50,
  'Turbine Vent': 100,
  'Wired Power Vent': 150,
  'Center Vent Soffit': 18,
  'Rectangular Soffit Vent (10x17)': 28,
  'Full Vent Soffit': 60,
  'Gable Vent': 40,
};

const InputForm: React.FC = () => {
  const [squareFootage, setSquareFootage] = useState<number | ''>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [ventilation, setVentilation] = useState<any[]>([]);
  const [proposedVentilation, setProposedVentilation] = useState<any[]>([]);
  const [intakeCompliance, setIntakeCompliance] = useState<number | null>(null);
  const [exhaustCompliance, setExhaustCompliance] = useState<number | null>(null);
  const [requiredNFA, setRequiredNFA] = useState<number | null>(null);
  const [intakeNFA, setIntakeNFA] = useState<number | null>(null);
  const [exhaustNFA, setExhaustNFA] = useState<number | null>(null);
  const [proposedIntakeCompliance, setProposedIntakeCompliance] = useState<number | null>(null);
  const [proposedExhaustCompliance, setProposedExhaustCompliance] = useState<number | null>(null);
  const [proposedIntakeNFA, setProposedIntakeNFA] = useState<number | null>(null);
  const [proposedExhaustNFA, setProposedExhaustNFA] = useState<number | null>(null);

  const getStatusColor = (compliance: number) => (compliance >= 100 ? 'text-green-600' : 'text-red-600');
  const getStatusText = (compliance: number) => (compliance >= 100 ? 'Pass' : 'Fail');

  const calculateNFA = (ventilation: any[]) => {
    return ventilation.reduce((totalNFA, vent) => {
      return totalNFA + (ventNFAValues[vent.ventType] || 0) * vent.quantity;
    }, 0);
  };

  // Calculate current system
  useEffect(() => {
    if (squareFootage && ventilation.length > 0) {
      const atticSquareInches = squareFootage * 144;
      const requiredNFA = atticSquareInches / 150;
      setRequiredNFA(requiredNFA);

      const totalIntakeNFA = calculateNFA(ventilation.filter((vent) => vent.type === 'intake'));
      const totalExhaustNFA = calculateNFA(ventilation.filter((vent) => vent.type === 'exhaust'));
      setIntakeNFA(totalIntakeNFA);
      setExhaustNFA(totalExhaustNFA);

      setIntakeCompliance((totalIntakeNFA / requiredNFA) * 100);
      setExhaustCompliance((totalExhaustNFA / requiredNFA) * 100);
    }
  }, [squareFootage, ventilation]);

  // Calculate proposed system
  useEffect(() => {
    if (squareFootage && proposedVentilation.length > 0) {
      const atticSquareInches = squareFootage * 144;
      const requiredNFA = atticSquareInches / 150;

      const proposedIntakeNFA = calculateNFA(proposedVentilation.filter((vent) => vent.type === 'intake'));
      const proposedExhaustNFA = calculateNFA(proposedVentilation.filter((vent) => vent.type === 'exhaust'));

      setProposedIntakeNFA(proposedIntakeNFA);
      setProposedExhaustNFA(proposedExhaustNFA);

      setProposedIntakeCompliance((proposedIntakeNFA / requiredNFA) * 100);
      setProposedExhaustCompliance((proposedExhaustNFA / requiredNFA) * 100);
    }
  }, [squareFootage, proposedVentilation]);

  const handleAddVent = (type: string, ventType: string, quantity: number, system: string) => {
    const updateVentilation = (prevVentilation: any[]) => {
      const updatedVentilation = [...prevVentilation];
      const existingVentIndex = updatedVentilation.findIndex(
        (vent) => vent.type === type && vent.ventType === ventType
      );

      if (existingVentIndex !== -1) {
        updatedVentilation[existingVentIndex].quantity = quantity;
      } else {
        updatedVentilation.push({ type, ventType, quantity });
      }

      return updatedVentilation;
    };

    if (system === 'current') {
      setVentilation((prev) => updateVentilation(prev));
    } else if (system === 'proposed') {
      setProposedVentilation((prev) => updateVentilation(prev));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">Ready Roof</h1>
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Vent✅ Score</h2>

        {/* Customer Address Input */}
        <label className="block text-lg font-medium mb-4">
          Customer Address:
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            placeholder="Enter customer's address"
          />
        </label>

        {/* Attic Square Footage Input */}
        <label className="block text-lg font-medium">
          Attic Square Footage (SF):
          <input
            type="number"
            value={squareFootage}
            onChange={(e) => setSquareFootage(Number(e.target.value))}
            className="block w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            required
          />
        </label>

        {/* Current Ventilation Inputs */}
        <h3 className="text-xl font-bold mb-4">Current Ventilation System</h3>
        {Object.keys(ventOptions).map((type) => (
          <div key={type}>
            <h4 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} Vents</h4>
            {ventOptions[type as keyof typeof ventOptions].map((ventType) => (
              <div key={ventType} className="mb-4">
                <label className="block text-lg">
                  {ventType} Quantity:
                  <input
                    type="number"
                    onChange={(e) => handleAddVent(type, ventType, Number(e.target.value), 'current')}
                    className="block w-full mt-2 p-2 border rounded-lg"
                  />
                </label>
              </div>
            ))}
          </div>
        ))}

        {/* Current System Results */}
        {intakeCompliance !== null && exhaustCompliance !== null && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Current System Results</h2>
            <p>Required NFA: {requiredNFA?.toFixed(2)} square inches</p>
            <p>Exhaust NFA: {exhaustNFA?.toFixed(2)} square inches</p>
            <p>Intake NFA: {intakeNFA?.toFixed(2)} square inches</p>
            <p>Exhaust Compliance: <span className={getStatusColor(exhaustCompliance)}>{exhaustCompliance?.toFixed(2)}% ({getStatusText(exhaustCompliance!)})</span></p>
            <p>Intake Compliance: <span className={getStatusColor(intakeCompliance)}>{intakeCompliance?.toFixed(2)}% ({getStatusText(intakeCompliance!)})</span></p>
          </div>
        )}

        {/* Proposed Ventilation Inputs */}
        <h3 className="text-xl font-bold mt-10 mb-4">Build a Proposed Ventilation System</h3>
        {Object.keys(ventOptions).map((type) => (
          <div key={type}>
            <h4 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} Vents</h4>
            {ventOptions[type as keyof typeof ventOptions].map((ventType) => (
              <div key={ventType} className="mb-4">
                <label className="block text-lg">
                  {ventType} Quantity:
                  <input
                    type="number"
                    onChange={(e) => handleAddVent(type, ventType, Number(e.target.value), 'proposed')}
                    className="block w-full mt-2 p-2 border rounded-lg"
                  />
                </label>
              </div>
            ))}
          </div>
        ))}

        {/* Proposed System Results */}
        {proposedIntakeCompliance !== null && proposedExhaustCompliance !== null && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Proposed System Results</h2>
            <p>Required NFA: {requiredNFA?.toFixed(2)} square inches</p>
            <p>Proposed Exhaust NFA: {proposedExhaustNFA?.toFixed(2)} square inches</p>
            <p>Proposed Intake NFA: {proposedIntakeNFA?.toFixed(2)} square inches</p>
            <p>Proposed Exhaust Compliance: <span className={getStatusColor(proposedExhaustCompliance)}>{proposedExhaustCompliance?.toFixed(2)}% ({getStatusText(proposedExhaustCompliance!)})</span></p>
            <p>Proposed Intake Compliance: <span className={getStatusColor(proposedIntakeCompliance)}>{proposedIntakeCompliance?.toFixed(2)}% ({getStatusText(proposedIntakeCompliance!)})</span></p>
          </div>
        )}

        {/* PDF Download Button */}
        {(intakeCompliance !== null && exhaustCompliance !== null) || (proposedIntakeCompliance !== null && proposedExhaustCompliance !== null) ? (
          <ReportDownload
            customerAddress={customerAddress}
            currentVentilation={ventilation}
            intakeCompliance={intakeCompliance}
            exhaustCompliance={exhaustCompliance}
            proposedVentilation={proposedVentilation}
            proposedIntakeCompliance={proposedIntakeCompliance}
            proposedExhaustCompliance={proposedExhaustCompliance}
            requiredNFA={requiredNFA}
            intakeNFA={intakeNFA}
            exhaustNFA={exhaustNFA}
            proposedIntakeNFA={proposedIntakeNFA}
            proposedExhaustNFA={proposedExhaustNFA}
          />
        ) : null}
      </div>
    </div>
  );
};

export default InputForm;
