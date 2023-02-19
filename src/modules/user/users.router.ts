import express from "express";
import findItem from "../../common/middlewares/findItem";
import validateRequest from "../../common/services/validateRequest";
import { IS_TOKEN_REQUIRED, MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import Token from "../signToken/SignToken.model";
import User from "./User.model";
import { logInSchema, registerSchema } from "./users.schema";
import {
  getAllUsers,
  logInUser,
  logOutUser,
  refreshToken,
  registerUser,
} from "./users.controllers";
import userErrors from "./users.errors";

const usersRouter = express.Router();

const { root, logIn, refresh, logOut } = ENDPOINTS.users;

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

// REFRESH TOKEN

usersRouter.get(
  refresh,
  findItem(User, "authToken", userErrors.noLinkedToken, {
    getValueFrom: "cookies",
    storeAt: "user",
  }),
  refreshToken
);

// LOGOUT

usersRouter.patch(
  logOut,
  findItem(User, "authToken", userErrors.noLinkedToken, {
    getValueFrom: "cookies",
    storeAt: "user",
  }),
  logOutUser
);

export default usersRouter;
