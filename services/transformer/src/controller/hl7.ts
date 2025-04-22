import { Request, Response } from "express";
import { promises as fsPromise } from "fs";
import chokidar from "chokidar";
import path from "path";

export const convertHL7ToJSON = async (req: Request, res: Response) => {
  try {
    const hl7Message = req.body.hl7Message;
    if (!hl7Message) {
      return res.status(400).json({ error: "HL7 message is required" });
    }

    const folderPath = path.resolve() + "/temp";

    const hl7FolderPath = path.join(folderPath, "HL7");
    await fsPromise.mkdir(hl7FolderPath, { recursive: true });

    const hl7FilePath = path.join(hl7FolderPath, "message.hl7");
    await fsPromise.writeFile(hl7FilePath, hl7Message);

    const watcher = chokidar.watch(`${folderPath}/HL7/fhir-output`, {
      persistent: true,
      ignoreInitial: true,
      ignored: /^\./,
    });

    watcher.on("add", async (filePath) => {
      console.log(`File ${filePath} has been added`);
      const fileExtension = filePath.split(".").pop();
      if (fileExtension === "json") {
        const data = await fsPromise.readFile(filePath, "utf-8");
        res.status(200).json(JSON.parse(data));
        watcher.close();
      }
    });
  } catch (error) {
    console.error("Error processing HL7 message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
