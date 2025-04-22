import { Request, Response } from 'express';
import { getPatientDetails } from '../services/patient';

export const fetchPatientDetails = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const authHeader = req.headers?.authorization || ''
    const patientDetails = await getPatientDetails(userId, authHeader);
    res.status(200).json(patientDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
