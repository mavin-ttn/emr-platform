import express from 'express';
import {
  fetchPatientDetails,
  fetchMedicationRequests,
  createPatientRequest,
} from '../controllers/patient';
import { fetchProviderDetails } from '../controllers/provider';

const router = express.Router();

router.get('/Patient/:userId/:provider', fetchPatientDetails);
router.get('/medication-request/:patientId', fetchMedicationRequests);
router.post('/patient/create', createPatientRequest);
router.get('/practitioner/:userId', fetchProviderDetails);
export default router;
