import { Request } from "express";
import ISignToken from "../../modules/signToken/signToken.types";
import IUser from "../../modules/user/users.types";
import Payload from "./Payload";

interface CustomRequest extends Request {
  payload?: Payload;
  user?: IUser;
  token?: ISignToken;
}

export default CustomRequest;
