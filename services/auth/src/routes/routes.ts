import express from 'express';
import {
    fetchPatientDetails
} from '../controllers/patient'

const router = express.Router();


router.get('/Patient/:userId', fetchPatientDetails);

export default router;
