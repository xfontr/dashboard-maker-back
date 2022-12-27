import "../loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/users";
import endpoints from "../config/endpoints";
import generalError from "../middlewares/generalError/generalError";
import notFoundError from "../middlewares/notFoundError/notFoundError";

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

app.use(notFoundError);
app.use(generalError);

export default app;
