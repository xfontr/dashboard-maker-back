import Token from "../../../modules/token/Token.model";
import IToken from "../../../modules/token/token.types";
import User from "../../../modules/user/User.model";
import IUser from "../../../modules/user/users.types";
import ServeDatabase from "./ServeDatabase";

export const ServeUser = ServeDatabase<IUser>(User);

export const ServeToken = ServeDatabase<IToken>(Token);
