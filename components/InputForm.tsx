          import React, { useState } from 'react';
          import ReportDownload from './ReportDownload';

          const ventOptions = {
            exhaust: ['Ridge Vent', 'Box Vent', 'Turbine Vent', 'Wired Power Vent'],
            intake: ['Center Vent Soffit', 'Rectangular Soffit Vent (10x17)', 'Full Vent Soffit', 'Gable Vent'],
          };

          const InputForm: React.FC = () => {
            const [squareFootage, setSquareFootage] = useState<number | ''>('');
            const [ventilation, setVentilation] = useState<any[]>([]);
            const [proposedVentilation, setProposedVentilation] = useState<any[]>([]);
            const [intakeCompliance, setIntakeCompliance] = useState<number | null>(null);
            const [exhaustCompliance, setExhaustCompliance] = useState<number | null>(null);
            const [proposedIntakeCompliance, setProposedIntakeCompliance] = useState<number | null>(null);
            const [proposedExhaustCompliance, setProposedExhaustCompliance] = useState<number | null>(null);

            const getStatusColor = (compliance: number) => (compliance >= 100 ? 'green' : 'red');
            const getStatusText = (compliance: number) => (compliance >= 100 ? 'Pass' : 'Fail');

            // Handle adding vents for both systems
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

            // Handle form submission for current system
            const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();

              try {
                const response = await fetch('/api/calculate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ squareFootage, ventilation }),
                });

                if (!response.ok) {
                  throw new Error('Error calculating compliance');
                }

                const data = await response.json();

                setIntakeCompliance(Number(data.intakeCompliance));
                setExhaustCompliance(Number(data.exhaustCompliance));
              } catch (error) {
                alert('Error calculating compliance. Please check your inputs.');
              }
            };

            // Handle form submission for proposed system
            const handleProposedSubmit = async (e: React.FormEvent) => {
              e.preventDefault();

              try {
                const response = await fetch('/api/calculate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ squareFootage, ventilation: proposedVentilation }),
                });

                if (!response.ok) {
                  throw new Error('Error calculating proposed compliance');
                }

                const data = await response.json();

                setProposedIntakeCompliance(Number(data.intakeCompliance));
                setProposedExhaustCompliance(Number(data.exhaustCompliance));
              } catch (error) {
                alert('Error calculating proposed compliance. Please check your inputs.');
              }
            };

            return (
              <div>
                <form onSubmit={handleSubmit}>
                  <h2>Ventilation Compliance Calculator</h2>

                  <label>
                    Attic Square Footage (SF):
                    <input
                      type="number"
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(Number(e.target.value))}
                      required
                    />
                  </label>

                  <h3>Enter Your Current Ventilation System</h3>
                  <div>
                    <h4>Exhaust Vents</h4>
                    {ventOptions.exhaust.map((vent) => (
                      <div key={vent}>
                        <label>
                          {vent} Quantity:
                          <input
                            type="number"
                            min="0"
                            onChange={(e) => handleAddVent('exhaust', vent, Number(e.target.value), 'current')}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4>Intake Vents</h4>
                    {ventOptions.intake.map((vent) => (
                      <div key={vent}>
                        <label>
                          {vent} Quantity:
                          <input
                            type="number"
                            min="0"
                            onChange={(e) => handleAddVent('intake', vent, Number(e.target.value), 'current')}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <button type="submit">Calculate Compliance</button>
                </form>

                {intakeCompliance !== null && exhaustCompliance !== null && (
                  <div>
                    <h2>Results</h2>
                    <p>
                      <strong>Exhaust Compliance:</strong>{' '}
                      <span style={{ color: getStatusColor(exhaustCompliance) }}>
                        {exhaustCompliance}% ({getStatusText(exhaustCompliance)})
                      </span>
                    </p>
                    <p>
                      <strong>Intake Compliance:</strong>{' '}
                      <span style={{ color: getStatusColor(intakeCompliance) }}>
                        {intakeCompliance}% ({getStatusText(intakeCompliance)})
                      </span>
                    </p>
                  </div>
                )}

                {intakeCompliance !== null && exhaustCompliance !== null && (
                  <form onSubmit={handleProposedSubmit}>
                    <h3>Build a Proposed Ventilation System</h3>

                    <div>
                      <h4>Exhaust Vents</h4>
                      {ventOptions.exhaust.map((vent) => (
                        <div key={vent}>
                          <label>
                            {vent} Quantity:
                            <input
                              type="number"
                              min="0"
                              onChange={(e) => handleAddVent('exhaust', vent, Number(e.target.value), 'proposed')}
                            />
                          </label>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4>Intake Vents</h4>
                      {ventOptions.intake.map((vent) => (
                        <div key={vent}>
                          <label>
                            {vent} Quantity:
                            <input
                              type="number"
                              min="0"
                              onChange={(e) => handleAddVent('intake', vent, Number(e.target.value), 'proposed')}
                            />
                          </label>
                        </div>
                      ))}
                    </div>

                    <button type="submit">Calculate Proposed System</button>
                  </form>
                )}

                {proposedIntakeCompliance !== null && proposedExhaustCompliance !== null && (
                  <div>
                    <h2>Proposed Results</h2>
                    <p>
                      <strong>Exhaust Compliance:</strong>{' '}
                      <span style={{ color: getStatusColor(proposedExhaustCompliance) }}>
                        {proposedExhaustCompliance}% ({getStatusText(proposedExhaustCompliance)})
                      </span>
                    </p>
                    <p>
                      <strong>Intake Compliance:</strong>{' '}
                      <span style={{ color: getStatusColor(proposedIntakeCompliance) }}>
                        {proposedIntakeCompliance}% ({getStatusText(proposedIntakeCompliance)})
                      </span>
                    </p>
                  </div>
                )}

                <ReportDownload
                  currentVentilation={ventilation}
                  proposedVentilation={proposedVentilation}
                  currentExhaustCompliance={exhaustCompliance}
                  currentIntakeCompliance={intakeCompliance}
                  proposedExhaustCompliance={proposedExhaustCompliance}
                  proposedIntakeCompliance={proposedIntakeCompliance}
                />
              </div>
            );
          };

          export default InputForm;