import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes";
import { config } from "./config/config";

dotenv.config({ path: "./env" });

const app = express();
const port = config.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

start();
