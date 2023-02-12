import express from "express";
import { MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import { generateToken, verifyToken } from "./token.controllers";
import User from "../user/User.model";
import authentication from "../../common/middlewares/authentication";
import findItem from "../../common/middlewares/findItem";
import roleFilter from "../../common/middlewares/roleFilter";
import { tokenSchema, verifyTokenSchema } from "./token.schema";
import validateRequest from "../../common/services/validateRequest";
import tokenErrors from "./token.errors";
import Token from "./Token.model";
import checkToken from "../../common/middlewares/checkToken";

const { root, verify } = ENDPOINTS.tokens;

const tokensRouter = express.Router();

tokensRouter.post(
  root,

  validateRequest(tokenSchema),
  authentication,

  findItem(User, MAIN_IDENTIFIER, tokenErrors.emailAlreadyRegistered),
  findItem(User, MAIN_IDENTIFIER, tokenErrors.unauthorizedToCreate, {
    getValueFrom: "payload",
    storeAt: "authority",
  }),

  roleFilter,
  generateToken
);

tokensRouter.post(
  verify,

  validateRequest(verifyTokenSchema),

  findItem(Token, MAIN_IDENTIFIER, tokenErrors.tokenNotFound, {
    storeAt: "token",
  }),

  checkToken(),

  verifyToken
);

export default tokensRouter;
