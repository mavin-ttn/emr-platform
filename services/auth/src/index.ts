import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth';
import { appConfig } from './config';
import { HttpStatusCode } from './enums';

const path = require('path');
const app = express();
// Routes
app.use('/auth', authRoutes);
app.get('/healthCheck', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send('Service is healthy');
});
app.get('/', function (req, res) {
  console.log('serving')
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use((req, res, next) => {
  res.status(HttpStatusCode.NOT_FOUND).send('Not found!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send('Internal Server Error');
});

app.listen(appConfig.port, () => {
  console.log(`Server running at ${appConfig.origin}`);
});