import "./loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import express from "express";
import environment from "./config/environment";

const debug = Debug("dashboard-maker:index");

const app = express();

const startServer = () => {
  app.listen(environment.port, () => {
    debug(chalk.bgGreen(`Listening at port ${environment.port}`));
  });
};

startServer();
