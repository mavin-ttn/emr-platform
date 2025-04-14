import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Launch context received" });
});

export default router;
