import express from "express";
import { userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import generateToken from "../../../controllers/tokensControllers/tokensControllers";
import User from "../../../database/models/User";
import findItem from "../../../middlewares/findItem/findItem";
import tokenSchema from "../../../schemas/token.schema";
import validateRequest from "../../../services/validateRequest/validateRequest";
import emailAlreadyRegistered from "./tokensRouter.error";

const { root } = endpoints.tokens;

const tokensRouter = express.Router();

tokensRouter.post(
  root,
  validateRequest(tokenSchema),
  findItem(User, userMainIdentifier, emailAlreadyRegistered),
  generateToken
);

export default tokensRouter;
