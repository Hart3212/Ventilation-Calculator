import { NextApiRequest, NextApiResponse } from 'next';

// Define the type for each vent in the ventilation array
type Vent = {
  type: 'intake' | 'exhaust'; // Allowed values for type
  ventType: string; // Matches the keys in ventNFAValues
  quantity: number; // Number of vents
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

// Use the Vent type in the calculateNFA function
const calculateNFA = (ventilation: Vent[]) => {
  return ventilation.reduce((totalNFA, vent) => {
    return totalNFA + (ventNFAValues[vent.ventType] || 0) * vent.quantity;
  }, 0);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { squareFootage, ventilation }: { squareFootage: number; ventilation: Vent[] } = req.body;

    if (!squareFootage || !ventilation || ventilation.length === 0) {
      return res.status(400).json({ message: 'Invalid inputs.' });
    }

    const atticSquareInches = squareFootage * 144;
    const requiredNFA = atticSquareInches / 150;

    // Use the Vent type inside the filter function
    const intakeNFA = calculateNFA(ventilation.filter((vent) => vent.type === 'intake'));
    const exhaustNFA = calculateNFA(ventilation.filter((vent) => vent.type === 'exhaust'));

    const intakeCompliance = (intakeNFA / requiredNFA) * 100;
    const exhaustCompliance = (exhaustNFA / requiredNFA) * 100;

    return res.status(200).json({
      requiredNFA,
      intakeNFA,
      exhaustNFA,
      intakeCompliance,
      exhaustCompliance,
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
