import express from "express";
import { userMainIdentifier } from "../../config/database";
import endpoints from "../../config/endpoints";
import generateToken from "./token.controllers";
import User from "../user/User.model";
import authentication from "../../common/middlewares/authentication";
import findItem from "../../common/middlewares/findItem";
import roleFilter from "../../common/middlewares/roleFilter";
import tokenSchema from "./token.schema";
import Errors from "../../common/errors/Errors";
import validateRequest from "../../common/services/validateRequest";

const { root } = endpoints.tokens;
const { tokens } = Errors;

const tokensRouter = express.Router();

tokensRouter.post(
  root,

  validateRequest(tokenSchema),
  authentication,

  findItem(User, userMainIdentifier, tokens.emailAlreadyRegistered),
  findItem(User, userMainIdentifier, tokens.unauthorizedToCreate, {
    getValueFrom: "payload",
    storeAt: "authority",
  }),

  roleFilter,
  generateToken
);

export default tokensRouter;
