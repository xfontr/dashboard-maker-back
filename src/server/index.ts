import "../loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());

export default app;
