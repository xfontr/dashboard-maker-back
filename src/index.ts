import "./loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import environment from "./config/environment";

const debug = Debug("dashboard-maker:index");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const startServer = () => {
  app.listen(environment.port, () => {
    debug(chalk.bgGreen(`Listening at port ${environment.port}`));
  });
};

startServer();
