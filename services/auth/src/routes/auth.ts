import express from 'express';
import { standaloneLaunch, standaloneLaunchCallback, embeddedLaunch, embeddedLaunchCallback } from '../controllers/auth';

const router = express.Router();

router.get('/standalone/:provider', standaloneLaunch);
router.get('/callback', standaloneLaunchCallback);

router.get('/embedded', embeddedLaunch);
router.get('/embeddedCallback', embeddedLaunchCallback);

export default router;