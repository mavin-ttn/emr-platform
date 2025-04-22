import express from 'express';
import {
    fetchPatientDetails, fetchMedicationRequests, createPatientRequest
} from '../controllers/patient'
import {fetchProviderDetails } from '../controllers/provider'

const router = express.Router();


router.get('/Patient/:userId', fetchPatientDetails);
router.get('/medication-request/:patientId', fetchMedicationRequests);
router.post('/patient/create', createPatientRequest)
router.get('/Practitioner/:userId', fetchProviderDetails);
export default router;
