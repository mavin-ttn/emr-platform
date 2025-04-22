import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});


app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});
