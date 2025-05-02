import express, { type Application } from "express";
import hl7 from "../../routes/hl7.route";
import xml from "../../routes/xml.route";
import cors from "cors";

export default function (app: Application): void {
  app.use(
    cors({
      origin: "http://localhost:5175",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/hl7", hl7);
  app.use("/xml", xml)

}
