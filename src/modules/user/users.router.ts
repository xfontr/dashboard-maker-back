import express from "express";
import { findSignToken, findUser } from "../../common/middlewares/findItem";
import validateRequest from "../../common/services/validateRequest";
import ENDPOINTS from "../../config/endpoints";
import { logInSchema, registerSchema } from "./users.schema";
import {
  getAllUsers,
  getUserInfo,
  logInUser,
  logOutUser,
  refreshToken,
  registerUser,
} from "./users.controllers";
import userErrors from "./users.errors";
import authentication from "../../common/middlewares/authentication";
import authorization from "../../common/middlewares/authorization";

const usersRouter = express.Router();

const { root, logIn, refresh, logOut, userData } = ENDPOINTS.users;

// GET ALL USERS

usersRouter.get(
  root,
  authentication,
  authorization("GET_ALL_USERS"),
  getAllUsers
);

// GET USER INFO

usersRouter.get(
  userData,
  authentication,
  findUser({
    getValueFrom: "payload",
    specialError: userErrors.logInUserDoesNotExist,
  }),
  getUserInfo
);

// REGISTER

usersRouter.post(
  root,
  validateRequest(registerSchema),
  findSignToken({
    specialError: userErrors.notFoundToken,
  }),
  findUser({
    specialError: userErrors.invalidSignUp,
  }),
  registerUser
);

// LOG IN

usersRouter.post(
  logIn,
  validateRequest(logInSchema),
  findUser({
    specialError: userErrors.logInUserDoesNotExist,
  }),
  logInUser
);

// REFRESH TOKEN

usersRouter.get(
  refresh,
  findUser({
    attribute: "authToken",
    getValueFrom: "cookies",
    specialError: userErrors.noLinkedToken,
  }),
  refreshToken
);

// LOGOUT

usersRouter.patch(
  logOut,
  findUser({
    attribute: "authToken",
    getValueFrom: "cookies",
    specialError: userErrors.noLinkedToken,
  }),
  logOutUser
);

export default usersRouter;
