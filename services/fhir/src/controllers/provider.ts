import { Request, Response } from 'express';
import { getPractitionerDetails } from '../services/provider'

export const fetchProviderDetails = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const authHeader = req.headers?.authorization || ''
    const practitionerDetails = await getPractitionerDetails(userId, authHeader);
    res.status(200).json(practitionerDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};