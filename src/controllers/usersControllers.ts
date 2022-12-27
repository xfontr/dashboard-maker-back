import { NextFunction, Request, Response } from "express";
import codes from "../config/codes";
import User from "../database/models/User";
import IUser from "../database/types/IUser";
import ServeDatabase from "../services/ServeDatabase/ServeDatabase";

const Serve = ServeDatabase<IUser>(User);

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const UsersService = Serve(next);
  const users = await UsersService.getAll();

  res.status(codes.success.ok).json({ users });
};

export default getAllUsers;
