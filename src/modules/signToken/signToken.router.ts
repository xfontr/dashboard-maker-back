import express from "express";
import { MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import { generateToken, verifyToken } from "./signToken.controllers";
import User from "../user/User.model";
import authentication from "../../common/middlewares/authentication";
import findItem from "../../common/middlewares/findItem";
import { tokenSchema, verifyTokenSchema } from "./signToken.schema";
import validateRequest from "../../common/services/validateRequest";
import tokenErrors from "./signToken.errors";
import Token from "./SignToken.model";
import checkToken from "../../common/middlewares/checkToken";

const { root, verify } = ENDPOINTS.signTokens;

const signTokensRouter = express.Router();

signTokensRouter.post(
  root,

  validateRequest(tokenSchema),
  authentication,

  findItem(User, MAIN_IDENTIFIER, tokenErrors.emailAlreadyRegistered),
  findItem(User, MAIN_IDENTIFIER, tokenErrors.unauthorizedToCreate, {
    getValueFrom: "payload",
  }),

  generateToken
);

signTokensRouter.post(
  verify,

  validateRequest(verifyTokenSchema),

  findItem(Token, MAIN_IDENTIFIER, tokenErrors.tokenNotFound, {
    storeAt: "token",
  }),

  checkToken(),

  verifyToken
);

export default signTokensRouter;
