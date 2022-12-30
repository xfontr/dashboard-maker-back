import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import User from "../../database/models/User";
import IUser from "../../database/types/IUser";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import CodedError from "../../utils/CodedError/CodedError";
import {
  compareHash,
  createHash,
} from "../../services/authentication/authentication";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import { userMainIdentifier } from "../../config/database";
import Token from "../../utils/Token/FullToken";
import LogInData from "../../types/LogInData";

const ServeUser = ServeDatabase<IUser>(User);

const invalidSignUp = CodedError("conflict", "Invalid sign up data");
const invalidLogIn = CodedError(
  "notFound",
  `Invalid ${userMainIdentifier} or password`
);

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const UsersService = ServeUser(next);

  const user: IUser = req.body;

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

  // TODO: Implement and test this, to cover more corner cases
  // if (!newUser) return;

  // TODO: Delete token from database once user is created

  res
    .status(success.created)
    .json({ register: "User registered successfully" });
};

export const logInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const UsersService = ServeUser(next);

  const logInData: LogInData = req.body;

  const dbUser = await UsersService.getByAttribute(
    userMainIdentifier,
    logInData[userMainIdentifier],
    invalidLogIn(Error("User doesn't exist"))
  );

  if (!dbUser || dbUser === true) return;

  const isPasswordCorrect = await tryThis(
    compareHash,
    [logInData.password, dbUser[0].password],
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

  res.status(success.ok).json(Token(dbUser[0]));
};
