import express from "express";
import { userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import {
  getAllUsers,
  logInUser,
  registerUser,
} from "../../../controllers/usersControllers/usersControllers";
import Token from "../../../database/models/Token";
import User from "../../../database/models/User";
import IToken from "../../../database/types/IToken";
import IUser from "../../../database/types/IUser";
import checkToken from "../../../middlewares/checkToken/checkToken";
import findItem from "../../../middlewares/findItem/findItem";
import logInSchema from "../../../schemas/logIn.schema";
import registerSchema from "../../../schemas/register.schema";
import validateRequest from "../../../services/validateRequest/validateRequest";
import {
  logInUserDoesNotExist,
  invalidSignUp,
  notFoundToken,
} from "./usersRouter.errors";

const usersRouter = express.Router();

const { root, logIn } = endpoints.users;

usersRouter.get(root, getAllUsers);

usersRouter.post(
  root,
  validateRequest(registerSchema),
  findItem<IToken>(Token, userMainIdentifier, notFoundToken, true), // El test peta aqui
  findItem<IUser>(User, userMainIdentifier, invalidSignUp),
  checkToken,
  registerUser
);

usersRouter.post(
  logIn,
  validateRequest(logInSchema),
  findItem<IUser>(User, userMainIdentifier, logInUserDoesNotExist, true),
  logInUser
);

export default usersRouter;
