import "./loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./modules/user/users.router";
import tokensRouter from "./modules/token/token.router";
import endpoints from "./config/endpoints";
import generalError from "./common/middlewares/generalError";
import notFoundError from "./common/middlewares/notFoundError";
import validationError from "./common/middlewares/validationError";

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

app.use(notFoundError);
app.use(validationError);
app.use(generalError);

export default app;
