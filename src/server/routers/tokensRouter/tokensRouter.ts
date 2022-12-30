import express from "express";
import { userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import generateToken from "../../../controllers/tokensControllers/tokensControllers";
import User from "../../../database/models/User";
import authentication from "../../../middlewares/authentication/authentication";
import findItem from "../../../middlewares/findItem/findItem";
import roleFilter from "../../../middlewares/roleFilter/roleFilter";
import tokenSchema from "../../../schemas/token.schema";
import Errors from "../../../services/Errors/Errors";
import validateRequest from "../../../services/validateRequest/validateRequest";

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

  roleFilter("admin"),
  generateToken
);

export default tokensRouter;
