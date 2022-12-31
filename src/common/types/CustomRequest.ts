import { Request } from "express";
import IToken from "../../modules/token/token.types";
import IUser from "../../modules/user/users.types";
import Payload from "./Payload";

interface CustomRequest extends Request {
  payload?: Payload;
  user?: IUser;
  token?: IToken;
  authority?: IUser;
}

export default CustomRequest;
