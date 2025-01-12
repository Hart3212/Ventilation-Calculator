import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Extract inputs from the request body
    const { squareFootage, ventilation } = req.body;

    // Validate inputs
    if (!squareFootage || !Array.isArray(ventilation) || ventilation.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Please provide square footage and ventilation details.' });
    }

    // Convert attic square footage to square inches
    const atticSquareInches = squareFootage * 144;

    // Calculate required NFA (Net Free Area) based on 1/150 code requirement
    const requiredNFA = atticSquareInches / 150;

    // Ventilation NFA values (in square inches)
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

    // Calculate total NFA for intake and exhaust
    let intakeNFA = 0;
    let exhaustNFA = 0;

    ventilation.forEach((vent) => {
      const nfa = ventNFAValues[vent.ventType] * vent.quantity;
      if (vent.type === 'intake') {
        intakeNFA += nfa;
      } else if (vent.type === 'exhaust') {
        exhaustNFA += nfa;
      }
    });

    // Calculate compliance percentages
    const intakeCompliance = (intakeNFA / requiredNFA) * 100;
    const exhaustCompliance = (exhaustNFA / requiredNFA) * 100;

    // Return the results as a JSON response
    res.status(200).json({
      intakeCompliance: intakeCompliance.toFixed(2),
      exhaustCompliance: exhaustCompliance.toFixed(2),
      intakeStatus: intakeCompliance >= 100 ? 'Pass' : 'Fail',
      exhaustStatus: exhaustCompliance >= 100 ? 'Pass' : 'Fail',
    });
  } catch (error) {
    // Handle any unexpected server errors
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
}