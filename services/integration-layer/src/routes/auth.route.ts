import axios from "axios";
import express, { NextFunction, Request, Response } from "express";
import { throwError } from "../middleware/errorHandler.middleware";

const router = express.Router();

router.get(
  "/healthCheck",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get("http://localhost:3000/healthCheck");
      console.log(response.data);
      res.json(response.data);
    } catch (error: any) {
      throwError({
        message: error,
        errorType: "VALIDATION_ERROR",
      });
    }
  }
);

export default router;
