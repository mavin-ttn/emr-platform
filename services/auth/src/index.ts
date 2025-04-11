import express, { Request, Response } from 'express';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.get('/healthCheck', (req: Request, res: Response) => {
  res.status(200).send('Service is healthy');
});

app.use((req, res, next) => {
  res.status(404).send('Not found!');
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});