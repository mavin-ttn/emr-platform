import { Request, Response } from "express";
import { promises as fsPromise } from "fs";
import chokidar from "chokidar";
import path from "path";

export const convertXMLToJSON = async (req: Request, res: Response) => {
    try {
        const xmlMessage = req.body.xmlMessage;
        if (!xmlMessage) {
            return res.status(400).json({ error: "XML message is required" });
        }

        const folderPath = path.resolve() + "/temp";

        const xmlFolderPath = path.join(folderPath, "XML");
        await fsPromise.mkdir(xmlFolderPath, { recursive: true });

        const xmlFilePath = path.join(xmlFolderPath, "message.xml");
        await fsPromise.writeFile(xmlFilePath, xmlMessage);

        const watcher = chokidar.watch(`${folderPath}/XML/fhir-output`, {
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
        console.error("Error processing XML message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
