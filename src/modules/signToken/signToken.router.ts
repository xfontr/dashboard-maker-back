import express from "express";
import { MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import { generateSignToken, verifySignToken } from "./signToken.controllers";
import User from "../user/User.model";
import authentication from "../../common/middlewares/authentication";
import findItem from "../../common/middlewares/findItem";
import { signTokenSchema, verifySignTokenSchema } from "./signToken.schema";
import validateRequest from "../../common/services/validateRequest";
import signTokenErrors from "./signToken.errors";
import Token from "./SignToken.model";

const { root, verify } = ENDPOINTS.signTokens;

const signTokensRouter = express.Router();

signTokensRouter.post(
  root,

  validateRequest(signTokenSchema),
  authentication,

  findItem(User, MAIN_IDENTIFIER, signTokenErrors.emailAlreadyRegistered),
  findItem(User, MAIN_IDENTIFIER, signTokenErrors.unauthorizedToCreate, {
    getValueFrom: "payload",
  }),

  generateSignToken
);

signTokensRouter.post(
  verify,

  validateRequest(verifySignTokenSchema),

  findItem(Token, MAIN_IDENTIFIER, signTokenErrors.signTokenNotFound, {
    storeAt: "token",
  }),

  verifySignToken
);

export default signTokensRouter;
