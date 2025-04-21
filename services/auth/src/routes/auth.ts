import express from 'express';
import {
  standaloneLaunch,
  standaloneLaunchCallback,
  embeddedLaunch,
  embeddedLaunchCallback,
} from '../controllers/auth';
import { HttpStatusCode } from '../enums';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(HttpStatusCode.OK).send('auth is healthy');
});
router.get('/standalone/:provider', standaloneLaunch);
router.get('/callback', standaloneLaunchCallback);
router.get('/embedded', embeddedLaunch);
router.get('/embeddedCallback', embeddedLaunchCallback);

export default router;
