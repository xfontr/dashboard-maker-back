import express from "express";
import { userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import generateToken from "../../../controllers/tokensControllers/tokensControllers";
import Token from "../../../database/models/Token";
import IToken from "../../../database/types/IToken";
import findItem from "../../../middlewares/findItem/findItem";
import emailAlreadyRegistered from "./tokensRouter.error";

const { root } = endpoints.tokens;

const tokensRouter = express.Router();

tokensRouter.post(
  root,
  findItem<IToken>(Token, userMainIdentifier, emailAlreadyRegistered),
  generateToken
);

export default tokensRouter;
