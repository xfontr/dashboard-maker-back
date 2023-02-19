import express from "express";
import ENDPOINTS from "../../config/endpoints";
import { generateSignToken, verifySignToken } from "./signToken.controllers";
import authentication from "../../common/middlewares/authentication";
import { findSignToken, findUser } from "../../common/middlewares/findItem";
import { signTokenSchema, verifySignTokenSchema } from "./signToken.schema";
import validateRequest from "../../common/services/validateRequest";
import signTokenErrors from "./signToken.errors";

const { root, verify } = ENDPOINTS.signTokens;

const signTokensRouter = express.Router();

signTokensRouter.post(
  root,

  validateRequest(signTokenSchema),

  findSignToken({
    specialError: signTokenErrors.tokenAlreadyExists,
    skip: false,
  }),

  authentication,

  findUser({
    specialError: signTokenErrors.emailAlreadyRegistered,
  }),

  findUser({
    getValueFrom: "payload",
    specialError: signTokenErrors.unauthorizedToCreate,
  }),

  generateSignToken
);

signTokensRouter.post(
  verify,

  validateRequest(verifySignTokenSchema),

  findSignToken({
    specialError: signTokenErrors.signTokenNotFound,
  }),

  verifySignToken
);

export default signTokensRouter;
