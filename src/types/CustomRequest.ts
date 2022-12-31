import { Request } from "express";
import IToken from "../database/types/IToken";
import IUser from "../database/types/IUser";
import Payload from "./Payload";

interface CustomRequest extends Request {
  payload?: Payload;
  user?: IUser;
  token?: IToken;
  authority?: IUser;
}

export default CustomRequest;
