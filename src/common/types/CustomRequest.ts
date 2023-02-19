import { Request } from "express";
import ISignToken from "../../modules/signToken/signToken.types";
import IUser from "../../modules/user/users.types";
import Payload from "./Payload";

export type IStores = Partial<{
  payload: Payload;
  user: IUser;
  token: ISignToken;
}>;

interface CustomRequest extends Request, IStores {}

export default CustomRequest;
