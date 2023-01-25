import { NextFunction, Request, Response } from "express";
import ERROR_CODES from "../../config/errorCodes";
import IUser from "./users.types";
import {
  compareHash,
  createHash,
  createRefreshToken,
  verifyRefreshToken,
} from "../../common/services/authentication";
import catchCodedError from "../../common/utils/catchCodedError";
import FullToken from "./utils/FullToken/FullToken";
import LogInData from "../../common/types/LogInData";
import { MAIN_IDENTIFIER } from "../../config/database";
import CustomRequest from "../../common/types/CustomRequest";
import { ServeToken, ServeUser } from "../../common/services/ServeDatabase";
import userErrors from "./users.errors";

const { success } = ERROR_CODES;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UsersService = ServeUser(next);
  const users = await UsersService.getAll();

  res.status(success.ok).json({ users });
};

export const registerUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const UsersService = ServeUser(next);
  const TokensService = ServeToken(next);

  const user: IUser = req.body;

  const password = (await tryThis(createHash, [user.password])) as string;
  if (!password) return;

  if (req.token && req.token.role !== user.role) {
    next(userErrors.invalidRole);
    return;
  }

  const newUser = await UsersService.create({ ...user, password });
  if (!newUser) return;

  if (req.token) {
    await TokensService.deleteByAttribute(
      MAIN_IDENTIFIER,
      user[MAIN_IDENTIFIER]
    );
  }

  res
    .status(success.created)
    .json({ register: "User registered successfully" });
};

export const logInUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const UsersService = ServeUser(next);
  const tryThis = catchCodedError(next);

  const logInData: LogInData = req.body;
  const dbUser: IUser = req.user;

  const isPasswordCorrect = await tryThis(compareHash, [
    logInData.password,
    dbUser.password,
  ]);

  if (!isPasswordCorrect) {
    next(userErrors.invalidPassword);
    return;
  }

  const authToken = FullToken(dbUser);

  const refreshAuthToken = createRefreshToken({
    id: dbUser.id,
    [MAIN_IDENTIFIER]: dbUser[MAIN_IDENTIFIER],
  });

  await UsersService.updateById(dbUser.id, { authToken: refreshAuthToken });

  res.cookie("authToken", refreshAuthToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(success.ok).json(authToken);
};

export const refreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const verifiedToken = verifyRefreshToken(req.cookies.authToken);

  if (!verifiedToken) {
    next(userErrors.forbiddenToken);
    return;
  }

  res.status(success.ok).json(FullToken(req.user));
};

export const logOutUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const UsersService = ServeUser(next);

  const dbResponse = await UsersService.updateById(req.user!.id, {
    authToken: "",
  });
  if (!dbResponse) return;

  res.status(success.ok).json({ logOut: "User logged out" });
};
