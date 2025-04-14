import express, { Request, Response } from "express";

import launchContextRoutes from "./routes/launchContext.route";
import hookEventRoutes from "./routes/hookEvent.route";
import authRoutes from "./routes/auth.route";

import { globalErrorHandler } from "./middleware/errorHandler.middleware";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(express.json());

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("🟢 Integration Layer Service Online");
});

app.use("/launch-context", launchContextRoutes);
app.use("/hook-events", hookEventRoutes);

// Microservices Communication
app.use("/auth", authRoutes);

//Global Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`🚀 API Gateway running at http://localhost:${port}`);
});
