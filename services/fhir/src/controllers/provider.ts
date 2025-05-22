import { Request, Response } from 'express';
import { getPractitionerDetails } from '../services/provider';

export const fetchProviderDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, provider } = req.params;
  try {
    const authHeader = req.headers?.authorization || '';
    console.log('inside fetch provider details');
    const practitionerDetails = await getPractitionerDetails(
      userId,
      authHeader,
      provider
    );
    res.status(200).json(practitionerDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
