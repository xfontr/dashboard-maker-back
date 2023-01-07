import express from "express";
import findItem from "../../common/middlewares/findItem";
import validateRequest from "../../common/services/validateRequest";
import { IS_TOKEN_REQUIRED, MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import Token from "../token/Token.model";
import checkToken from "../../common/middlewares/checkToken";
import User from "./User.model";
import { logInSchema, registerSchema } from "./users.schema";
import { getAllUsers, logInUser, registerUser } from "./users.controllers";
import userErrors from "./users.errors";

const usersRouter = express.Router();

const { root, logIn } = ENDPOINTS.users;

usersRouter.get(root, getAllUsers);

// REGISTER

usersRouter.post(
  root,
  validateRequest(registerSchema),
  findItem(Token, MAIN_IDENTIFIER, userErrors.notFoundToken, {
    storeAt: "token",
    skip: !IS_TOKEN_REQUIRED,
  }),
  findItem(User, MAIN_IDENTIFIER, userErrors.invalidSignUp),
  checkToken({ skip: !IS_TOKEN_REQUIRED }),
  registerUser
);

// LOG IN

usersRouter.post(
  logIn,
  validateRequest(logInSchema),
  findItem(User, MAIN_IDENTIFIER, userErrors.logInUserDoesNotExist, {
    storeAt: "user",
  }),
  logInUser
);

export default usersRouter;
