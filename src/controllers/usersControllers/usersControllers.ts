import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import IUser from "../../database/types/IUser";
import {
  compareHash,
  createHash,
} from "../../services/authentication/authentication";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import FullToken from "../../utils/Token/FullToken";
import LogInData from "../../types/LogInData";
import { userMainIdentifier } from "../../config/database";
import { ServeToken, ServeUser } from "../../database/servedModels";
import CustomRequest from "../../types/CustomRequest";
import Errors from "../../services/Errors";

const { success } = codes;

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
    next(Errors.users.invalidRole);
    return;
  }

  const newUser = await UsersService.create({ ...user, password });
  if (!newUser) return;

  if (req.token) {
    await TokensService.deleteByAttribute(
      userMainIdentifier,
      user[userMainIdentifier]
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
  const tryThis = catchCodedError(next);

  const logInData: LogInData = req.body;
  const dbUser: IUser = req.user;

  const isPasswordCorrect = await tryThis(compareHash, [
    logInData.password,
    dbUser.password,
  ]);

  if (!isPasswordCorrect) {
    next(Errors.users.invalidPassword);
    return;
  }

  res.status(success.ok).json(FullToken(dbUser));
};
