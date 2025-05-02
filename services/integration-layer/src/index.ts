import express from 'express';
import batchRoutes from './routes/batch'; 
const app = express();
const port = 3001;

// Route for launching integration context
app.post('/launch-context', (req, res) => {
    // logic to handle launch context request
    res.status(200).json({ message: 'Launch context handled successfully' });
  });

// Route for handling webhook events
app.post('/hook-events', (req, res) => {
  // logic to process webhook events from other services
  res.status(200).json({ message: 'Webhook event processed' });
});

// Mount the routes
app.use('/', batchRoutes); 

app.listen(port, () => {
  console.log(`Integration Layer running at http://localhost:${port}`);
});