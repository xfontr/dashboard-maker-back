import express from "express";
import { userMainIdentifier } from "../../../config/database";
import endpoints from "../../../config/endpoints";
import generateToken from "../../../controllers/tokensControllers/tokensControllers";
import User from "../../../database/models/User";
import IUser from "../../../database/types/IUser";
import findItem from "../../../middlewares/findItem/findItem";
import emailAlreadyRegistered from "./tokensRouter.error";

const { root } = endpoints.tokens;

const tokensRouter = express.Router();

tokensRouter.post(
  root,
  findItem<IUser>(User, userMainIdentifier, emailAlreadyRegistered),
  generateToken
);

export default tokensRouter;
