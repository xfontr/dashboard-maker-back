import "./loadEnvironment";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usersRouter from "./modules/user/users.router";
import tokensRouter from "./modules/token/token.router";
import ENDPOINTS from "./config/endpoints";
import generalError from "./common/middlewares/generalError";
import notFoundError from "./common/middlewares/notFoundError";
import validationError from "./common/middlewares/validationError";
import ENVIRONMENT from "./config/environment";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({ credentials: true, origin: ENVIRONMENT.origin }),
  morgan("dev"),
  express.json(),
  cookieParser()
);

app.use(ENDPOINTS.users.router, usersRouter);
app.use(ENDPOINTS.tokens.router, tokensRouter);

app.use(notFoundError);
app.use(validationError);
app.use(generalError);

export default app;
