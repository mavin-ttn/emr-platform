import express from "express";
import dotenv from "dotenv";

import { registerProxyRoutes } from "./routes/proxyRoutes.routes";
import { errorHandler } from "./middleware/errorHandler";
import { limiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Apply rate limiter to all routes
app.use(limiter);

app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

// Proxying to different services based on routes
registerProxyRoutes(app);

// Catch all for undefined routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});
