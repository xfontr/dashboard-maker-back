import "../loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/users";
import endpoints from "../config/endpoints";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: "*",
  }),
  morgan("dev"),
  express.json()
);

app.use(endpoints.users.router, usersRouter);

export default app;
