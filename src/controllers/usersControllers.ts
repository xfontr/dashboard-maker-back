import { NextFunction, Request, Response } from "express";
import codes from "../config/codes";
import User from "../database/models/User";
import IUser from "../database/types/IUser";
import ServeDatabase from "../services/ServeDatabase/ServeDatabase";
import CodedError from "../utils/CodedError/CodedError";
import {
  compareHash,
  createHash,
} from "../services/authentication/authentication";
import catchCodedError from "../utils/catchCodedError/catchCodedError";
import userMainIdentifier from "../config/database";
import Token from "../utils/Token/Token";
import LogInData from "../types/LogInData";

const Serve = ServeDatabase<IUser>(User);

const invalidSignUp = CodedError("conflict", "Invalid sign up data");
const invalidLogIn = CodedError(
  "notFound",
  `Invalid ${userMainIdentifier} or password`
);

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UsersService = Serve(next);
  const users = await UsersService.getAll();

  res.status(codes.success.ok).json({ users });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);

  const user: IUser = req.body;
  const UsersService = Serve(next);

  const doesUserExist = await UsersService.getByAttribute(
    userMainIdentifier,
    user[userMainIdentifier],
    invalidSignUp(Error("There's a user using the same email"))
  );

  if (doesUserExist === true) return;

  const password = (await tryThis(
    createHash,
    [user.password],
    "internalServerError"
  )) as string;

  if (!password) return;

  await UsersService.create({ ...user, password });

  res
    .status(codes.success.created)
    .json({ register: "User registered successfully" });
};

export const logInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const UsersService = Serve(next);

  const logInData: LogInData = req.body;

  const dbUser = await UsersService.getByAttribute(
    userMainIdentifier,
    logInData[userMainIdentifier],
    invalidLogIn(Error("User doesn't exist"))
  );

  if (dbUser === true) return;

  const isPasswordCorrect = await tryThis(
    compareHash,
    [logInData.password, (dbUser as IUser[])[0].password],
    "internalServerError"
  );

  if (!isPasswordCorrect) {
    next(
      CodedError(
        "badRequest",
        `Invalid ${userMainIdentifier} or password`
      )(Error("Invalid password"))
    );
    return;
  }

  res.status(codes.success.ok).json(Token((dbUser as IUser[])[0]));
};
