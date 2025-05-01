import express from "express";
import dotenv from "dotenv";
import routes from "./startup/routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

routes(app);


app.listen(port, () => {
  console.log(`Transformer API running at http://localhost:${port}`);
});
