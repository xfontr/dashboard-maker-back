import { NextFunction, Request, Response } from "express";
import codes from "../config/codes";
import User from "../database/models/User";
import IUser from "../database/types/IUser";
import ServeDatabase from "../services/ServeDatabase/ServeDatabase";
import CodedError from "../utils/CodedError/CodedError";
import { createHash } from "../services/authentication/authentication";
import catchCodedError from "../utils/catchCodedError/catchCodedError";

const Serve = ServeDatabase<IUser>(User);

const invalidSignUpData = CodedError("conflict", "Invalid sign up data");

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
    "email",
    user.email,
    invalidSignUpData(Error("There's a user using the same email"))
  );

  if (doesUserExist === true) return;

  const password = (await tryThis(
    createHash,
    user.password,
    "internalServerError"
  )) as string;

  if (!password) return;

  await UsersService.create({ ...user, password });

  res
    .status(codes.success.created)
    .json({ register: "User registered successfully" });
};
