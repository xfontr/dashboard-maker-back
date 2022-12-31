import express from "express";
import { USER_MAIN_IDENTIFIER } from "../../config/database";
import ENDPOINTS from "../../config/endpoints";
import generateToken from "./token.controllers";
import User from "../user/User.model";
import authentication from "../../common/middlewares/authentication";
import findItem from "../../common/middlewares/findItem";
import roleFilter from "../../common/middlewares/roleFilter";
import tokenSchema from "./token.schema";
import validateRequest from "../../common/services/validateRequest";
import tokenErrors from "./token.errors";

const { root } = ENDPOINTS.tokens;

const tokensRouter = express.Router();

tokensRouter.post(
  root,

  validateRequest(tokenSchema),
  authentication,

  findItem(User, USER_MAIN_IDENTIFIER, tokenErrors.emailAlreadyRegistered),
  findItem(User, USER_MAIN_IDENTIFIER, tokenErrors.unauthorizedToCreate, {
    getValueFrom: "payload",
    storeAt: "authority",
  }),

  roleFilter,
  generateToken
);

export default tokensRouter;
