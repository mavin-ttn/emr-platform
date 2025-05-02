import express, { type Request, type Response, type Router } from "express";
import { convertHL7ToJSON } from "../controller/hl7.controller";

const router: Router = express.Router();

router.post("/hl7-to-json", (req: Request, res: Response) => {
  convertHL7ToJSON(req, res);
});

export default router;
