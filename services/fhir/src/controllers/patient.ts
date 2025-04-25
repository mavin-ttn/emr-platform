import { Request, Response } from 'express';
import {
  getPatientDetails,
  getMedicationRequests,
  createPatient,
} from '../services/patient';

export const fetchPatientDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const authHeader = req.headers?.authorization || '';
    const patientDetails = await getPatientDetails(userId, authHeader);
    res.status(200).json(patientDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchMedicationRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { patientId } = req.params;
  try {
    const authHeader = req.headers?.authorization || '';
    const medicationRequests = await getMedicationRequests(
      patientId,
      authHeader
    );
    res.status(200).json(medicationRequests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPatientRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const patientData = req.body;
  try {
    const authHeader = req.headers?.authorization || '';
    const patientDetails = await createPatient(patientData, authHeader);
    res.status(201).json(patientDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
