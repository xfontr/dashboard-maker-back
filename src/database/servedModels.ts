import ServeDatabase from "../services/ServeDatabase/ServeDatabase";
import IOptions from "./types/IOptions";
import IToken from "./types/IToken";
import IUser from "./types/IUser";
import Options from "./models/Options";
import Token from "./models/Token";
import User from "./models/User";

export const ServeUser = ServeDatabase<IUser>(User);

export const ServeToken = ServeDatabase<IToken>(Token);

export const ServeOptions = ServeDatabase<IOptions>(Options);
