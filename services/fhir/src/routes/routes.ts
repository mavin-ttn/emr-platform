import express from 'express';
import {
  fetchPatientDetails,
  fetchMedicationRequests,
  createPatientRequest,
  findAppointments,
  bookAppointment,
  fetchPatientSurgicalHistory,
  fetchPatientMedicalHistory,
  fetchPatientSocialHistory,
  fetchPatientAppointments,
} from '../controllers/patient';
import { fetchProviderDetails } from '../controllers/provider';

const router = express.Router();

router.get('/patient/:userId/:provider', fetchPatientDetails);
router.get('/medication-request/:patientId', fetchMedicationRequests);
router.post('/patient/create', createPatientRequest);
router.get('/practitioner/:userId/:provider', fetchProviderDetails);
router.post('/find-appointments', findAppointments);
router.post('/book-appointment', bookAppointment);
router.get('/patient-surgical-history/:patientId', fetchPatientSurgicalHistory);
router.get('/patient-medical-history/:patientId', fetchPatientMedicalHistory);
router.get('/patient-social-history/:patientId', fetchPatientSocialHistory);
router.get('/patient-appointments/:patientId', fetchPatientAppointments);
export default router;
