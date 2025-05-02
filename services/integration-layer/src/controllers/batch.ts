import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const batchProcessingCallback = async (req: Request, res: Response): Promise<void> => {
  const fs = require("fs");
  const path = require("path");
  const os = require("os");
  const { promisify } = require("util");
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);
  const readdir = promisify(fs.readdir);
  const mkdir = promisify(fs.mkdir);

  const inputDir = path.join(__dirname, "./../input-batch-files");
  const outputDir = path.join(__dirname, "./../output-batch-files");
  const batchSize = 1000; // files per batch
  const concurrency = os.cpus().length * 2; // parallelism within each batch

  async function processFileContent(content: string) {
    //  transformation logic here
    return content.toUpperCase();
  }

  async function handleFile(filename: any) {
    const inputPath = path.join(inputDir, filename);
    const outputPath = path.join(outputDir, filename);

    try {
      const content = await readFile(inputPath, "utf8");
      const processed = await processFileContent(content);
      await writeFile(outputPath, processed, "utf8");
      console.log(`Processed: ${filename}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unknown error", err);
      }
    }
  }

  async function processBatch(batch: string[] | any[]) {
    let index = 0;
    const workers = Array.from({ length: concurrency }, async () => {
      while (index < batch.length) {
        const currentIndex = index++;
        await handleFile(batch[currentIndex]);
      }
    });
    await Promise.all(workers);
  }

  async function processAllFiles() {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    await mkdir(outputDir, { recursive: true });
    const files = await readdir(inputDir);
    console.log(`Total files: ${files.length}`);

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} (${batch.length} files)`);
      await processBatch(batch);
    }

    console.log("All files processed.");
  }

  // Start timer
  const startTime = Date.now();

  await processAllFiles();

  // End timer
  const endTime = Date.now();
  const timeTakenSeconds = ((endTime - startTime) / 1000).toFixed(2);

  res.status(200).send(`Successfully Processed in ${timeTakenSeconds} seconds`);
};



export const generateFilesCallback = async (req: Request, res: Response): Promise<void> => {
  const folderPath = path.join(__dirname, "./../input-batch-files");
  const totalFiles = 200_000;
  const batchSize = 1000;

  function generateRandomText() {
    const lines = [
      "Hello, this is a test file.",
      "Node.js is awesome.",
      "Random content goes here.",
      "Have a great day!",
      "Just another line.",
    ];
    const lineCount = Math.floor(Math.random() * 2) + 2;
    return Array.from(
      { length: lineCount },
      () => lines[Math.floor(Math.random() * lines.length)]
    ).join("\n");
  }

  // Step 1: Reset the folder
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(folderPath, { recursive: true });

  // Step 2: Create files in batches
  async function createFilesBatch(start: number): Promise<void> {
    for (let i = start; i < start + batchSize && i < totalFiles; i++) {
      const filePath = path.join(folderPath, `file_${i}.txt`);
      const content = generateRandomText();
      fs.writeFileSync(filePath, content);
    }

    if (start + batchSize < totalFiles) {
      return new Promise((resolve) => {
        setImmediate(() => {
          createFilesBatch(start + batchSize).then(resolve);
        });
      });
    }
  }

  // Await full completion of file creation
  await createFilesBatch(0);

  console.log(` Created ${totalFiles} files in "${folderPath}"`);
  res.send("Files created");
};

