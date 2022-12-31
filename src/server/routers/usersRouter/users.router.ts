import express from "express";
import { isTokenRequired, userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import {
  getAllUsers,
  logInUser,
  registerUser,
} from "../../../controllers/usersControllers/users.controllers";
import Token from "../../../database/models/Token";
import User from "../../../database/models/User";
import checkToken from "../../../middlewares/checkToken/checkToken";
import findItem from "../../../middlewares/findItem/findItem";
import logInSchema from "../../../schemas/logIn.schema";
import registerSchema from "../../../schemas/register.schema";
import Errors from "../../../services/Errors";
import validateRequest from "../../../services/validateRequest/validateRequest";

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
