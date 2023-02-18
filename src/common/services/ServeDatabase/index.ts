import Token from "../../../modules/signToken/SignToken.model";
import ISignToken from "../../../modules/signToken/signToken.types";
import User from "../../../modules/user/User.model";
import IUser from "../../../modules/user/users.types";
import ServeDatabase from "./ServeDatabase";

export const ServeUser = ServeDatabase<IUser>(User);

export const ServeToken = ServeDatabase<ISignToken>(Token);
