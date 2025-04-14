import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import helmet from 'helmet';
const path = require('path');


dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.get('/healthCheck', (req: Request, res: Response) => {
  res.status(200).send('Service is healthy');
});
app.get('/', function(req, res) {
  console.log('serving')
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use((req, res, next) => {
  res.status(404).send('Not found!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});