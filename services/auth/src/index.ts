import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth';
import { appConfig } from './config';
import { HttpStatusCode } from './enums';
<<<<<<< HEAD
import routes from './routes/routes';
import cors from 'cors';

const app = express();

// Routes
app.use('/auth', authRoutes);
app.get('/healthCheck', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send('Service is healthy');
});

app.use(express.json());

=======
import cors from 'cors';

const path = require('path');
const app = express();
>>>>>>> d8f982e (merged both branches)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/auth', authRoutes);
app.get('/healthCheck', (req: Request, res: Response) => {
<<<<<<< HEAD
  res.status(200).send('Auth Service is healthy');
=======
  res.status(HttpStatusCode.OK).send('Service is healthy');
});
app.get('/', function (req, res) {
  console.log('serving');
  res.sendFile(path.join(__dirname, '/index.html'));
>>>>>>> d8f982e (merged both branches)
});

app.use((req, res, next) => {
  res.status(HttpStatusCode.NOT_FOUND).send('Not found!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send('Internal Server Error');
});

app.listen(appConfig.port, () => {
<<<<<<< HEAD
  console.log(`Auth Server running at ${appConfig.origin}`);
=======
  console.log(`Server running at ${appConfig.origin}`);
>>>>>>> d8f982e (merged both branches)
});
