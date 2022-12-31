import express from "express";
import findItem from "../../common/middlewares/findItem";
import Errors from "../../common/errors/Errors";
import validateRequest from "../../common/services/validateRequest";
import { isTokenRequired, userMainIdentifier } from "../../config/database";
import endpoints from "../../config/endpoints";
import Token from "../token/Token.model";
import checkToken from "./middlewares/checkToken";
import User from "./User.model";
import { logInSchema, registerSchema } from "./users.schema";
import { getAllUsers, logInUser, registerUser } from "./users.controllers";

const usersRouter = express.Router();

const { root, logIn } = endpoints.users;
const { users } = Errors;

usersRouter.get(root, getAllUsers);

// REGISTER

usersRouter.post(
  root,
  validateRequest(registerSchema),
  findItem(Token, userMainIdentifier, users.notFoundToken, {
    storeAt: "token",
    skip: !isTokenRequired,
  }),
  findItem(User, userMainIdentifier, users.invalidSignUp),
  checkToken({ skip: !isTokenRequired }),
  registerUser
);

// LOG IN

usersRouter.post(
  logIn,
  validateRequest(logInSchema),
  findItem(User, userMainIdentifier, users.logInUserDoesNotExist, {
    storeAt: "user",
  }),
  logInUser
);

export default usersRouter;
