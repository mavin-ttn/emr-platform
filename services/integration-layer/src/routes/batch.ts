import express from 'express';
import {batchProcessingCallback,generateFilesCallback
} from '../controllers/batch';

const router = express.Router();

router.get('/batchProcessing', batchProcessingCallback);
router.get('/generateFiles', generateFilesCallback);
export default router;