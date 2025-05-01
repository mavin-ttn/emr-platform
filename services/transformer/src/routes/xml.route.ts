import express, { type Request, type Response, type Router } from "express";
import { convertXMLToJSON } from "../controller/xml.controller";

const router: Router = express.Router();

router.post("/xml-to-json", (req: Request, res: Response) => {
    convertXMLToJSON(req, res);
});

export default router;
