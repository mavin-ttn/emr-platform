import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

// Basic rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});

app.use(limiter); // Apply rate limiter to all routes

app.get('/health', (req, res) => {
  res.send({ status: 'OK' });
});

// Proxying to different services based on routes
app.use(
  '/auth',
  createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true })
);
app.use(
  '/fhir',
  createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true })
);

// Catch all for undefined routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message || 'Something went wrong!',
    });
  }
);

app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});
