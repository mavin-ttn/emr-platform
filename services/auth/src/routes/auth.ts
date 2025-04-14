import express from 'express';
import { standaloneLaunch, standaloneLaunchCallback, embeddedLaunch, embeddedLaunchCallback } from '../controllers/auth';

const router = express.Router();

router.get('/standalone', standaloneLaunch);
router.get('/embedded', embeddedLaunch);
router.get('/callback', standaloneLaunchCallback);
router.get('/embeddedCallback', embeddedLaunchCallback);

export default router;