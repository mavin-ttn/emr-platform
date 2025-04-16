import express from 'express';
import {
  standaloneLaunch,
  standaloneLaunchCallback,
  embeddedLaunch,
  embeddedLaunchCallback,
} from '../controllers/auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('auth is healthy');
});
router.get('/standalone', standaloneLaunch);
router.get('/embedded', embeddedLaunch);
router.get('/callback', standaloneLaunchCallback);
router.get('/embeddedCallback', embeddedLaunchCallback);

export default router;
