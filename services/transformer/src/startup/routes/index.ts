import express, { type Application } from "express";
import hl7 from "../../routes/hl7";
import cors from "cors";

export default function (app: Application): void {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/", hl7);
}
