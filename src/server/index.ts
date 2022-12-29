import "../loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/usersRouter/usersRouter/usersRouter";
import endpoints from "../config/endpoints";
import generalError from "../middlewares/generalError/generalError";
import notFoundError from "../middlewares/notFoundError/notFoundError";
import validationError from "../middlewares/validationError/validationError";
import tokensRouter from "./routers/tokensRouter/tokensRouter";

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
app.use(endpoints.tokens.router, tokensRouter);

app.use(validationError);
app.use(notFoundError);
app.use(generalError);

export default app;
